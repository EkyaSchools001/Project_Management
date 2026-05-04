import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function checkTables() {
    try {
        console.log('Checking database tables...');
        const users = await prisma.user.count();
        console.log(`User count: ${users}`);
        
        const mooc = await prisma.moocSubmission.count();
        console.log(`MoocSubmission count: ${mooc}`);
        
        const notifications = await prisma.notification.count();
        console.log(`Notification count: ${notifications}`);
        
        const observations = await prisma.observation.count();
        console.log(`Observation count: ${observations}`);
        
        console.log('Database tables are healthy.');
    } catch (error) {
        console.error('Database check failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTables();
