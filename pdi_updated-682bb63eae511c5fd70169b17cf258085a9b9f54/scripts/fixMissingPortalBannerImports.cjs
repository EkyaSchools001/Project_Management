const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('<PortalBanner') && !content.includes("import { PortalBanner }")) {
    content = content.replace("import { Button } from '@/components/ui/button';", "import { Button } from '@/components/ui/button';\nimport { PortalBanner } from '@/components/layout/PortalBanner';");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added PortalBanner import to ${file}`);
  }
}
