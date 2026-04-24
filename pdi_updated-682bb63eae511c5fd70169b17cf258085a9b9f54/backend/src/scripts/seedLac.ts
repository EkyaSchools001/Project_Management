import prisma from '../infrastructure/database/prisma';

const subjects = [
    'Art', 'Computer Science', 'Drama', 'English', 'Global Perspectives',
    'Hindi', 'Kannada', 'Life Skills', 'Math', 'Music', 'PE', 'Science',
    'Social Science', 'Spanish', 'VA'
];

async function seed() {
    console.log('Seeding LAC data...');

    // 1. Seed Subjects
    for (const name of subjects) {
        await prisma.lacSubject.upsert({
            where: { name },
            update: {},
            create: { name }
        });
    }

    const artSubject = await prisma.lacSubject.findUnique({ where: { name: 'Art' } });
    const eniceCampus = await prisma.lacCampus.findFirst({ where: { name: 'ENICE' } });

    if (artSubject && eniceCampus) {
        // 2. Seed some demo tasks (campusId is required by schema)
        const demoTasks = [
            {
                subjectId: artSubject.id,
                campusId: eniceCampus.id,
                unit: 'Unit 1: Colors',
                task: 'Introduction to primary colors',
                type: 'Theory',
                mode: 'In-person',
                week: 1,
            },
            {
                subjectId: artSubject.id,
                campusId: eniceCampus.id,
                unit: 'Unit 1: Colors',
                task: 'Mixing secondary colors',
                type: 'Practical',
                mode: 'In-person',
                week: 2,
            }
        ];

        for (const task of demoTasks) {
            await prisma.lacTask.create({ data: task });
        }
    }

    // 3. Seed demo campus
    await prisma.lacCampus.upsert({
        where: { name: 'EKYA Nice Road' },
        update: {},
        create: { name: 'EKYA Nice Road', location: 'Bangalore' }
    });

    console.log('LAC Seeding completed.');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
