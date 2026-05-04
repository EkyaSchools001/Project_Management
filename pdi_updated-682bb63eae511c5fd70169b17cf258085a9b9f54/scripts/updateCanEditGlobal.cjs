const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const oldCanEdit = /const canEdit = \(\) => {[\s\S]*?};/;
      const newCanEdit = `const canEdit = () => {
    const role = user?.role?.toUpperCase() || "";
    const allowedRoles = ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "HEAD", "PRINCIPAL"];
    return allowedRoles.includes(role) || role.includes("ADMIN") || role.includes("LEAD") || role.includes("MANAGER");
  };`;

      if (oldCanEdit.test(content)) {
        content = content.replace(oldCanEdit, newCanEdit);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated canEdit in ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, '../frontend/src/pages/edu-hub'));
