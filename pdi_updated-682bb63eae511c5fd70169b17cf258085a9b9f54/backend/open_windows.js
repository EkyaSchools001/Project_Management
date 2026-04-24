
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const phases = ['SELF_REFLECTION', 'GOAL_SETTING', 'GOAL_COMPLETION'];
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  for (const phase of phases) {
    await prisma.goalWindow.updateMany({
      where: { phase },
      data: {
        status: 'OPEN',
        startDate: now,
        endDate: nextMonth
      }
    });
    console.log(`Phase ${phase} in now OPEN until ${nextMonth.toISOString()}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
