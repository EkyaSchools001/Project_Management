const fs = require('fs');
const path = require('path');

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (importPath.startsWith('.')) {
                    const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
                    // Handle missing extensions implicitly by checking if adding extensions matches
                    try {
                        const dirname = path.dirname(resolvedPath);
                        const basename = path.basename(resolvedPath);
                        if (!fs.existsSync(dirname)) continue;
                        const dirFiles = fs.readdirSync(dirname);
                        // Is there a case mismatch?
                        let found = false;
                        for (const dirFile of dirFiles) {
                            if (dirFile.toLowerCase() === basename.toLowerCase() || dirFile.toLowerCase().startsWith(basename.toLowerCase() + '.')) {
                                if (dirFile !== basename && !dirFile.startsWith(basename + '.')) {
                                    console.log(`CASE MISMATCH in ${fullPath}: imported '${importPath}', real file is '${dirFile}'`);
                                }
                                found = true;
                                break;
                            }
                        }
                    } catch (e) {
                         // Ignore
                    }
                }
            }
            
            const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
            while ((match = dynamicImportRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (importPath.startsWith('.')) {
                    const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
                    try {
                        const dirname = path.dirname(resolvedPath);
                        const basename = path.basename(resolvedPath);
                        if (!fs.existsSync(dirname)) continue;
                        const dirFiles = fs.readdirSync(dirname);
                        for (const dirFile of dirFiles) {
                            if (dirFile.toLowerCase() === basename.toLowerCase() || dirFile.toLowerCase().startsWith(basename.toLowerCase() + '.')) {
                                if (dirFile !== basename && !dirFile.startsWith(basename + '.')) {
                                    console.log(`CASE MISMATCH (dynamic) in ${fullPath}: imported '${importPath}', real file is '${dirFile}'`);
                                }
                                break;
                            }
                        }
                    } catch(e) {}
                }
            }
        }
    }
}

checkDir(path.join(__dirname, 'src'));
console.log('Done checking case mismatches.');
