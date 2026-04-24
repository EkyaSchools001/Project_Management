const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

async function checkAndCreateUser() {
    try {
        const email = 'rohit.schoolleader@pdi.com';
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log('User not found. Creating user...');
            // Normally passport or bcrypt is used. Let's look at the auth controller to see what login uses.
            // Or we can just read authController.ts
        } else {
            console.log('User found:', user.email);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkAndCreateUser();
