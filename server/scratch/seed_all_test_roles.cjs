const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Test@1234', 10);

  const users = [
    {
      email: 'superadmin@test.ekya',
      name: 'Super Admin Test',
      fullName: 'Super Admin Test',
      role: 'SUPER_ADMIN',
      label: 'SUPERADMIN',
    },
    {
      email: 'admin@test.ekya',
      name: 'Admin Test',
      fullName: 'Admin Test',
      role: 'ADMIN_OPS',
      label: 'ADMIN',
    },
    {
      email: 'leader@test.ekya',
      name: 'Leader Test',
      fullName: 'Leader Test',
      role: 'HOS',
      label: 'LEADER',
    },
    {
      email: 'management@test.ekya',
      name: 'Management Test',
      fullName: 'Management Test',
      role: 'MANAGEMENT',
      label: 'MANAGEMENT',
    },
    {
      email: 'coordinator@test.ekya',
      name: 'Coordinator Test',
      fullName: 'Coordinator Test',
      role: 'COORDINATOR',
      label: 'COORDINATOR',
    },
    {
      email: 'teacher@test.ekya',
      name: 'Teacher Test',
      fullName: 'Teacher Test',
      role: 'TEACHER_CORE',
      label: 'TEACHER',
    },
    {
      email: 'tester@test.ekya',
      name: 'Tester Test',
      fullName: 'Tester Test',
      role: 'GUEST',
      label: 'TESTER',
    },
  ];

  console.log('\n✅ Test accounts created — ALL redirect to /departments/pd/teacher\n');
  console.log('─'.repeat(60));
  console.log('ROLE          EMAIL                     PASSWORD');
  console.log('─'.repeat(60));

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password, name: u.name, fullName: u.fullName, role: u.role, status: 'Active', campusId: 'CAMPUS_001' },
      create: { email: u.email, password, name: u.name, fullName: u.fullName, role: u.role, status: 'Active', campusId: 'CAMPUS_001' },
    });
    console.log(`${u.label.padEnd(14)}${u.email.padEnd(28)}Test@1234`);
  }

  console.log('─'.repeat(60));
  console.log('\nLogin URL: http://localhost:5173/login\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
