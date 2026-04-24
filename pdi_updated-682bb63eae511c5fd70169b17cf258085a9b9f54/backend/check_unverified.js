const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function checkUnverified() {
    try {
        const users = await prisma.user.findMany({
            where: { isVerified: false },
            select: { id: true, email: true, role: true, isVerified: true }
        });
        console.log('Unverified users:', JSON.stringify(users, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkUnverified();
