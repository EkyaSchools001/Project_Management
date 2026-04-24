import { PrismaClient } from '@prisma/client';
import path from 'path';

async function main() {
    // Override the DATABASE_URL to point to the backup file.
    // NOTE: This only works if PrismaClient hasn't been instantiated yet.
    // In a ts-node script, we can do this before importation.
    // But since we are importing from '../src/infrastructure/database/prisma', 
    // it's already instantiated there.

    // Let's create a NEW PrismaClient with the backup URL.
    const bakUrl = `file:${path.resolve(__dirname, '../../database/prisma/dev.db.bak')}`;
    console.log('Checking Backup DB at:', bakUrl);

    const prismaBak = new PrismaClient({
        datasources: {
            db: {
                url: bakUrl
            }
        }
    });

    try {
        const assessments = await prismaBak.assessment.findMany({
            include: { questions: true }
        });
        console.log('Total Assessments in Backup:', assessments.length);
        assessments.forEach(a => {
            console.log(`ID: ${a.id}, Title: ${a.title}, Type: ${a.type}, Questions: ${a.questions.length}`);
        });
    } catch (error) {
        console.error('Error reading backup DB:', error);
    } finally {
        await prismaBak.$disconnect();
    }
}

main();
