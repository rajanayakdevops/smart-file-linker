const path = require("path");
const { scanFiles } = require("./fileScanner");
const { parseHTML, parseJS, parseCSS } = require("./fileParser");

function buildRelationshipGraph(directory) {
    let files = scanFiles(directory);
    let graph = {};

    files.forEach(file => {
        const ext = path.extname(file);

        if (ext === ".html") {
            graph[file] = parseHTML(file);
        } else if (ext === ".js") {
            graph[file] = parseJS(file);
        } else if (ext === ".css") {
            graph[file] = parseCSS(file);
        }
    });

    return graph;
}

// Example Usage
const projectPath = "./test-project"; // Change this to your test project path
const relationshipGraph = buildRelationshipGraph(projectPath);
console.log(JSON.stringify(relationshipGraph, null, 2));
