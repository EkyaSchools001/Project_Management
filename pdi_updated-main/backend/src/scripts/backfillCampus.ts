import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function backfillCampus() {
    console.log('Backfilling missing campus fields on goals...');
    const goals = await prisma.goal.findMany({
        where: { campus: null },
        include: { teacher: true }
    });

    let count = 0;
    for (const goal of goals) {
        if (goal.teacher && goal.teacher.campusId) {
            await prisma.goal.update({
                where: { id: goal.id },
                data: { campus: goal.teacher.campusId }
            });
            count++;
        }
    }
    console.log(`Updated ${count} goals with campus ID from teacher.`);
    await prisma.$disconnect();
}

backfillCampus().catch(console.error);
