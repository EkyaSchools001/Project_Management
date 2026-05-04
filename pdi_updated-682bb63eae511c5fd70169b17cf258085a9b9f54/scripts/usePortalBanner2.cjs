const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  const startMarker = '{/* Institutional Top Bar */}';
  const endMarker = '          </Button>\n        )}\n      </div>';

  if (content.includes(startMarker)) {
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker, startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
      const bannerEndIdx = endIdx + endMarker.length;
      const bannerBlock = content.substring(startIdx, bannerEndIdx);
      
      const portalBannerJSX = `<PortalBanner 
        title={\`\${data.mainTitle} \${data.italicTitle || ''}\`}
        subtitle={data.heroDesc}
        icon={Heart}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        className="-mx-4 md:mx-0 mt-6 mb-16"
      />`;

      content = content.replace(bannerBlock, portalBannerJSX);
      
      if (!content.includes('PortalBanner')) {
        content = content.replace("import { Button } from '@/components/ui/button';", "import { Button } from '@/components/ui/button';\nimport { PortalBanner } from '@/components/layout/PortalBanner';");
      }
      if (!content.includes('Heart,')) {
        content = content.replace("from '@phosphor-icons/react';", "Heart,\n} from '@phosphor-icons/react';");
      }
      
      hasModifications = true;
    }
  }

  // Also fix SchoolAssemblyPage and others that already use PortalBanner but with backgroundImage
  // The user wants it to look like the red banner, which means no backgroundImage.
  if (content.includes('backgroundImage={data.heroImage}')) {
    content = content.replace('backgroundImage={data.heroImage}', '');
    hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced inline banner with PortalBanner in ${file}`);
  }
}
