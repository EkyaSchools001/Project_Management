import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedDummyData() {
    try {
        console.log("Starting dummy data seed for LAC...");

        // Find some teachers
        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            take: 3
        });

        if (teachers.length === 0) {
            console.log("No teachers found to assign data to.");
            return;
        }

        // Get campus for the first teacher to assign tasks there
        const campusIdCode = teachers[0].campusId;
        const campus = await prisma.lacCampus.findFirst({ where: { name: campusIdCode as string } });
        
        if (!campus) {
            console.log("Campus not found for the teacher.");
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

        // 5 Dummy Tasks
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

        console.log(`Created 5 dummy tasks linked to campus ${campus.name}`);

        // Assign these tasks to the teachers
        let count = 0;
        for (const teacher of teachers) {
            // Assign Math tasks to first teacher, Science to others just as an example
            for (const task of createdTasks) {
                // Randomize status
                const statuses = ['Pending', 'In Progress', 'Complete'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                await prisma.lacTaskStatus.create({
                    data: {
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

        console.log(`Assigned ${count} task statuses to ${teachers.length} teachers.`);
        console.log("Dummy data seeding complete!");

    } catch (error) {
        console.error("Error seeding dummy data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDummyData();
