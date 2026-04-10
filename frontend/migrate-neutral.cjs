const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /\bbg-\[#111c2a\]\b/g, replacement: 'bg-neutral-900' },
  { regex: /\bbg-\[#0f172a\]\b/g, replacement: 'bg-black' },
  { regex: /\bbg-\[#1e293b\]\b/g, replacement: 'bg-neutral-800' },
  { regex: /\bbg-brand-600\b/g, replacement: 'bg-neutral-800' },
  { regex: /\bborder-slate-800\b/g, replacement: 'border-neutral-800' },
  { regex: /\bborder-slate-700\b/g, replacement: 'border-neutral-700' },
  { regex: /\bborder-slate-600\b/g, replacement: 'border-neutral-600' },
  { regex: /\btext-gray-50\b/g, replacement: 'text-neutral-300' },
  { regex: /\btext-gray-100\b/g, replacement: 'text-neutral-300' },
  { regex: /\btailwindcss-animate\b/g, replacement: 'tailwindcss-animate' }
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
console.log('Migration to neutral complete.');
