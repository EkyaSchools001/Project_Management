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

const customSectionField = `
          { key: "section_custom", label: "Custom Sections", type: "section" },
          { 
            key: "customSections", 
            label: "Add New Sections", 
            type: "list",
            itemFields: [
              { key: "title", label: "Section Title", type: "input" },
              { key: "image", label: "Section Image", type: "image" },
              { key: "content", label: "Section Content", type: "textarea" }
            ]
          }`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasModifications = false;

  // 1. Add customSections to data state
  const dataMatch = content.match(/const \[data, setData\] = useState\(\{([\s\S]*?)\}\);/);
  if (dataMatch && !dataMatch[1].includes('customSections:')) {
    // find the end of the object
    const replacedData = content.replace(dataMatch[0], dataMatch[0].replace(/(\s*)\}\);/, ',\n    customSections: []$1});'));
    if (replacedData !== content) {
      content = replacedData;
      hasModifications = true;
    }
  }

  // 2. Add customSections to PageEditorControls
  const fieldsMatch = content.match(/fields=\{\[([\s\S]*?)\]\}/);
  if (fieldsMatch && !fieldsMatch[1].includes('"customSections"')) {
    // Insert at the end of the fields array
    const replacedFields = content.replace(fieldsMatch[0], fieldsMatch[0].replace(/(\s*)\]\}/, `,${customSectionField}$1]}`));
    if (replacedFields !== content) {
      content = replacedFields;
      hasModifications = true;
    }
  }

  // 3. Render customSections at the end of the page content
  if (!content.includes('data.customSections.map')) {
    // The main container ends with:
    //       </div>
    //     </div>
    //   );
    // Let's find the last </div> before the final two closing divs, or just insert it right before the second to last </div>
    
    // We can do a string replacement on the last occurrence of "</div>\n    </div>\n  );"
    // Since it's a bit risky, let's find: `      </div>\n    </div>\n  );\n};`
    
    // Or we can look for `</section>\n\n      </div>\n    </div>`
    // Let's use regex to find the closing div of the space-y-24 container
    
    const containerEndRegex = /      <\/div>\s*<\/div>\s*\);\s*\};/g;
    
    // Wait, the container might be indented differently or not exactly end like this.
    // Let's do something simpler: replace the very last `</div>\n    </div>` in the file.
    
    const lastDivIndex = content.lastIndexOf('</div>\n    </div>');
    if (lastDivIndex !== -1) {
      content = content.slice(0, lastDivIndex) + customSectionJSX + content.slice(lastDivIndex);
      hasModifications = true;
    }
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added custom sections to ${file}`);
  }
}
