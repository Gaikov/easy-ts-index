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

function readFolderListing(folderPath) {
    const list = fs.readdirSync(folderPath, {encoding: "utf8"}).map(name => folderPath + "/" + name);
    let result = [];

    for (const filePath of list) {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            result = result.concat(readFolderListing(filePath));
        } else {
            result.push(filePath);
        }
    }

    return result;
}

function readSourcesFolder(folder, excludeFolders = []) {
    const list = readFolderListing(folder, excludeFolders);

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
    console.log("generating", TS_INDEX);

    const files = readSourcesFolder(TS_SOURCES).map(file => "./" + normalizePath(path.relative(TS_SOURCES, file)));
    files.sort();

    let index = "";
    for (const file of files) {
        index += `export * from "${file}";\n`;
    }

    fs.writeFileSync(TS_INDEX, index);
}



