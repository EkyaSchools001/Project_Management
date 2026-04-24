import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        console.log('Reading everything from sqlite_master...');
        const result = await prisma.$queryRaw`SELECT * FROM sqlite_master`;
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
