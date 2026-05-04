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

      const brokenRegex = /<PortalBanner[\s\S]*?\/>[\s\n\r]*<\/p>[\s\n\r]*<\/div>[\s\n\r]*<\/section>/;
      // Fallback if there's some extra whitespace
      const brokenRegex2 = /<PortalBanner[\s\S]*?\/>[\s\n\r]*<\/p>[\s\n\r]*<\/div>[\s\n\r]*<\/section>/;

      const replacement = (title, subtitle, image) => `<PortalBanner 
        title={${title}}
        subtitle={${subtitle}}
        icon={Sparkle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        backgroundImage={${image}}
        className="mt-6 mb-16"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
        {/* Introduction */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Category 02</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">INTRODUCTION</h3>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
             <p className="text-xl text-slate-600 font-medium leading-relaxed">
              {data.introText}
             </p>
          </div>
        </section>`;

      // Very loose match to fix the mess
      const looseRegex = /<PortalBanner[\s\S]*?\/>[\s\S]*?<\/section>/;

      if (looseRegex.test(content)) {
        const titleMatch = content.match(/title={([\s\S]*?)}/);
        const subtitleMatch = content.match(/subtitle={([\s\S]*?)}/);
        const imageMatch = content.match(/backgroundImage={([\s\S]*?)}/);
        
        const title = titleMatch ? titleMatch[1] : 'data.mainTitle + " " + data.italicTitle';
        const subtitle = subtitleMatch ? subtitleMatch[1] : 'data.heroDesc';
        const image = imageMatch ? imageMatch[1] : 'data.heroImage';

        content = content.replace(looseRegex, replacement(title, subtitle, image));
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed ${fullPath}`);
      }
    }
  }
}

processDir(baseDir);
