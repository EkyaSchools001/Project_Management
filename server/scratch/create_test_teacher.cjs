const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Teacher@123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'testteacher@ekyaschools.com' },
    update: { password, status: 'Active' },
    create: {
      email: 'testteacher@ekyaschools.com',
      password,
      name: 'Test Teacher',
      fullName: 'Test Teacher',
      role: 'TEACHER_CORE',
      status: 'Active',
      campusId: 'CAMPUS_001',
      academics: 'CORE',
    },
  });

  console.log('✅ Test teacher created!');
  console.log('   Email   :', user.email);
  console.log('   Password: Teacher@123');
  console.log('   Role    :', user.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
