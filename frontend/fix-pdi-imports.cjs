const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            // Only process common text files
            if (/\.(ts|tsx|js|jsx|css|json)$/.test(file)) {
                results.push(file);
            }
        }
    });
    return results;
}

const pdiDir = path.resolve(__dirname, 'src/pdi');
const files = walk(pdiDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace @/ with @pdi/
    // We target common import patterns: FROM "@/" or IMPORT "@/" or URL("@/")
    const newContent = content.replace(/['"]@\//g, match => match[0] + '@pdi/');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
