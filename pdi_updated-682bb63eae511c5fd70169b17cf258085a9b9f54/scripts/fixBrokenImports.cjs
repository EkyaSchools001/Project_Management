const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  // Fix the broken import syntax
  const brokenImportRegex = /}\s*Heart,\s*}\s*from '@phosphor-icons\/react';/g;
  if (brokenImportRegex.test(content)) {
    content = content.replace(brokenImportRegex, "  Heart\n} from '@phosphor-icons/react';");
    hasModifications = true;
  }

  // Also handle cases where Heart might have been added incorrectly multiple times
  if (content.includes('} Heart,')) {
      content = content.replace(/}\s*Heart,/, "  Heart\n}");
      hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in ${file}`);
  }
}
