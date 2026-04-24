import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = "coordinator.nice@ekyaschools.com";
    const password = "Asmita@123";
    const role = "COORDINATOR";
    const fullName = "Asmita Coordinator";

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            role,
            fullName
        },
        create: {
            email,
            passwordHash,
            fullName,
            role,
            status: "Active",
            isVerified: true
        }
    });

    console.log(`✅ User ${user.email} created/updated with role ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
