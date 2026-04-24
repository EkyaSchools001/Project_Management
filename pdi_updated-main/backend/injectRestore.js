const fs = require('fs');

let content = fs.readFileSync('src/seed.ts', 'utf8');

const injectionPoint = "console.log('Seeding database (preserving existing data)...');";

const restoreLogic = `
    const fsLib = require('fs');
    const pathLib = require('path');
    const backupPath = pathLib.join(__dirname, 'data', 'full_database_backup.json');
    
    if (fsLib.existsSync(backupPath)) {
        console.log('📦 Found full database backup. Restoring from backup...');
        const backupData = JSON.parse(fsLib.readFileSync(backupPath, 'utf8'));
        
        // Define exact deletion order (children first, parents last) to avoid foreign key errors
        const models = [
            'auditLog', 'surveyAnswer', 'surveyResponse', 'surveyQuestion', 'survey',
            'assessmentAttempt', 'assessmentAssignment', 'assessmentQuestion', 'assessment',
            'learningFestivalApplication', 'learningFestival', 'postOrientationAssessment',
            'dashboardWidget', 'dashboard', 'widgetType', 'formWorkflow', 'formTemplate',
            'announcementAcknowledgement', 'announcement', 'notification', 'courseEnrollment', 'course',
            'documentAcknowledgement', 'document', 'moocSubmission', 'pDHour', 'trainingFeedback',
            'eventAttendance', 'registration', 'trainingEvent', 'goalWindow', 'goal',
            'observationDomain', 'observation', 'growthObservation',
            'meetingShare', 'meetingReply', 'meetingActionItem', 'meetingMinutes', 'meetingAttendee', 'meeting',
            'systemSettings', 'user'
        ];

        // Delete all existing data
        for (const model of models) {
            if (prisma[model]) {
                await prisma[model].deleteMany({});
            }
        }

        console.log('Cleared existing data. Inserting backup data...');

        // Insert in reverse order (parents first, children last)
        const insertModels = [...models].reverse();

        for (const model of insertModels) {
            if (backupData[model] && backupData[model].length > 0) {
                try {
                     await prisma[model].createMany({
                         data: backupData[model]
                     });
                     console.log(\`Restored \${backupData[model].length} records for \${model}\`);
                } catch (e) {
                     console.log(\`createMany failed for \${model}, falling back to individual creates...\`);
                     for (const record of backupData[model]) {
                         await prisma[model].create({ data: record });
                     }
                     console.log(\`Restored \${backupData[model].length} records for \${model} via loops\`);
                }
            }
        }

        console.log('✅ Full database restore complete.');
        return; // Skip the rest of the hardcoded seed
    }
`;

if (content.includes(injectionPoint) && !content.includes('full_database_backup.json')) {
    content = content.replace(injectionPoint, injectionPoint + '\n' + restoreLogic);
    fs.writeFileSync('src/seed.ts', content, 'utf8');
    console.log('Successfully injected restore logic into seed.ts');
} else {
    console.log('Injection point not found or already injected.');
}
