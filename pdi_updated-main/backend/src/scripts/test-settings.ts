import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection and systemSettings table...');
    const count = await prisma.systemSettings.count();
    console.log(`Connection successful. Found ${count} settings.`);
    
    const settings = await prisma.systemSettings.findMany();
    console.log('Settings keys:', settings.map(s => s.key));
    
    const philosophy = await prisma.systemSettings.findUnique({
      where: { key: 'page_philosophy' }
    });
    
    if (philosophy) {
      console.log('Found page_philosophy. Content length:', philosophy.value.length);
      try {
        JSON.parse(philosophy.value);
        console.log('JSON is valid.');
      } catch (e) {
        console.error('Invalid JSON in page_philosophy!');
      }
    } else {
      console.log('page_philosophy not found (standard behavior if not set).');
    }
    
  } catch (error) {
    console.error('Database connection failed!', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
