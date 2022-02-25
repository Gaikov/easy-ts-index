#!/usr/bin/env node
const fs = require("fs-extra");
const stdio = require("stdio");
const path = require("path");

const TS_FILE_REGEX = /\.ts$/gi;
const DTS_FILE_REGEX = /\.d\.ts$/gi;

const ops = stdio.getopt({
    "sources": {key: "s", args: 1, description: "Generate typescript index.ts", required: true},
    "clean": {key: "c", description: "Remove typescript index file"},
    "index": {key: "i", args: 1, description: "Index file name", default: "index.ts"},
});

const TS_SOURCES = path.resolve(ops.sources);
const TS_INDEX = path.resolve(ops.sources, ops.index);

function normalizePath(filePath) {
    return filePath.replace(/(\\|\/)+/g, "/");
}

function readFilesRecursive(folderPath) {
    const items = fs.readdirSync(folderPath, {encoding: "utf8"}).map(name => folderPath + "/" + name);
    let result = [];

    for (const path of items) {
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
            result = result.concat(readFilesRecursive(path));
        } else {
            result.push(path);
        }
    }

    return result;
}

function readSourceFilesList(folder) {
    const list = readFilesRecursive(folder);

    const sources = list.filter(filePath => {
        return filePath.match(TS_FILE_REGEX) && !filePath.match(DTS_FILE_REGEX);
    });

    return sources.map(filePath => {
        return filePath.replace(TS_FILE_REGEX, "");
    });
}

if (ops.clean) {
    console.log("...removing", TS_INDEX);
    if (fs.existsSync(TS_INDEX)) {
        fs.removeSync(TS_INDEX);
    }
} else if (ops.index) {
    console.log("...generating", TS_INDEX);

    const files = readSourceFilesList(TS_SOURCES).map(file => "./" + normalizePath(path.relative(TS_SOURCES, file)));
    files.sort();

    let index = "";
    for (const file of files) {
        index += `export * from "${file}";\n`;
    }

    fs.writeFileSync(TS_INDEX, index);
}



