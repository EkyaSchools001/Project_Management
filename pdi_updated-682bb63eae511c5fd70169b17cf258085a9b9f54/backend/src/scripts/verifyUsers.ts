import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const emails = [
        'indu.management@pdi.com',
        'bharath.superadmin@padi.com',
        'rohit.schoolleader@pdi.com'
    ];

    console.log('Verifying users...');

    for (const email of emails) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            console.log(`Found user: ${user.fullName}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Password Hash starts with: ${user.passwordHash?.substring(0, 10)}...`);
            console.log('-----------------------------------');
        } else {
            console.log(`User NOT found: ${email}`);
            console.log('-----------------------------------');
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
