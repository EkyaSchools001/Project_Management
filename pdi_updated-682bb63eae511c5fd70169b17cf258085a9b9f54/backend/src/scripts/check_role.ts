import prisma from '../infrastructure/database/prisma';

async function check() {
    const user = await prisma.user.findFirst({
        where: { fullName: { contains: 'Avani' } }
    });
    console.log(JSON.stringify(user, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
