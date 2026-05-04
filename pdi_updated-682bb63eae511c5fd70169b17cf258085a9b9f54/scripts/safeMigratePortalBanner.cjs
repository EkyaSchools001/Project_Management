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

      // 1. Add PortalBanner and Sparkle imports
      if (!content.includes('PortalBanner')) {
        content = content.replace(
          /import {[\s\S]*?} from "@phosphor-icons\/react";/,
          (match) => match.replace('}', '  Sparkle,\n}')
        );
        content = content.replace(
          "import { PageEditorControls }",
          "import { PortalBanner } from '@/components/layout/PortalBanner';\nimport { PageEditorControls }"
        );
      }

      // 2. Replace the sticky header AND the hero section
      // We want to keep EVERYTHING below the hero section.
      // The hero section ends with </div> and then usually the next section starts.
      
      const headerStartRegex = /{\/\* Institutional Top Bar \*\/}/;
      const heroEndRegex = /<div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">/;

      if (headerStartRegex.test(content) && heroEndRegex.test(content)) {
        const parts = content.split(headerStartRegex);
        const prefix = parts[0];
        const rest = parts[1].split(heroEndRegex);
        const suffix = rest[1];

        const banner = `<PortalBanner 
        title={data.mainTitle + " " + data.italicTitle}
        subtitle={data.heroDesc || (data.introText ? data.introText.substring(0, 100) + "..." : "")}
        icon={Sparkle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        backgroundImage={data.heroImage}
        className="mt-6 mb-16"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">`;

        content = prefix + banner + suffix;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Successfully migrated ${fullPath}`);
      } else {
         console.log(`Skipping ${fullPath} - could not find markers`);
      }
    }
  }
}

processDir(baseDir);
