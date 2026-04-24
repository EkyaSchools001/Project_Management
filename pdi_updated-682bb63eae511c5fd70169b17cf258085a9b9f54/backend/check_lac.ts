import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const campuses = await prisma.lacCampus.count();
  const subjects = await prisma.lacSubject.count();
  const tasks = await prisma.lacTask.count();
  const statuses = await prisma.lacTaskStatus.count();

  console.log('=== LAC DATABASE STATUS ===');
  console.log('LacCampus count  :', campuses);
  console.log('LacSubject count :', subjects);
  console.log('LacTask count    :', tasks);
  console.log('LacTaskStatus count:', statuses);

  if (campuses > 0) {
    const campusList = await prisma.lacCampus.findMany();
    console.log('\nCampuses:', JSON.stringify(campusList, null, 2));
  } else {
    console.log('\n⚠️  NO CAMPUSES in LacCampus table!');
  }

  if (subjects > 0) {
    const subjectList = await prisma.lacSubject.findMany();
    console.log('\nSubjects:', JSON.stringify(subjectList, null, 2));
  } else {
    console.log('\n⚠️  NO SUBJECTS in LacSubject table!');
  }

  await prisma.$disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
