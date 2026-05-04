import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const teacherId = '2cc46214-4abe-468f-ac42-073b0d1f5ed5'; // Shakshi Sandil
    const campusIdCode = 'ENICE'; // We need the UUID for this campus

    // Find the ENICE campus UUID
    const campus = await prisma.lacCampus.findFirst({ where: { name: campusIdCode } });
    if (!campus) {
        console.error('Campus ENICE not found.');
        return;
    }
    const campusId = campus.id;

    // Find or create English subject
    let subject = await prisma.lacSubject.findFirst({ where: { name: 'English' } });
    if (!subject) {
        subject = await prisma.lacSubject.create({ data: { name: 'English' } });
    }

    // Create some English tasks
    const tasks = [
        { subjectId: subject.id, campusId: campusId, unit: 'Unit 1: Grammar', task: 'Review Nouns', type: 'Formative', mode: 'Offline', week: 1, weekCheck: true },
        { subjectId: subject.id, campusId: campusId, unit: 'Unit 1: Grammar', task: 'Quiz on Nouns', type: 'Summative', mode: 'Online', week: 2, weekCheck: true },
        { subjectId: subject.id, campusId: campusId, unit: 'Unit 2: Literature', task: 'Read Chapter 1', type: 'Reading', mode: 'Offline', week: 3, weekCheck: true },
        { subjectId: subject.id, campusId: campusId, unit: 'Unit 2: Literature', task: 'Essay Writing', type: 'Formative', mode: 'Offline', week: 4, weekCheck: true },
    ];

    const createdTasks: any[] = [];
    for (const task of tasks) {
        // Try to find if the task already exists
        let existingTask = await prisma.lacTask.findFirst({
             where: { subjectId: task.subjectId, task: task.task }
        });
        if (!existingTask) {
             existingTask = await prisma.lacTask.create({ data: task });
        }
        createdTasks.push(existingTask);
    }

    // Assign tasks to Shakshi
    for (const task of createdTasks) {
        await prisma.lacTaskStatus.upsert({
            where: {
                taskId_teacherId_campusId: {
                    taskId: task.id,
                    campusId: campusId,
                    teacherId: teacherId
                }
            },
            update: {
                // Just keep it as is or reset to Pending for the demo
            },
            create: {
                taskId: task.id,
                campusId: campusId,
                teacherId: teacherId,
                status: 'Pending',
                published: false,
                scoreEntered: false,
                evidence: false
            }
        });
    }

    console.log('Seeded English tasks for Shakshi successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
