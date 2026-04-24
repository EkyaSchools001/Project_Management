import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting passwords...');

    const updates = [
        { email: 'indu.management@pdi.com', pass: 'Indu@123' },
        { email: 'bharath.superadmin@padi.com', pass: 'Bharath@123' },
        { email: 'rohit.schoolleader@pdi.com', pass: 'Rohit@123' },
        { email: 'teacher1.btmlayout@pdi.com', pass: 'Teacher1@123' },
        { email: 'avani.admin@pdi.com', pass: 'Avani@123' }
    ];

    for (const u of updates) {
        const hashedPassword = await bcrypt.hash(u.pass, 10);
        const user = await prisma.user.update({
            where: { email: u.email },
            data: { passwordHash: hashedPassword },
        });
        console.log(`Updated password for ${user.email} to ${u.pass}`);
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
