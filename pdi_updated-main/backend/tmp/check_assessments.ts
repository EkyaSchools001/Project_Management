import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        const assessments = await prisma.assessment.findMany({
            include: { questions: true, assignments: true }
        });
        console.log('Total Assessments:', assessments.length);
        assessments.forEach(a => {
            console.log(`ID: ${a.id}, Title: ${a.title}, Type: ${a.type}, Questions: ${a.questions.length}, Assignments: ${a.assignments.length}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
