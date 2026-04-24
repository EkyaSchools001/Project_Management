import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'rohit.schoolleader@pdi.com';
    const passwordHash = await bcrypt.hash('Rohit@123', 10);

    await prisma.user.update({
        where: { email },
        data: { passwordHash }
    });

    console.log(`Password for ${email} reset to Rohit@123`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
