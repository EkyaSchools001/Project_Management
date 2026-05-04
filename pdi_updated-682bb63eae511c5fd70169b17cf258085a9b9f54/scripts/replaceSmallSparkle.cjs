const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  // 1. Revert the giant EKYA watermark back to Sparkle
  const giantEkya = '<span className="text-[180px] font-black tracking-tighter leading-none select-none pointer-events-none">EKYA</span>';
  const giantSparkle = '<Sparkle size={200} weight="fill" />';
  if (content.includes(giantEkya)) {
    content = content.replace(giantEkya, giantSparkle);
    hasModifications = true;
  }

  // 2. Replace the small Sparkle icons inside the section headers with "EKYA" text
  const smallSparkle = '<Sparkle className="w-6 h-6" weight="duotone" />';
  // Let's use a stylish text representation
  const ekyaText = '<span className="text-[10px] font-black tracking-widest">EKYA</span>';
  
  if (content.includes(smallSparkle)) {
    // Replace globally
    content = content.replace(new RegExp(smallSparkle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ekyaText);
    hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated icons in ${file}`);
  }
}
