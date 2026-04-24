import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const pass = 'Coordinator@123';
    const hash = await bcrypt.hash(pass, 10);

    // 1. Add Academic Coordinator (Using LEADER role for compatibility)
    const coord = await prisma.user.upsert({
        where: { email: 'coordinator.academic@pdi.com' },
        update: {
            fullName: 'Academic Coordinator',
            passwordHash: hash,
            role: 'LEADER',
            campusId: 'EBTM',
            department: 'Academic',
            status: 'Active'
        },
        create: {
            fullName: 'Academic Coordinator',
            email: 'coordinator.academic@pdi.com',
            passwordHash: hash,
            role: 'LEADER',
            campusId: 'EBTM',
            department: 'Academic',
            status: 'Active'
        }
    });

    // 2. Add Dr. Tristha (Persona 4)
    const tristha = await prisma.user.upsert({
        where: { email: 'tristha.management@pdi.com' },
        update: {
            fullName: 'Dr. Tristha',
            passwordHash: hash,
            role: 'MANAGEMENT',
            campusId: 'Head Office',
            department: 'Executive',
            status: 'Active'
        },
        create: {
            fullName: 'Dr. Tristha',
            email: 'tristha.management@pdi.com',
            passwordHash: hash,
            role: 'MANAGEMENT',
            campusId: 'Head Office',
            department: 'Executive',
            status: 'Active'
        }
    });

    console.log(`✅ Upserted Coordinator: ${coord.fullName} (${coord.email})`);
    console.log(`✅ Upserted Executive: ${tristha.fullName} (${tristha.email})`);
    console.log(`Standard Password: ${pass}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
