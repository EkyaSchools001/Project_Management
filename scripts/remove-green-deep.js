const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /emerald-/g, to: 'violet-' },
    { from: /green-/g, to: 'violet-' },
    { from: /teal-/g, to: 'fuchsia-' },
    
    // Specific hex codes (Greens/Teals)
    { from: /#BAFF00/gi, to: '#8b5cf6' }, // Lime -> Violet
    { from: /#a8ed00/gi, to: '#7c3aed' }, // Lighter Lime -> Deep Violet
    { from: /#82ca9d/gi, to: '#a78bfa' }, // Recharts soft green -> Soft violet
    { from: /#00C49F/gi, to: '#c084fc' }, // Teal -> Purple
    { from: /#14b8a6/gi, to: '#8b5cf6' }, // Teal-500 -> Violet
    { from: /#064e3b/gi, to: '#4c1d95' }, // Deep green -> Deep violet
    { from: /#0f766e/gi, to: '#7c3aed' }, // Teal-700 -> Violet-600
    { from: /#3b522d/gi, to: '#4c1d95' }, // Dark army green -> Deep purple
    { from: /#c2cca6/gi, to: '#ddd6fe' }, // Light army green -> Violet-200
    { from: /#f4efe6/gi, to: '#f5f3ff' }, // Background warm -> Light violet tint
    { from: /#0088fe/gi, to: '#6366f1' }, // Blue (often used with greens) -> Indigo
    
    // Multi-color arrays in charts
    { from: /'#00C49F'/g, to: "'#a78bfa'" },
    { from: /'#82ca9d'/g, to: "'#c084fc'" },
];

function run(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            run(p);
        } else if (p.endsWith('.tsx') || p.endsWith('.jsx') || p.endsWith('.css') || p.endsWith('.js') || p.endsWith('.ts')) {
            let c = fs.readFileSync(p, 'utf8');
            let original = c;
            
            replacements.forEach(r => {
                c = c.replace(r.from, r.to);
            });
            
            if (c !== original) {
                fs.writeFileSync(p, c);
                console.log('Deep cleaned: ', p);
            }
        }
    });
}

run('frontend/src');
