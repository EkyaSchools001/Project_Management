const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update canEdit logic
    const oldCanEdit = /const canEdit = \(\) => {[\s\S]*?return allowedRoles\.includes\(role\) \|\| role\.includes\("ADMIN"\) \|\| role\.includes\("LEAD"\) \|\| role\.includes\("MANAGER"\);[\s\n\r]*};/;
    
    const newCanEdit = `const canEdit = () => {
    const role = (user?.role || "").toUpperCase();
    const allowedRoles = ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "HEAD", "PRINCIPAL"];
    const isAllowed = allowedRoles.some(r => role.includes(r));
    return isAllowed;
  };`;

    if (oldCanEdit.test(content)) {
      content = content.replace(oldCanEdit, newCanEdit);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
       // Check if it has any canEdit at all
       if (!content.includes('canEdit={canEdit()}')) {
          console.log(`${file} is missing canEdit check in PortalBanner`);
       }
    }
  }
});
