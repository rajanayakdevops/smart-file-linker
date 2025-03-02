const fs = require("fs");

// Function to replace incorrect import paths with correct ones
function fixImport(filePath, oldPath, newPath) {
    let content = fs.readFileSync(filePath, "utf8");
    const fixedContent = content.replace(oldPath, newPath);

    if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, "utf8");
        console.log(`✅ Fixed import in ${filePath}: "${oldPath}" ➝ "${newPath}"`);
    }
}

module.exports = { fixImport };
