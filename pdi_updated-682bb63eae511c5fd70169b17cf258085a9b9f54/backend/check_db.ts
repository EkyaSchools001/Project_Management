import prisma from './src/infrastructure/database/prisma';

async function main() {
  try {
    const count = await prisma.pTIL_Record.count();
    console.log('PTIL_Record count:', count);
  } catch (err) {
    console.error('Error checking PTIL_Record:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
