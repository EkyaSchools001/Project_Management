
import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\Admin\\Documents\\ekya\\testing\\frontend\\src\\pdi\\pages\\LeaderDashboard.tsx', 'utf8');
const lines = content.split('\n');

let braceCount = 0;
let inJSX = 0;
let lineNum = 1;

for (let line of lines) {
    for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
    }
    if (braceCount < 0) {
        console.log(`Brace underflow at line ${lineNum}: ${line.trim()}`);
        braceCount = 0; // Reset
    }
    lineNum++;
}

console.log(`Final brace count: ${braceCount}`);
