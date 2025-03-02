const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { fileExists, findFile, createFile } = require("./fileScanner");
const { fixImport } = require("./fileParser");

const projectRoot = path.join(__dirname, "test-project");
const filesToCheck = [
    path.join(projectRoot, "index.html"),
    path.join(projectRoot, "script.js"),
    path.join(projectRoot, "style.css")
];

console.log("🔍 Scanning for missing files...");
let missingFiles = [];

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
                missingFiles.push({ file, missingPath: importedPath, absolutePath });
            }
        }
    }
});

if (missingFiles.length === 0) {
    console.log("✅ No missing files detected. Everything is fine!");
    process.exit(0);
}

// Prompt user using readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`Found ${missingFiles.length} missing files. Do you want to fix them? (Y/N) `, (answer) => {
    const userChoice = answer.trim().toUpperCase();

    if (userChoice === "Y") {
        missingFiles.forEach(({ file, missingPath, absolutePath }) => {
            let correctPath = findFile(projectRoot, path.basename(missingPath));

            if (correctPath) {
                let relativePath = path.relative(path.dirname(file), correctPath).replace(/\\/g, "/");
                if (!relativePath.startsWith(".")) {
                    relativePath = "./" + relativePath;
                }
                fixImport(file, missingPath, relativePath);
                console.log(`✅ Fixed import in ${file}: Updated path to ${relativePath}`);
            } else {
                console.log(`❌ Could not find ${missingPath}. Creating a new file...`);
                createFile(absolutePath);
            }
        });

        console.log("✅ Auto-fix completed!");
    } else {
        console.log("❌ Skipping auto-fix as per user choice.");
    }

    rl.close();
});
