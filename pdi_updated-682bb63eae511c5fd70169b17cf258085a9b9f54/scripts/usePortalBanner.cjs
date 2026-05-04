const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  // 1. Check if it has the inline banner block
  const topBarStart = '{/* Institutional Top Bar */}';
  const topBarRegex = /\{\/\* Institutional Top Bar \*\/\}(.|\n)*?<\/div>\s*<\/div>/;
  
  // The banner ends with the Edit Content button
  const editContentRegex = /\{canEdit\(\) && \(\s*<Button(.|\n)*?Edit Content\s*<\/Button>\s*\)\}\s*<\/div>/;

  // If the file has the inline banner
  if (content.includes('Institutional Top Bar')) {
    // Find the start of the top bar
    const startIdx = content.indexOf('{/* Institutional Top Bar */}');
    
    // Find the end of the hero banner
    const endMatch = content.match(editContentRegex);
    
    if (startIdx !== -1 && endMatch) {
      const endIdx = endMatch.index + endMatch[0].length;
      
      const bannerBlock = content.substring(startIdx, endIdx);
      
      const portalBannerJSX = `<PortalBanner 
        title={\`\${data.mainTitle} \${data.italicTitle || ''}\`}
        subtitle={data.heroDesc}
        icon={Heart}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        backgroundImage={data.heroImage}
        className="-mx-4 md:mx-0 mt-6 mb-16"
      />`;

      content = content.replace(bannerBlock, portalBannerJSX);
      
      // Also import PortalBanner
      if (!content.includes('PortalBanner')) {
        content = content.replace("import { Button } from '@/components/ui/button';", "import { Button } from '@/components/ui/button';\nimport { PortalBanner } from '@/components/layout/PortalBanner';");
      }
      
      hasModifications = true;
    }
  }

  // Ensure Heart is imported from phosphor icons if used
  if (hasModifications && !content.includes('Heart,')) {
      content = content.replace('from \'@phosphor-icons/react\';', 'Heart, from \'@phosphor-icons/react\';');
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced inline banner with PortalBanner in ${file}`);
  }
}
