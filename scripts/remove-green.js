const fs = require('fs');
const path = require('path');

function run(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            run(p);
        } else if (p.endsWith('.tsx') || p.endsWith('.jsx')) {
            let c = fs.readFileSync(p, 'utf8');
            let original = c;
            
            c = c.replace(/emerald-/g, 'violet-');
            c = c.replace(/green-/g, 'violet-');
            c = c.replace(/teal-/g, 'fuchsia-');
            c = c.replace(/#10b981/g, '#8b5cf6');
            c = c.replace(/#059669/g, '#7c3aed');
            c = c.replace(/#047857/g, '#6d28d9');
            
            if (c !== original) {
                fs.writeFileSync(p, c);
                console.log('updated ', p);
            }
        }
    });
}

run('frontend/src');
