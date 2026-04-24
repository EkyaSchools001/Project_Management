import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        console.log('Listing all tables in DB...');
        const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
        console.log('Tables:', tables);
    } catch (error) {
        console.error('Error listing tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
