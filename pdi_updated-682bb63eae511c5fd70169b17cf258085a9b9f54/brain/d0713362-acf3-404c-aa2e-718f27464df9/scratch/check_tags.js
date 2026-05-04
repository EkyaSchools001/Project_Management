
import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\Admin\\Desktop\\PDI\\pdi_updated\\frontend\\src\\components\\UnifiedObservationForm.tsx', 'utf8');

const tags = ['Card', 'CardContent', 'CardHeader', 'div', 'form', 'Select', 'SelectContent', 'Popover', 'PopoverContent', 'Command', 'CommandGroup', 'RadioGroup'];

tags.forEach(tag => {
    const open = (content.match(new RegExp(`<${tag}(\\s|>)`, 'g')) || []).length;
    const close = (content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    const selfClose = (content.match(new RegExp(`<${tag}[^>]*/>`, 'g')) || []).length;
    console.log(`${tag}: Open=${open}, Close=${close}, SelfClose=${selfClose}, Net=${open - close - selfClose}`);
});

const bracesOpen = (content.match(/\{/g) || []).length;
const bracesClose = (content.match(/\}/g) || []).length;
console.log(`Braces: Open=${bracesOpen}, Close=${bracesClose}, Net=${bracesOpen - bracesClose}`);

const parensOpen = (content.match(/\(/g) || []).length;
const parensClose = (content.match(/\)/g) || []).length;
console.log(`Parens: Open=${parensOpen}, Close=${parensClose}, Net=${parensOpen - parensClose}`);
