const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Even more inclusive canEdit
  const oldCanEdit = /const canEdit = \(\) => {[\s\S]*?};/;
  const newCanEdit = `const canEdit = () => {
    const role = user?.role?.toUpperCase() || "";
    const allowedRoles = ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "HEAD", "PRINCIPAL"];
    return allowedRoles.includes(role) || role.includes("ADMIN") || role.includes("LEAD") || role.includes("MANAGER");
  };`;

  if (oldCanEdit.test(content)) {
    content = content.replace(oldCanEdit, newCanEdit);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Finalized canEdit in ${file}`);
  }
}
