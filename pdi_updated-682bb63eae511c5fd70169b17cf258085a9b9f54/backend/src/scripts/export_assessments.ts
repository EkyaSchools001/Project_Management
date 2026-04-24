import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const assessments = await prisma.assessment.findMany({
        select: {
            id: true,
            title: true,
            type: true,
            createdById: true
        }
    });
    fs.writeFileSync('assessments_db.json', JSON.stringify(assessments, null, 2));
    console.log('Saved to assessments_db.json');
}

main().finally(() => prisma.$disconnect());
