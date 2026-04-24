import prisma from '../src/infrastructure/database/prisma';

async function main() {
    try {
        console.log('Checking AuditLog for Assessment deletions...');
        const logs = await prisma.auditLog.findMany({
            where: {
                action: { contains: 'DELETE' },
                targetEntity: { contains: 'Assessment' }
            },
            orderBy: { timestamp: 'desc' }
        });
        console.log('Total Deletion Logs:', logs.length);
        logs.forEach(l => {
            console.log(`Time: ${l.timestamp}, Action: ${l.action}, Actor: ${l.actorName}, Target: ${l.targetEntity}`);
        });
    } catch (error) {
        console.error('Error querying AuditLog:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
