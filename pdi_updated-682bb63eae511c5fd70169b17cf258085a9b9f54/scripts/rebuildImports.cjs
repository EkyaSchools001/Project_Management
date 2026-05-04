const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('Heart') && content.includes('@phosphor-icons/react')) {
      // Find the import block
      const startIdx = content.indexOf('import {');
      const endIdx = content.indexOf('} from \'@phosphor-icons/react\';');
      if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
          let importBlock = content.substring(startIdx, endIdx);
          // Split by newline or comma
          let icons = importBlock.replace('import {', '').split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
          
          // Rebuild the import block neatly
          let newImportBlock = 'import {\n  ' + icons.join(',\n  ') + '\n';
          content = content.replace(importBlock, newImportBlock);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Rebuilt import block in ${file}`);
      }
  }
}
