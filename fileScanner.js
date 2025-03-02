const fs = require("fs");
const path = require("path");

// Function to check if a file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Function to find the correct path for a missing file
function findFile(projectRoot, missingFileName) {
    let result = null;

    function searchDirectory(directory) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const fullPath = path.join(directory, file);
            if (fs.statSync(fullPath).isDirectory()) {
                searchDirectory(fullPath);
            } else if (file === missingFileName) {
                result = fullPath;
                return;
            }
        }
    }

    searchDirectory(projectRoot);
    return result;
}

// Function to create a missing file
function createFile(filePath) {
    const dir = path.dirname(filePath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create an empty file
    fs.writeFileSync(filePath, "", "utf8");
    console.log(`🆕 Created missing file: ${filePath}`);
}

module.exports = { fileExists, findFile, createFile };
