import prisma from '../infrastructure/database/prisma';

const campuses = [
  { name: 'CMR NPS',    location: 'Bangalore' },
  { name: 'EJPN',       location: 'Bangalore' },
  { name: 'EITPL',      location: 'Bangalore' },
  { name: 'EBTM',       location: 'Bangalore' },
  { name: 'EBYR',       location: 'Bangalore' },
  { name: 'ENICE',      location: 'Bangalore' },
  { name: 'ENAVA',      location: 'Bangalore' },
  { name: 'PU BTM',     location: 'Bangalore' },
  { name: 'PU BYR',     location: 'Bangalore' },
  { name: 'PU HRBR',    location: 'Bangalore' },
  { name: 'PU ITPL',    location: 'Bangalore' },
  { name: 'PU NICE',    location: 'Bangalore' },
  { name: 'Head Office', location: 'Bangalore' },
];

async function main() {
  console.log('Seeding LAC Campuses...');
  for (const campus of campuses) {
    const result = await prisma.lacCampus.upsert({
      where: { name: campus.name },
      update: { location: campus.location },
      create: campus,
    });
    console.log(`✅ ${result.name} (${result.id})`);
  }
  console.log('\nDone! All 13 campuses seeded.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
