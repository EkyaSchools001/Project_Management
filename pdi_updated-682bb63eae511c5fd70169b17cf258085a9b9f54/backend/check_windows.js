
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const windows = await prisma.goalWindow.findMany();
  console.log(JSON.stringify(windows, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
