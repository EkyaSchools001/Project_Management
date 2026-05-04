const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  // Fix "import {,"
  if (content.includes('import {,')) {
    content = content.replace('import {,', 'import {');
    hasModifications = true;
  }

  // Also fix double semicolons or other common syntax errors from previous scripts
  if (content.includes(';;')) {
      content = content.replace(/;;/g, ';');
      hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Final fix in ${file}`);
  }
}
