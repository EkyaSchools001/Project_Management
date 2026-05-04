const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);

  const users = [
    {
      email: 'teacher@ekyaschools.com',
      name: 'Sarah Johnson',
      fullName: 'Sarah Johnson',
      role: 'TEACHER_CORE',
      campusId: 'CAMPUS_001',
      academics: 'CORE',
    },
    {
      email: 'teacher.specialist@ekyaschools.com',
      name: 'Mark Rivera',
      fullName: 'Mark Rivera',
      role: 'TEACHER_SPECIALIST',
      campusId: 'CAMPUS_001',
      academics: 'NON_CORE',
    },
    {
      email: 'leader@ekyaschools.com',
      name: 'Priya Sharma',
      fullName: 'Priya Sharma',
      role: 'HOS',
      campusId: 'CAMPUS_001',
    },
    {
      email: 'coordinator@ekyaschools.com',
      name: 'James Wilson',
      fullName: 'James Wilson',
      role: 'COORDINATOR',
      campusId: 'CAMPUS_001',
    },
    {
      email: 'management@ekyaschools.com',
      name: 'Anita Patel',
      fullName: 'Anita Patel',
      role: 'MANAGEMENT',
      campusId: 'CAMPUS_001',
    },
  ];

  for (const u of users) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password,
        name: u.name,
        fullName: u.fullName,
        role: u.role,
        status: 'Active',
        campusId: u.campusId,
        ...(u.academics && { academics: u.academics }),
      },
      create: {
        email: u.email,
        password,
        name: u.name,
        fullName: u.fullName,
        role: u.role,
        status: 'Active',
        campusId: u.campusId,
        ...(u.academics && { academics: u.academics }),
      },
    });
    console.log(`✅  ${created.role.padEnd(20)} → ${created.email}`);
  }

  console.log('\n🔑  Password for ALL accounts: Admin@123\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
