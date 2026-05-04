import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function dumpUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, fullName: true, role: true }
        });
        console.log(JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Failed to dump users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

dumpUsers();
