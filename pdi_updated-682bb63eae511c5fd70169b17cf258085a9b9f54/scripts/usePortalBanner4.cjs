const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  const startMarker1 = '{/* Institutional Top Bar */}';
  const startMarker2 = '{/* Premium Hero Banner */}';

  const hasStartMarker1 = content.includes(startMarker1);
  const hasStartMarker2 = content.includes(startMarker2);

  if (hasStartMarker1 || hasStartMarker2) {
    const startIdx = content.indexOf(hasStartMarker2 ? startMarker2 : startMarker1);
    
    // Find the end marker using regex
    const endRegex = /\{canEdit\(\) && \([\s\S]*?Edit Content[\s\S]*?<\/Button>\s*\)\}\s*<\/div>/;
    const endMatch = content.match(endRegex);

    if (startIdx !== -1 && endMatch) {
      const bannerEndIdx = endMatch.index + endMatch[0].length;
      const bannerBlock = content.substring(startIdx, bannerEndIdx);
      
      const portalBannerJSX = `<PortalBanner 
        title={\`\${data.mainTitle} \${data.italicTitle || ''}\`}
        subtitle={data.heroDesc}
        icon={Heart}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        className="mt-6 mb-16"
      />`;

      content = content.replace(bannerBlock, portalBannerJSX);
      
      if (!content.includes('PortalBanner')) {
        content = content.replace("import { Button } from '@/components/ui/button';", "import { Button } from '@/components/ui/button';\nimport { PortalBanner } from '@/components/layout/PortalBanner';");
      }
      if (!content.includes('Heart,')) {
        content = content.replace("from '@phosphor-icons/react';", "Heart,\n} from '@phosphor-icons/react';");
      }
      
      hasModifications = true;
    } else {
      console.log(`Failed to find end match in ${file}`);
    }
  }

  // Ensure backgroundImage is not passed so it renders as red
  if (content.includes('backgroundImage={data.heroImage}')) {
    content = content.replace('backgroundImage={data.heroImage}', '');
    hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated banner in ${file}`);
  }
}
