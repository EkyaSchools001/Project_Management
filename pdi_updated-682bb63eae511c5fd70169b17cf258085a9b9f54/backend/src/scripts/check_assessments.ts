import { PrismaClient } from '@prisma/client';

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
    console.log('Current Assessments in DB:');
    console.dir(assessments, { depth: null });
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
