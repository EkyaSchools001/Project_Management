import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ take: 10 });
  console.log('Sample Users:');
  users.forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`));
  
  // Update admin user to SUPER_ADMIN to ensure we can test
  const admin = users.find(u => u.email?.includes('admin'));
  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log(`Updated ${admin.email} to SUPER_ADMIN`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
