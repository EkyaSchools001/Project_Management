import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        console.log('Querying FormTemplate records...');
        const templates = await prisma.$queryRaw`SELECT * FROM FormTemplate`;
        console.log('Total Form Templates:', (templates as any[]).length);
        (templates as any[]).forEach(t => {
            console.log(`ID: ${t.id}, Name: ${t.name}, Type: ${t.type}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
