import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Schools
    const school1 = await prisma.school.upsert({
        where: { id: 'school-btm-001' },
        update: {},
        create: {
            id: 'school-btm-001',
            name: 'Ekya School BTM Layout',
            location: 'BTM Layout, Bangalore',
        }
    });

    const school2 = await prisma.school.upsert({
        where: { id: 'school-jpn-002' },
        update: {},
        create: {
            id: 'school-jpn-002',
            name: 'Ekya School JP Nagar',
            location: 'JP Nagar, Bangalore',
        }
    });

    console.log('Schools created.');

    // 2. Create Departments
    const deptTech = await prisma.department.upsert({
        where: { id: 'dept-tech-001' },
        update: {},
        create: {
            id: 'dept-tech-001',
            name: 'Technology',
            type: 'Technical',
            schoolId: school1.id,
        }
    });

    const deptHR = await prisma.department.upsert({
        where: { id: 'dept-hr-001' },
        update: {},
        create: {
            id: 'dept-hr-001',
            name: 'Human Resources',
            type: 'Administrative',
            schoolId: school1.id,
        }
    });

    console.log('Departments created.');

    // 3. Create Super Admin user
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@ekyaschools.com' },
        update: {},
        create: {
            email: 'superadmin@ekyaschools.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
            schoolId: school1.id,
        }
    });

    console.log('Super Admin created:', superAdmin.email);

    // 4. Create Management Admin
    const managementAdmin = await prisma.user.upsert({
        where: { email: 'director@ekyaschools.com' },
        update: {},
        create: {
            email: 'director@ekyaschools.com',
            name: 'Director',
            password: hashedPassword,
            role: UserRole.MANAGEMENT,
            schoolId: school1.id,
        }
    });

    // 5. Create a regular Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ekyaschools.com' },
        update: {},
        create: {
            email: 'admin@ekyaschools.com',
            name: 'Admin User',
            password: hashedPassword,
            role: UserRole.ADMIN_OPS,
            departmentId: deptTech.id,
            schoolId: school1.id,
        }
    });

    // 6. Create Teacher/Staff
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@ekyaschools.com' },
        update: {},
        create: {
            email: 'teacher@ekyaschools.com',
            name: 'Teacher Staff',
            password: hashedPassword,
            role: UserRole.TEACHER_CORE,
            departmentId: deptTech.id,
            schoolId: school1.id,
        }
    });

    console.log('Users created.');
    console.log('Seeding completed successfully! ✅');
    console.log('\n--- Login Credentials ---');
    console.log('Super Admin: superadmin@ekyaschools.com / password123');
    console.log('Director:    director@ekyaschools.com / password123');
    console.log('Admin:       admin@ekyaschools.com / password123');
    console.log('Teacher:     teacher@ekyaschools.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
