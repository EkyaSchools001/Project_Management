const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const customSectionJSX = `
        {/* Custom Sections */}
        {data.customSections && data.customSections.map((section, idx) => (
          <section key={'custom-'+idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkle className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{section.title}</h3>
              </div>
            </div>
            
            {section.image && (
              <div className="mb-8 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
                <img src={section.image} alt={section.title || 'Custom Section Image'} className="w-full h-[400px] object-cover" />
              </div>
            )}
            
            {section.content && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                 <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {section.content}
                 </p>
              </div>
            )}
          </section>
        ))}
`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasModifications = false;

  // 3. Render customSections at the end of the page content
  if (!content.includes('data.customSections.map')) {
    // We can just use a regex replace to match `</div>\s*</div>\s*\);\s*\};`
    // and inject the JSX right before the first </div>
    const regex = /(      <\/div>\s*<\/div>\s*\);\s*\};)/;
    if (content.match(regex)) {
      content = content.replace(regex, `${customSectionJSX}\n$1`);
      hasModifications = true;
    } else {
      console.log(`Could not find injection point in ${file}`);
    }
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected custom JSX into ${file}`);
  }
}
