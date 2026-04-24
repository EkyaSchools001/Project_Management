import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        console.log('Checking FormTemplate table using raw SQL...');
        const templates = await prisma.$queryRaw`SELECT * FROM FormTemplate`;
        console.log('Total Form Templates:', (templates as any[]).length);
        (templates as any[]).forEach(t => {
            console.log(`ID: ${t.id}, Name: ${t.name}, Type: ${t.type}`);
        });
    } catch (error) {
        console.error('Error querying FormTemplate:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
