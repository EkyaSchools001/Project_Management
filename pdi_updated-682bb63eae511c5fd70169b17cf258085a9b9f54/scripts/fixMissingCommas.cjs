const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the missing comma between ShieldCheck/other and Heart
  // The pattern is: Name without comma followed by newline and Heart
  const fixCommaRegex = /([a-zA-Z]+)\n\s+Heart/g;
  if (fixCommaRegex.test(content)) {
    content = content.replace(fixCommaRegex, "$1,\n  Heart");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed missing comma in ${file}`);
  }
}
