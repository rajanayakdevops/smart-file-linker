const fs = require("fs");
const path = require("path");

function scanFiles(directory) {
    let files = [];
    fs.readdirSync(directory).forEach(file => {
        let fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(scanFiles(fullPath)); // Recursively scan directories
        } else {
            files.push(fullPath);
        }
    });
    return files;
}

module.exports = { scanFiles };
