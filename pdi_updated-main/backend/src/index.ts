import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { initializeSocket } from './core/socket';

import fs from 'fs';
import path from 'path';
import prisma from './infrastructure/database/prisma';
import { schedulerService } from './infrastructure/services/schedulerService';

const PORT = process.env.PORT || 3000;

console.log('--- Environment Check ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`JWT_SECRET Loaded: ${!!process.env.JWT_SECRET}`);
console.log(`DATABASE_URL Loaded: ${!!process.env.DATABASE_URL}`);
console.log('-------------------------');

// Automatic Restore Logic for Testing Phase
const autoRestore = async () => {
    try {
        const userCount = await prisma.user.count();
        if (userCount === 0) {
            console.log('[AUTO-RESTORE] 📂 Database is empty. Checking for backup file...');
            const backupPath = path.join(__dirname, 'data', 'full_database_backup.json');

            if (fs.existsSync(backupPath)) {
                console.log('[AUTO-RESTORE] 🔄 Backup found! Starting automatic restore...');
                const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

                const models = [
                    'user', 'meeting', 'meetingAttendee', 'meetingMinutes', 'meetingActionItem',
                    'meetingReply', 'meetingShare', 'observation', 'observationDomain', 'goal',
                    'goalWindow', 'trainingEvent', 'registration', 'eventAttendance', 'trainingFeedback',
                    'pDHour', 'moocSubmission', 'document', 'documentAcknowledgement', 'course',
                    'courseEnrollment', 'systemSettings', 'dashboardLayout', 'formTemplate', 'notification',
                    'announcement', 'announcementAcknowledgement', 'survey', 'surveyQuestion', 'surveyResponse',
                    'surveyAnswer', 'postOrientationAssessment', 'learningFestival', 'learningFestivalApplication',
                    'assessment', 'assessmentQuestion', 'assessmentAssignment', 'assessmentAttempt',
                    'growthObservation', 'formWorkflow', 'auditLog', 'dashboard', 'dashboardWidget', 'widgetType'
                ];

                for (const model of models) {
                    const data = backupData[model];
                    if (data && Array.isArray(data) && data.length > 0) {
                        console.log(`[AUTO-RESTORE] Seeding ${data.length} records into ${model}...`);
                        for (const item of data) {
                            // @ts-ignore
                            await prisma[model].upsert({
                                where: { id: item.id },
                                update: item,
                                create: item
                            });
                        }
                    }
                }
                console.log('[AUTO-RESTORE] ✅ Automatic restore complete.');
            } else {
                console.log('[AUTO-RESTORE] ⚠️ No backup file found at', backupPath);
            }
        }
    } catch (err) {
        console.error('[AUTO-RESTORE] ❌ Auto-restore failed:', err);
    }
};

const server = app.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`🔗 Local: http://0.0.0.0:${PORT}`);
    console.log(`💉 Health: http://0.0.0.0:${PORT}/api/health\n`);

    // Trigger auto-restore
    await autoRestore();
});

console.log("DEBUG: Initializing socket...");
initializeSocket(server);
console.log("DEBUG: Socket initialized.");

// Keep process alive for debugging
setInterval(() => {
    // console.log("DEBUG: Keep-alive tick.");
    // Auto-deployment trigger comment - v8S
}, 10000);