const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ekya.edu' },
    update: {},
    create: {
      email: 'admin@ekya.edu',
      password: hashedPassword,
      name: 'System Admin',
      role: 'Admin',
      status: 'Active',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@ekya.edu' },
    update: {},
    create: {
      email: 'teacher@ekya.edu',
      password: hashedPassword,
      name: 'Lead Teacher',
      role: 'TeacherStaff',
      status: 'Active',
    },
  });

  console.log('Created test users: admin@ekya.edu, teacher@ekya.edu (Password: Admin@123)');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
