import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findFirst({
        where: { role: { in: ['ADMIN', 'SUPERADMIN'] } }
    });

    if (!admin) {
        console.log('No admin found!');
        return;
    }

    console.log('Found admin ID:', admin.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
