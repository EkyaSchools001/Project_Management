const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let hasModifications = false;

    // Check for inline banner
    if (content.includes('Institutional Top Bar')) {
        const startIdx = content.indexOf('{/* Institutional Top Bar */}');
        // Find "Edit Content"
        const editContentIdx = content.indexOf('Edit Content', startIdx);
        if (editContentIdx !== -1) {
            // Find the closing </div> of the banner
            const endDivIdx = content.indexOf('</div>', editContentIdx);
            if (endDivIdx !== -1) {
                // Find the next </div> which usually closes the banner container
                const finalEndDivIdx = content.indexOf('</div>', endDivIdx + 6);
                if (finalEndDivIdx !== -1) {
                    const bannerBlock = content.substring(startIdx, finalEndDivIdx + 6);
                    
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
                }
            }
        }
    }

    // Always remove backgroundImage prop to match the red screenshot style
    if (content.includes('backgroundImage={data.heroImage}')) {
        content = content.replace('backgroundImage={data.heroImage}', '');
        hasModifications = true;
    }

    if (hasModifications) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated banner in ${file}`);
    }
}
