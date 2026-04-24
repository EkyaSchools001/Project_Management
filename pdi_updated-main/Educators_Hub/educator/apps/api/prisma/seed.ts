import { prisma } from '../src/prismaClient.js';

async function main() {
  await prisma.attendance.deleteMany();
  await prisma.lACScore.deleteMany();
  await prisma.cPSEvidence.deleteMany();
  await prisma.microPlan.deleteMany();
  await prisma.observation.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.student.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.campus.deleteMany();
  await prisma.user.deleteMany();

  const campuses = await prisma.campus.createMany({
    data: [
      { name: 'Ekya CMR NPS', city: 'Bengaluru' },
      { name: 'Ekya JP Nagar', city: 'Bengaluru' },
      { name: 'Ekya ITPL', city: 'Bengaluru' }
    ]
  });

  const campusList = await prisma.campus.findMany();
  const cmr = campusList[0];

  const teacher = await prisma.teacher.create({
    data: {
      name: 'Nisha Rao',
      email: 'teacher@ekya.test',
      campusId: cmr.id,
      microPlans: {
        create: [
          { title: 'Early years inquiry', summary: 'Plan for social-emotional learning.' }
        ]
      },
      evidences: {
        create: [
          { title: 'Literacy sample', summary: 'Student reading evidence.' }
        ]
      }
    }
  });

  const classA = await prisma.class.create({
    data: {
      name: 'Grade 2 - A',
      teacherId: teacher.id,
      campusId: cmr.id,
      timetable: {
        create: [
          { day: 'Monday', subject: 'Math', period: 1 },
          { day: 'Monday', subject: 'English', period: 2 }
        ]
      }
    }
  });

  await prisma.student.createMany({
    data: [
      { name: 'Aarav', classId: classA.id, campusId: cmr.id },
      { name: 'Meera', classId: classA.id, campusId: cmr.id }
    ]
  });

  await prisma.policy.createMany({
    data: [
      { title: 'Student wellbeing policy', description: 'Campus wellbeing guidelines.', campusId: cmr.id, published: true },
      { title: 'Assessment policy', description: 'Assessment frameworks for teaching.', campusId: cmr.id, published: false }
    ]
  });

  await prisma.user.createMany({
    data: [
      { email: 'teacher@ekya.test', password: 'Teacher123!', role: 'teacher', campusId: cmr.id, teacherId: teacher.id },
      { email: 'hos@ekya.test', password: 'HoS123!', role: 'hos', campusId: cmr.id },
      { email: 'admin@ekya.test', password: 'Admin123!', role: 'admin', campusId: cmr.id },
      { email: 'management@ekya.test', password: 'Mgmt123!', role: 'management' },
      { email: 'superadmin@ekya.test', password: 'Super123!', role: 'superadmin' }
    ]
  });

  console.log('Seed complete');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
