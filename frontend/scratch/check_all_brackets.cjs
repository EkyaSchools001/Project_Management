const fs = require('fs');

function checkFile(path) {
    const content = fs.readFileSync(path, 'utf8');
    let openBraces = 0;
    let closeBraces = 0;
    let openParens = 0;
    let closeParens = 0;
    let openJSX = 0;
    let closeJSX = 0;

    for (let i = 0; i < content.length; i++) {
        if (content[i] === '{') openBraces++;
        if (content[i] === '}') closeBraces++;
        if (content[i] === '(') openParens++;
        if (content[i] === ')') closeParens++;
        if (content[i] === '<' && content[i+1] !== '/' && content[i+1] !== ' ' && !content[i+1].match(/[0-9]/)) {
            // Very basic JSX tag check
            if (content.substring(i, i+4) !== '<= ' && content.substring(i, i+3) !== '< ') {
                 openJSX++;
            }
        }
        if (content[i] === '<' && content[i+1] === '/') closeJSX++;
    }

    console.log(`File: ${path}`);
    console.log(`Braces: { ${openBraces}, } ${closeBraces}, diff: ${openBraces - closeBraces}`);
    console.log(`Parens: ( ${openParens}, ) ${closeParens}, diff: ${openParens - closeParens}`);
}

checkFile('src/pdi/pages/TeacherDashboard.tsx');
checkFile('src/pdi/pages/LeaderDashboard.tsx');
checkFile('src/pdi/components/TeacherProfileView.tsx');
