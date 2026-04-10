const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /\bbg-white\b/g, replacement: 'bg-[#111c2a]' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-[#0f172a]' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-[#1e293b]' },
  { regex: /\btext-gray-900\b/g, replacement: 'text-gray-50' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-gray-100' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-gray-200' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-gray-300' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-gray-400' },
  { regex: /\bborder-gray-100\b/g, replacement: 'border-slate-800' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-slate-700' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-slate-600' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated:', filePath);
      }
    }
  }
}

processDir(srcDir);
console.log('Migration complete.');
