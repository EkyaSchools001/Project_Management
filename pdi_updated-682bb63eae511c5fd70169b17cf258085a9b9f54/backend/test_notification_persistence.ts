
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testNotification() {
    try {
        console.log("Creating test notification...");

        // Find a test user (e.g., an ADMIN or first user)
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log("No user found to test with.");
            return;
        }

        const notification = await prisma.notification.create({
            data: {
                userId: user.id,
                title: 'Test Notification',
                message: 'This is a successful test of the persistent notification system.',
                type: 'SUCCESS',
                isRead: false
            }
        });

        console.log("Created notification:", notification);

        const count = await prisma.notification.count();
        console.log("Total notifications in DB:", count);

    } catch (error) {
        console.error("Error testing notifications:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testNotification();
