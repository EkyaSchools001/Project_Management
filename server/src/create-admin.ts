import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'Password@123';
    
    console.log(`Checking for user ${email}...`);
    
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    
    if (existingUser) {
        console.log('User already exists. Skipping creation.');
        return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'System Admin',
            role: 'SuperAdmin',
            status: 'Active',
            profile: {
                create: {
                    firstName: 'System',
                    lastName: 'Admin'
                }
            }
        }
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
}

main()
    .catch((e) => {
        console.error('Error creating admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
