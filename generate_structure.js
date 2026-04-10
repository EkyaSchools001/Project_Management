import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = process.cwd();
const outputFilePath = path.join(rootDir, 'docs', 'PROJECT_STRUCTURE.md');

const ignoreList = [
    'node_modules',
    '.git',
    '.agent',
    'dist',
    'coverage',
    '.DS_Store',
    'package-lock.json',
    'yarn.lock',
    '.env',
    'tailwindcss-14648.log', // Log files
    'generate_structure.js',
    'generate_structure.cjs' // If I make one
];

function getTree(dir, prefix = '') {
    let output = '';
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        return `${prefix} Error reading directory: ${err.message}\n`;
    }

    // Filter out ignored files/directories
    const filteredFiles = files.filter(file => !ignoreList.includes(file));

    // Sort: directories first, then files
    filteredFiles.sort((a, b) => {
        const aPath = path.join(dir, a);
        const bPath = path.join(dir, b);
        let aStat, bStat;
        try {
            aStat = fs.statSync(aPath);
            bStat = fs.statSync(bPath);
        } catch (e) {
            return 0; // Treat as equal if stat fails
        }

        if (aStat.isDirectory() && !bStat.isDirectory()) return -1;
        if (!aStat.isDirectory() && bStat.isDirectory()) return 1;
        return a.localeCompare(b);
    });

    filteredFiles.forEach((file, index) => {
        const isLast = index === filteredFiles.length - 1;
        const filePath = path.join(dir, file);
        let stats;
        try {
            stats = fs.statSync(filePath);
        } catch (e) {
            output += `${prefix}${isLast ? '└── ' : '├── '}${file} (Error)\n`;
            return;
        }

        output += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

        if (stats.isDirectory()) {
            output += getTree(filePath, prefix + (isLast ? '    ' : '│   '));
        }
    });
    return output;
}

const header = `# Project File Structure\n\nGenerated on: ${new Date().toLocaleString()}\n\n\`\`\`text\n${path.basename(rootDir)}\n`;
const treeContent = getTree(rootDir);
const footer = '\n\`\`\`\n';

fs.writeFileSync(outputFilePath, header + treeContent + footer);
console.log(`Structure saved to ${outputFilePath}`);
