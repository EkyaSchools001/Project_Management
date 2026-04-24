const fs = require('fs');
const path = require('path');

const pdiSchemaPath = 'c:/Users/Admin/Documents/ekya/testing/pdi_updated_temp/database/prisma/schema.prisma';
const pdiSchema = fs.readFileSync(pdiSchemaPath, 'utf8');

// Extract models
const modelRegex = /^model\s+(\w+)\s+\{([\s\S]*?)\}/gm;
let match;
const pdiModels = {};

while ((match = modelRegex.exec(pdiSchema)) !== null) {
    pdiModels[match[1]] = match[2];
}

const conflictingModels = ['User', 'Course', 'Announcement', 'Notification', 'AuditLog', 'Document', 'Chat', 'ChatParticipant', 'MeetingRoom', 'Message', 'Project', 'Task', 'ProjectMembers', 'TaskAssignees', 'CourseEnrollment', 'DocumentAcknowledgement', 'SystemSettings'];

const renameMap = {
    'Course': 'PDICourse',
    'CourseEnrollment': 'PDICourseEnrollment',
    'Announcement': 'PDIAnnouncement',
    'AnnouncementAcknowledgement': 'PDIAnnouncementAcknowledgement',
    'Notification': 'PDINotification',
    'AuditLog': 'PDIAuditLog',
    'Document': 'PDIDocument',
    'DocumentAcknowledgement': 'PDIDocumentAcknowledgement',
    'SystemSettings': 'PDISystemSettings'
};

let output = '';

for (const modelName in pdiModels) {
    if (modelName === 'User') continue;
    if (modelName === 'Chat' || modelName === 'ChatParticipant' || modelName === 'MeetingRoom' || modelName === 'Message' || modelName === 'Project' || modelName === 'Task' || modelName === 'ProjectMembers' || modelName === 'TaskAssignees') {
         // These are stubs or already covered
         continue;
    }

    let finalName = renameMap[modelName] || modelName;
    let content = pdiModels[modelName];

    // Replace references in content
    for (const oldName in renameMap) {
        const replacement = renameMap[oldName];
        content = content.replace(new RegExp(`\\b${oldName}\\b`, 'g'), replacement);
        // Fix relations
        content = content.replace(new RegExp(`relation\\("${oldName}Creator"`, 'g'), `relation("PDI${oldName}Creator"`);
    }
    
    output += `model ${finalName} {${content}}\n\n`;
}

fs.writeFileSync('c:/Users/Admin/Documents/ekya/testing/scripts/pdi_schema_addition.prisma', output);

// Generate relations for User model
let userRelations = '';
const userContent = pdiModels['User'];
const relationLines = userContent.split('\n').filter(line => line.includes('[]') || line.includes('?'));

for (let line of relationLines) {
    if (line.includes('@id') || line.includes('@unique') || line.trim() === '') continue;
    
    let processedLine = line;
    for (const oldName in renameMap) {
        const replacement = renameMap[oldName];
        processedLine = processedLine.replace(new RegExp(`\\b${oldName}\\b`, 'g'), replacement);
    }
    userRelations += processedLine + '\n';
}

fs.writeFileSync('c:/Users/Admin/Documents/ekya/testing/scripts/pdi_user_relations.prisma', userRelations);
