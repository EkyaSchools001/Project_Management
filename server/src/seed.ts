// @ts-nocheck
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Schools
    const school1 = await prisma.school.create({
        data: {
            name: 'Ekya School BTM Layout',
            type: 'Progressive',
            address: 'BTM Layout, Bangalore'
        }
    });

    const school2 = await prisma.school.create({
        data: {
            name: 'Ekya School JP Nagar',
            type: 'Regulatory',
            address: 'JP Nagar, Bangalore'
        }
    });

    console.log('Schools created.');

    // 2. Create Departments
    const deptTech = await prisma.department.create({
        data: {
            name: 'Technology',
            schoolId: school1.id
        }
    });

    const deptHR = await prisma.department.create({
        data: {
            name: 'Human Resources',
            schoolId: school1.id
        }
    });

    console.log('Departments created.');

    // 3. Create Super Admin
    const superAdmin = await prisma.profile.upsert({
        where: { email: 'superadmin@ekyaschools.com' },
        update: {},
        create: {
            email: 'superadmin@ekyaschools.com',
            name: 'Super Admin',
            role: Role.SuperAdmin,
            avatarUrl: 'https://ui-avatars.com/api/?name=Super+Admin&background=0D9488&color=fff',
            overrides: {
                create: [
                    { permission: 'all:access' }
                ]
            }
        }
    });

    console.log('Super Admin created:', superAdmin.email);

    // 4. Create other users
    const admin = await prisma.profile.upsert({
        where: { email: 'admin@ekyaschools.com' },
        update: {},
        create: {
            email: 'admin@ekyaschools.com',
            name: 'Admin User',
            role: Role.Admin,
            departmentId: deptTech.id,
            schoolId: school1.id
        }
    });

    console.log('Admin created:', admin.email);

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
