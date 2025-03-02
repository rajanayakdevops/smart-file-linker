const fs = require("fs");
const cheerio = require("cheerio");

function parseHTML(filePath) {
    const htmlContent = fs.readFileSync(filePath, "utf-8");
    const $ = cheerio.load(htmlContent);

    let linkedCSS = $("link[rel='stylesheet']").map((i, el) => $(el).attr("href")).get();
    let linkedJS = $("script[src]").map((i, el) => $(el).attr("src")).get();

    return { linkedCSS, linkedJS };
}

function parseJS(filePath) {
    const jsContent = fs.readFileSync(filePath, "utf-8");

    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    const requireRegex = /require\(['"](.*?)['"]\)/g;

    let jsImports = [...jsContent.matchAll(importRegex)].map(match => match[1]);
    let jsRequires = [...jsContent.matchAll(requireRegex)].map(match => match[1]);

    return { jsImports, jsRequires };
}

function parseCSS(filePath) {
    const cssContent = fs.readFileSync(filePath, "utf-8");
    const cssImportRegex = /@import\s+['"](.*?)['"]/g;

    let importedCSS = [...cssContent.matchAll(cssImportRegex)].map(match => match[1]);

    return { importedCSS };
}

module.exports = { parseHTML, parseJS, parseCSS };
