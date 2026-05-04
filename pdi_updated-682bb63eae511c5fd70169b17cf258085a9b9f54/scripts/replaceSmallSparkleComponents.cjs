const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../frontend/src/pages/edu-hub/components');
const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of componentFiles) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasModifications = false;

  const smallSparkle = '<Sparkle className="w-6 h-6" weight="duotone" />';
  const ekyaText = '<span className="text-[10px] font-black tracking-widest">EKYA</span>';
  
  if (content.includes(smallSparkle)) {
    content = content.replace(new RegExp(smallSparkle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ekyaText);
    hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated icons in ${file}`);
  }
}
