import { PrismaClient, UserRole, RoleScope } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'superadmin@ekyaschools.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { 
            password: hashedPassword,
            status: 'Active'
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            fullName: 'Super Admin',
            role: UserRole.SUPER_ADMIN,
            roleScope: RoleScope.SYSTEM,
            status: 'Active',
            campusId: 'CAMPUS_001',
        }
    });

    console.log('User synced:', user.email);
}

main().finally(() => prisma.$disconnect());
