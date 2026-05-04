const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <Sparkle size={200} weight="fill" /> with "EKYA" text
  const target = '<Sparkle size={200} weight="fill" />';
  const replacement = '<span className="text-[180px] font-black tracking-tighter leading-none select-none pointer-events-none">EKYA</span>';

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced Sparkle with EKYA text in ${file}`);
  }
}
