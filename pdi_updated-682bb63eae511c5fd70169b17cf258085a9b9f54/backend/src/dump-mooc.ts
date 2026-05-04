import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function dumpMooc() {
    try {
        const subs = await prisma.moocSubmission.findMany({
            include: { user: true }
        });
        console.log(JSON.stringify(subs, null, 2));
    } catch (error) {
        console.error('Failed to dump MOOC:', error);
    } finally {
        await prisma.$disconnect();
    }
}

dumpMooc();
