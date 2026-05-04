const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../frontend/src/pages/edu-hub/learning-areas');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // 1. Add PortalBanner import if missing
      if (!content.includes('import { PortalBanner }')) {
        content = content.replace(
          "import { PageEditorControls }",
          "import { PortalBanner } from '@/components/layout/PortalBanner';\nimport { PageEditorControls }"
        );
      }

      // 2. Identify the header + hero block
      // Usually from <div className="sticky top-0 ... to the end of the hero div
      const heroRegex = /{\/\* Institutional Top Bar \*\/}[\s\S]*?{canEdit\(\) && \([\s\S]*?<\/div>[\s\S]*?<\/div>/;
      
      const newBanner = `<PortalBanner 
        title={data.mainTitle + " " + data.italicTitle}
        subtitle={data.heroDesc || data.introText?.substring(0, 100) + "..."}
        icon={Sparkle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        backgroundImage={data.heroImage}
        className="mt-6 mb-16"
      />`;

      if (heroRegex.test(content)) {
        content = content.replace(heroRegex, newBanner);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath} to use PortalBanner`);
      }
    }
  }
}

processDir(baseDir);
