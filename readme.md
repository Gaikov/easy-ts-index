# Typescript modules index generator
Easy to use typescript index file creator/generator. If you create npm modules in typescript this tool will help to easily create index file for your module. Launch it before your module compilation to generate index file and after to remove index file. Just need to specify sources folder path in command line options.
## Install
```
npm install easy-ts-index -g
```

## Parameters
```
USAGE: ts-index [OPTION1] [OPTION2]... arg1 arg2...
The following options are supported:
  -s, --sources <ARG1>  Generate typescript index.ts (required)
  -c, --clean           Remove typescript index file
  -i, --index <ARG1>    Index file name ("index.ts" by default)
```

## Example 1
```
ts-index ./src
```
Will generate "./src/index.ts" from local "./src" folder

## Example 2
```
ts-index ./src -c
```
Will remove "./src/index.ts" from local "./src" folder. Usually index.ts should be removed after each building to avoid local imports from index.ts and circular links. 