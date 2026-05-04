const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the missing comma issue in the `useState` object
  // Looking for cases where the previous array ends with `]` and the next line starts with `overviewSubtitle` or similar
  
  if (content.match(/\]\s+overviewSubtitle/)) {
    content = content.replace(/\](\s+)overviewSubtitle/, '],$1overviewSubtitle');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed missing comma in ${file}`);
  } else if (content.match(/\]\s+quickTipTitle/)) { // Just in case quickTipTitle was added right after
    content = content.replace(/\](\s+)quickTipTitle/, '],$1quickTipTitle');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed missing comma (quickTipTitle) in ${file}`);
  }
}
