const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/pages/edu-hub/components/CoCurricularActivities.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add Sparkle and PortalBanner
content = content.replace('PencilSimple', 'PencilSimple,\n    Sparkle');
content = content.replace(
  "import { PageEditorControls }",
  "import { PortalBanner } from '@/components/layout/PortalBanner';\nimport { PageEditorControls }"
);

// Replace nav + header
const navRegex = /{\/\* Anchor Navigation \*\/}[\s\S]*?{!hideInternalBanner && \([\s\S]*?<\/header>[\s\n\r]*<\/div>[\s\n\r]*\)}/;

const bannerReplacement = `{!hideInternalBanner && (
                <PortalBanner
                    title="Student Development"
                    subtitle="Our co-curricular programs, student leadership, and wellbeing initiatives."
                    icon={Sparkle}
                    onBack={() => navigate('/edu-hub')}
                    onEdit={() => setIsEditorOpen(true)}
                    canEdit={canEdit()}
                    backgroundImage={data.heroImage}
                    className="mt-6 mb-12"
                >
                    <div className="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-none">
                        {sections.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all whitespace-nowrap"
                            >
                                {s.title}
                            </button>
                        ))}
                    </div>
                </PortalBanner>
            )}`;

if (navRegex.test(content)) {
  content = content.replace(navRegex, bannerReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated CoCurricularActivities.tsx');
} else {
  console.log('Could not find nav + header block');
}
