const fs = require("fs");
const path = require("path");
const { fileExists, findFile, createFile } = require("./fileScanner");
const { fixImport } = require("./fileParser");

// Directory where the project is located
const projectRoot = path.join(__dirname, "test-project");

// List of files to scan
const filesToCheck = [
    path.join(projectRoot, "index.html"),
    path.join(projectRoot, "script.js"),
    path.join(projectRoot, "style.css")
];

console.log("🔍 Scanning for missing files...");

// Scan files for missing dependencies
filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, "utf8");
        const importRegex = /import\s+.*?["'](.+?)["']/g;
        let match;

        while ((match = importRegex.exec(content)) !== null) {
            let importedPath = match[1];
            let absolutePath = path.join(path.dirname(file), importedPath);

            if (!fileExists(absolutePath)) {
                console.log(`🚨 Missing File Detected in ${file}: ${importedPath}`);
                let correctPath = findFile(projectRoot, path.basename(importedPath));

                if (correctPath) {
                    let relativePath = path.relative(path.dirname(file), correctPath).replace(/\\/g, "/");
                    if (!relativePath.startsWith(".")) {
                        relativePath = "./" + relativePath;
                    }
                    fixImport(file, importedPath, relativePath);
                } else {
                    console.log(`❌ Could not find ${importedPath} anywhere in the project.`);
                    // Auto-create the missing file
                    createFile(absolutePath);
                    console.log(`✅ New empty file created: ${absolutePath}`);
                }
            }
        }
    }
});

console.log("✅ Auto-fix completed!");
