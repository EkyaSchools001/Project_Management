import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedDummyData() {
    try {
        console.log("Starting dummy data seed for LAC...");

        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' }
        });

        if (teachers.length === 0) {
            console.log("No teachers found to assign data to.");
            return;
        }

        // Create or find subjects
        const mathSubject = await prisma.lacSubject.upsert({
            where: { name: 'Mathematics' },
            update: {},
            create: { name: 'Mathematics' }
        });

        const scienceSubject = await prisma.lacSubject.upsert({
            where: { name: 'Science' },
            update: {},
            create: { name: 'Science' }
        });

        let count = 0;
        
        // Group teachers by campus
        const teachersByCampus: Record<string, typeof teachers> = {};
        for (const t of teachers) {
            const cId = (t.campusId as string) || 'UNKNOWN';
            if (!teachersByCampus[cId]) teachersByCampus[cId] = [];
            teachersByCampus[cId].push(t);
        }

        for (const [campusCode, campusTeachers] of Object.entries(teachersByCampus)) {
            if (campusCode === 'UNKNOWN') continue;

            let campus = await prisma.lacCampus.findFirst({ where: { name: campusCode } });
            if (!campus) {
                campus = await prisma.lacCampus.create({
                    data: { name: campusCode, location: 'Bangalore' }
                });
            }

            // Create tasks for this campus
            const tasksData = [
                { subjectId: mathSubject.id, campusId: campus.id, unit: 'Algebra 1', task: 'Complete Chapter 1 Exercises', type: 'Formative', mode: 'Offline', week: 1, weekCheck: true },
                { subjectId: mathSubject.id, campusId: campus.id, unit: 'Algebra 1', task: 'Grade Mid-Term Papers', type: 'Summative', mode: 'Online', week: 2, weekCheck: false },
                { subjectId: scienceSubject.id, campusId: campus.id, unit: 'Physics Basics', task: 'Setup Lab Experiment 3', type: 'Practical', mode: 'Offline', week: 1, weekCheck: true },
                { subjectId: scienceSubject.id, campusId: campus.id, unit: 'Chemistry', task: 'Review Periodic Table Quiz', type: 'Formative', mode: 'Online', week: 3, weekCheck: true },
                { subjectId: scienceSubject.id, campusId: campus.id, unit: 'Biology', task: 'Submit Field Trip Proposal', type: 'Administrative', mode: 'Offline', week: 4, weekCheck: false },
            ];

            const createdTasks: any[] = [];
            for (const data of tasksData) {
                const task = await prisma.lacTask.create({ data });
                createdTasks.push(task);
            }

            console.log(`Created 5 dummy tasks for campus ${campus.name}`);

            for (const teacher of campusTeachers) {
                for (const task of createdTasks) {
                    const statuses = ['Pending', 'In Progress', 'Complete'];
                    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                    await prisma.lacTaskStatus.upsert({
                        where: {
                            taskId_teacherId_campusId: {
                                taskId: task.id,
                                teacherId: teacher.id,
                                campusId: campus.id
                            }
                        },
                        update: {},
                        create: {
                            taskId: task.id,
                            campusId: campus.id,
                            teacherId: teacher.id,
                            status: randomStatus,
                            published: true,
                            scoreEntered: randomStatus === 'Complete',
                            evidence: false
                        }
                    });
                    count++;
                }
            }
        }

        console.log(`Assigned ${count} task statuses across ${teachers.length} teachers.`);
        console.log("Dummy data seeding complete!");

    } catch (error) {
        console.error("Error seeding dummy data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDummyData();
