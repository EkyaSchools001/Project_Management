const fs = require('fs');
const path = require('path');

const replacements = [
    // Tailwind classes
    { from: /blue-/g, to: 'red-' },
    { from: /sky-/g, to: 'rose-' },
    { from: /cyan-/g, to: 'red-' },
    { from: /indigo-/g, to: 'rose-' },
    { from: /violet-/g, to: 'red-' },
    { from: /purple-/g, to: 'red-' },
    { from: /fuchsia-/g, to: 'rose-' },
    
    // Hex codes (commonly used blues/purples)
    { from: /#0ea5e9/gi, to: '#ef4444' }, // Sky-500 -> Red-500
    { from: /#3b82f6/gi, to: '#ef4444' }, // Blue-500 -> Red-500
    { from: /#6366f1/gi, to: '#f43f5e' }, // Indigo-500 -> Rose-500
    { from: /#8b5cf6/gi, to: '#ef4444' }, // Violet-500 -> Red-500
    { from: /#7c3aed/gi, to: '#e11d48' }, // Violet-600 -> Rose-600
    { from: /#a78bfa/gi, to: '#fda4af' }, // Violet-300 -> Rose-300
    { from: /#c084fc/gi, to: '#fb7185' }, // Fuchsia-400 -> Rose-400
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
                console.log('Migrated to Red: ', p);
            }
        }
    });
}

run('frontend/src');
