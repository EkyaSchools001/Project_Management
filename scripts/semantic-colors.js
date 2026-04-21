const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Make semantic
            content = content.replace(/bg-zinc-900/g, 'bg-background');
            content = content.replace(/bg-zinc-800/g, 'bg-card');
            content = content.replace(/bg-slate-900/g, 'bg-background');
            content = content.replace(/bg-slate-800/g, 'bg-card');
            content = content.replace(/bg-[#18181b]/g, 'bg-background');
            content = content.replace(/bg-[#0B0E14]/gi, 'bg-background');
            content = content.replace(/bg-[#111520]/gi, 'bg-card');
            
            // Text color semantic mapping
            content = content.replace(/text-white/g, 'text-foreground');
            content = content.replace(/text-zinc-400/g, 'text-muted-foreground');
            content = content.replace(/text-slate-400/g, 'text-muted-foreground');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated semantics: ' + fullPath);
            }
        }
    }
}

replaceInFiles(path.join(process.cwd(), 'frontend/src'));
