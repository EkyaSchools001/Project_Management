const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Define the headers we want to replace and their keys
  const headerReplacements = [
    { keyPrefix: 'overview', defaultSub: 'Overview', defaultTitle: 'WHAT THIS IS' },
    { keyPrefix: 'process', defaultSub: 'The Workflow', defaultTitle: 'PROCESS STEPS' },
    { keyPrefix: 'differentiation', defaultSub: 'Variations', defaultTitle: 'DIFFERENTIATION' },
    { keyPrefix: 'bestPractices', defaultSub: 'Best Practices', defaultTitle: "DO'S AND DON'TS" },
    { keyPrefix: 'glossary', defaultSub: 'Terminology', defaultTitle: 'GLOSSARY' }
  ];

  let hasModifications = false;

  // Add keys to data state
  const dataMatch = content.match(/const \[data, setData\] = useState\(\{([\s\S]*?)\}\);/);
  if (dataMatch) {
    let dataContent = dataMatch[1];
    let newFields = '';
    
    // Add missing keys
    for (const hr of headerReplacements) {
      if (!dataContent.includes(`${hr.keyPrefix}Subtitle:`)) {
        dataContent += `\n    ${hr.keyPrefix}Subtitle: "${hr.defaultSub}",`;
        dataContent += `\n    ${hr.keyPrefix}Title: "${hr.defaultTitle}",`;
        hasModifications = true;
      }
    }
    
    if (!dataContent.includes('quickTipTitle:')) {
      dataContent += `\n    quickTipTitle: "Quick Tip",`;
    }

    if (hasModifications) {
      content = content.replace(dataMatch[1], dataContent);
    }
  }

  // Add fields to PageEditorControls
  const fieldsMatch = content.match(/fields=\{\[([\s\S]*?)\]\}/);
  if (fieldsMatch) {
    let fieldsContent = fieldsMatch[1];
    
    // Quick tip title
    if (!fieldsContent.includes('"quickTipTitle"')) {
      const quickTipMatch = fieldsContent.match(/\{ key: "quickTip", label: "Quick Tip Text", type: "textarea" \},?/);
      if (quickTipMatch) {
        fieldsContent = fieldsContent.replace(
          quickTipMatch[0], 
          `{ key: "quickTipTitle", label: "Quick Tip Title", type: "input" },\n          ${quickTipMatch[0]}`
        );
        hasModifications = true;
      }
    }

    // Process section
    if (!fieldsContent.includes('"processSubtitle"')) {
      const processMatch = fieldsContent.match(/\{ key: "section_lists", label: "Process & Rules", type: "section" \},?/);
      if (processMatch) {
        fieldsContent = fieldsContent.replace(
          processMatch[0], 
          `${processMatch[0]}\n          { key: "processSubtitle", label: "Process Subtitle", type: "input" },\n          { key: "processTitle", label: "Process Title", type: "input" },`
        );
        hasModifications = true;
      }
    }
    
    // Add remaining headers before introText or corresponding sections
    if (!fieldsContent.includes('"overviewSubtitle"')) {
        const introMatch = fieldsContent.match(/\{ key: "introText"/);
        if (introMatch) {
            fieldsContent = fieldsContent.replace(
                /\{ key: "section_intro", label: "Introduction", type: "section" \},?/,
                `{ key: "section_intro", label: "Introduction", type: "section" },\n          { key: "overviewSubtitle", label: "Overview Subtitle", type: "input" },\n          { key: "overviewTitle", label: "Overview Title", type: "input" },`
            );
            hasModifications = true;
        }
    }
    
    if (!fieldsContent.includes('"differentiationSubtitle"')) {
        const diffMatch = fieldsContent.match(/\{ key: "differentiation"/);
        if (diffMatch) {
            fieldsContent = fieldsContent.replace(
                /\{ key: "differentiation", label: "Differentiation Text", type: "textarea" \},?/,
                `{ key: "differentiationSubtitle", label: "Differentiation Subtitle", type: "input" },\n          { key: "differentiationTitle", label: "Differentiation Title", type: "input" },\n          { key: "differentiation", label: "Differentiation Text", type: "textarea" },`
            );
            hasModifications = true;
        }
    }

    if (!fieldsContent.includes('"bestPracticesSubtitle"')) {
        const dosMatch = fieldsContent.match(/\{ key: "dos"/);
        if (dosMatch) {
            fieldsContent = fieldsContent.replace(
                /\{ \s*key: "dos",/g,
                `{ key: "bestPracticesSubtitle", label: "Best Practices Subtitle", type: "input" },\n          { key: "bestPracticesTitle", label: "Best Practices Title", type: "input" },\n          { key: "dos",`
            );
            hasModifications = true;
        }
    }

    if (!fieldsContent.includes('"glossarySubtitle"')) {
        const glossaryMatch = fieldsContent.match(/\{ \s*key: "glossary",/);
        if (glossaryMatch) {
            fieldsContent = fieldsContent.replace(
                /\{ \s*key: "glossary",/g,
                `{ key: "glossarySubtitle", label: "Glossary Subtitle", type: "input" },\n          { key: "glossaryTitle", label: "Glossary Title", type: "input" },\n          { key: "glossary",`
            );
            hasModifications = true;
        }
    }

    if (hasModifications) {
      content = content.replace(fieldsMatch[1], fieldsContent);
    }
  }

  // Replace hardcoded JSX tags
  if (hasModifications) {
    // Info Icon section -> overview
    content = content.replace(
      /<h2 className="text-sm font-black text-primary tracking-\[0\.3em\] uppercase">([^<]+)<\/h2>\s*<h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">([^<]+)<\/h3>/g,
      (match, sub, title, offset, string) => {
         // Determine which section it is based on preceding icon
         const prefixStr = string.substring(offset - 200, offset);
         if (prefixStr.includes('<Info')) return `<h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.overviewSubtitle || "${sub}"}</h2>\n              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.overviewTitle || "${title}"}</h3>`;
         if (prefixStr.includes('<ListChecks')) return `<h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.processSubtitle || "${sub}"}</h2>\n              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.processTitle || "${title}"}</h3>`;
         if (prefixStr.includes('<Sparkle')) return `<h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.differentiationSubtitle || "${sub}"}</h2>\n              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.differentiationTitle || "${title}"}</h3>`;
         if (prefixStr.includes('<CheckCircle')) return `<h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.bestPracticesSubtitle || "${sub}"}</h2>\n              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.bestPracticesTitle || "${title}"}</h3>`;
         if (prefixStr.includes('<BookOpen')) return `<h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.glossarySubtitle || "${sub}"}</h2>\n              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.glossaryTitle || "${title}"}</h3>`;
         return match;
      }
    );

    // Quick Tip title replace
    content = content.replace(
        /<h4 className="text-xl font-black text-amber-600 uppercase tracking-widest flex items-center gap-3">\s*Quick Tip\s*<\/h4>/g,
        `<h4 className="text-xl font-black text-amber-600 uppercase tracking-widest flex items-center gap-3">\n                 {data.quickTipTitle || "Quick Tip"}\n              </h4>`
    );

    // The Do's and The Don'ts inside Dos/Donts arrays
    // We can add fields for "The Do's" label and "The Don'ts" label if we want, but let's stick to the main ones for now.

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
