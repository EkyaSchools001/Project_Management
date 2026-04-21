const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /backgroundmerald/g, to: 'violet' },
    { from: /backgroundlue/g, to: 'violet' },
    { from: /backgroundackground/g, to: 'background' },
    { from: /backgroundmerald-500/g, to: 'violet-500' },
     { from: /backgroundlue-500/g, to: 'violet-500' },
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
                console.log('Fixed Typo: ', p);
            }
        }
    });
}

run('frontend/src');
