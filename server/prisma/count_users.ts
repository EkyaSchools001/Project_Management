import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.user.count();
  console.log(`Total users: ${count}`);
}

check().catch(console.error).finally(() => prisma.$disconnect());
