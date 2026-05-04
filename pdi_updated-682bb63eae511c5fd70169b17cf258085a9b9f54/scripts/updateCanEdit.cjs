const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Update canEdit logic to be more inclusive
  const oldCanEdit = /const canEdit = \(\) => {[\s\S]*?return \["ADMIN", "SUPERADMIN", "TESTER"\]\.includes\(role\);[\s\S]*?};/;
  const newCanEdit = `const canEdit = () => {
    const role = user?.role?.toUpperCase() || "";
    // Allow any admin-like role or tester
    return ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER"].includes(role) || role.includes("ADMIN");
  };`;

  if (oldCanEdit.test(content)) {
    content = content.replace(oldCanEdit, newCanEdit);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated canEdit in ${file}`);
  }
}
