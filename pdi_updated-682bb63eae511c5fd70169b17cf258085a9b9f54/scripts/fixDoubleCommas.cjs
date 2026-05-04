const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the double comma issue
  if (content.includes(',,')) {
    content = content.replace(/,,/g, ',');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed double comma in ${file}`);
  }
}
