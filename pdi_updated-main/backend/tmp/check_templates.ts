import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        const templates = await prisma.formTemplate.findMany();
        console.log('Total Form Templates:', templates.length);
        templates.forEach(t => {
            console.log(`ID: ${t.id}, Name: ${t.name}, Type: ${t.type}, IsDefault: ${t.isDefault}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
