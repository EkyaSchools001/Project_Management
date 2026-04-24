import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
    const email = 'admin@schoolos.com';
    const password = 'Admin@123';

    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Login valid:', isValid);
    console.log('User Status:', user.status);
}

testLogin().then(() => prisma.$disconnect());
