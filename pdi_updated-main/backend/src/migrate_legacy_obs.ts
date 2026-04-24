import * as dotenv from 'dotenv';
import path from 'path';
import { PrismaClient as ActiveClient } from '@prisma/client';

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    console.log('--- Migrating Legacy Observation ---');

    const activePrisma = new ActiveClient();
    const backupPrisma = new ActiveClient({
        datasources: {
            db: {
                url: 'file:C:/Users/Admin/Desktop/PDI/pdi_updated/database/prisma/dev.db.bak'
            }
        }
    });

    try {
        // 1. Get legacy obs from backup via raw SQL
        const legacyObs: any[] = await backupPrisma.$queryRawUnsafe("SELECT * FROM Observation");

        if (legacyObs.length === 0) {
            console.log('No legacy observations found in backup.');
            return;
        }

        let migratedCount = 0;

        for (const obs of legacyObs) {
            console.log(`Processing legacy observation: ${obs.id}`);

            // Parse payload
            const legacyPayload = typeof obs.detailedReflection === 'string' ? JSON.parse(obs.detailedReflection) : obs.detailedReflection || {};
            const mergedPayload = {
                ...legacyPayload,
                teacherReflection: obs.teacherReflection,
                legacyObservationId: obs.id
            };

            // In our audit we saw it was for Teacher One and Rohit
            const teacherEmail = 'teacher1.btmlayout@pdi.com';
            const observerEmail = 'rohit.schoolleader@pdi.com';

            const teacher = await activePrisma.user.findUnique({ where: { email: teacherEmail } });

            // Check if already migrated
            const exists = await activePrisma.growthObservation.findFirst({
                where: { formPayload: { contains: obs.id } }
            });

            if (exists) {
                console.log(`Observation ${obs.id} already migrated (Growth ID: ${exists.id}). Skipping.`);
                continue;
            }

            const newObs = await activePrisma.growthObservation.create({
                data: {
                    teacher: { connect: { email: teacherEmail } },
                    observer: { connect: { email: observerEmail } },
                    campusId: teacher?.campusId || 'EBTM',
                    academicYear: '2024-25',
                    moduleType: 'DANIELSON', // Domain was 'Using Student Assessments' so likely Danielson
                    subject: 'General',
                    observationDate: new Date(obs.date || obs.createdAt),
                    overallRating: Number(obs.score) || 0,
                    status: obs.status || 'SUBMITTED',
                    formPayload: JSON.stringify(mergedPayload),
                    notes: obs.notes || '',
                    actionStep: obs.actionStep || '',
                    teacherReflection: obs.teacherReflection || '',
                    discussionMet: obs.discussionMet === 1 || obs.discussionMet === true,
                    strengths: obs.strengths || '',
                    areasOfGrowth: obs.areasOfGrowth || '',
                    createdAt: new Date(obs.createdAt),
                    updatedAt: new Date(obs.updatedAt),
                }
            });
            console.log(`✅ Successfully migrated legacy observation to GrowthObservation (DANIELSON). New ID: ${newObs.id}`);
            migratedCount++;
        }

        console.log(`Migration complete. ${migratedCount} observations migrated.`);

    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await activePrisma.$disconnect();
        await backupPrisma.$disconnect();
    }
}

migrate();
