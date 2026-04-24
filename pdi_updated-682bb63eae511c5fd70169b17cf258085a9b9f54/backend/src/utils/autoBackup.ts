import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Automatically triggers a full database backup to src/data/full_database_backup.json
 * This ensures that even if the database is reset, we have the latest user-uploaded data.
 */
export const autoBackup = async () => {
    // Check if we should skip backup (e.g. in test environment)
    if (process.env.SKIP_BACKUP === 'true') return;

    console.log('[AUTO-BACKUP] Starting automated database backup...');

    try {
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

        const backupData: Record<string, any[]> = {};

        for (const model of models) {
            // @ts-ignore
            if (prisma[model]) {
                // @ts-ignore
                backupData[model] = await prisma[model].findMany();
            }
        }

        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const filePath = path.join(dataPath, 'full_database_backup.json');
        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8');

        console.log(`[AUTO-BACKUP] ✅ Backup successful: ${filePath}`);

    } catch (error) {
        console.error('[AUTO-BACKUP] ❌ Backup failed:', error);
    }
};
