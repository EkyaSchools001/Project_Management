import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function backfill() {
    const campus = await prisma.lacCampus.findFirst();
    if (!campus) {
        console.log("No campus found to backfill.");
        return;
    }

    const tasks = await prisma.lacTask.findMany({ where: { campusId: null as any } });
    for (const task of tasks) {
        await prisma.lacTask.update({
            where: { id: task.id },
            data: { campusId: campus.id }
        });
    }

    console.log(`Backfilled ${tasks.length} tasks with campusId ${campus.id}`);
}

backfill()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
