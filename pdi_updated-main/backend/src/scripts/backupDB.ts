import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backupDB() {
    console.log('Starting full database backup...');

    try {
        // We can get all model names dynamically from prisma by iterating over Prisma.ModelName
        // But an easier way in Prisma 5+ is accessing the dmmf or simply defining an array 
        // of known models to ensure we get everything we care about
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
            // @ts-ignore - Dynamic access to prisma models
            if (prisma[model]) {
                // @ts-ignore
                const records = await prisma[model].findMany();
                backupData[model] = records;
                console.log(`Backed up ${records.length} records for ${model}`);
            } else {
                console.warn(`Model ${model} not found on Prisma client.`);
            }
        }

        // Write to file
        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const filePath = path.join(dataPath, 'full_database_backup.json');

        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8');

        console.log(`\n✅ Successfully backed up database to: src/data/full_database_backup.json`);

    } catch (error) {
        console.error('Database backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

backupDB();
