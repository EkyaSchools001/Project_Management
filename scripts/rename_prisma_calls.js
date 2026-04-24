const fs = require('fs');
const path = require('path');

const dirs = [
    'c:/Users/Admin/Documents/ekya/testing/server/src/controllers/pdi',
    'c:/Users/Admin/Documents/ekya/testing/server/src/routes/pdi'
];

const renameMap = {
    'course': 'pDICourse',
    'courseEnrollment': 'pDICourseEnrollment',
    'announcement': 'pDIAnnouncement',
    'announcementAcknowledgement': 'pDIAnnouncementAcknowledgement',
    'notification': 'pDINotification',
    'auditLog': 'pDIAuditLog',
    'document': 'pDIDocument',
    'documentAcknowledgement': 'pDIDocumentAcknowledgement',
    'systemSettings': 'pDISystemSettings'
};

// Case sensitive replacements for prisma client access
// prisma.course -> prisma.pDICourse
// prisma.courseEnrollment -> prisma.pDICourseEnrollment
// etc.

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            processDir(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;

            for (const oldName in renameMap) {
                const newName = renameMap[oldName];
                const regex = new RegExp(`prisma\\.${oldName}\\b`, 'g');
                if (regex.test(content)) {
                    content = content.replace(regex, `prisma.${newName}`);
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

dirs.forEach(processDir);
