import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.systemSettings.findUnique({
    where: { key: 'access_matrix_config' }
  });

  if (setting && setting.value) {
    let val: any;
    try {
      val = typeof setting.value === 'string' ? JSON.parse(setting.value as string) : setting.value;
    } catch (e) {
      console.error('Failed to parse access_matrix_config:', e);
      return;
    }

    if (val && val.accessMatrix) {
      let changed = false;

      // Fix: TESTER access for 'announcements'
      const ann = val.accessMatrix.find((x: any) => x.moduleId === 'announcements');
      if (ann) {
        if (ann.roles.TESTER !== true) {
          ann.roles.TESTER = true;
          console.log('✅ Fixed: TESTER=true for announcements');
          changed = true;
        } else {
          console.log('ℹ️  announcements already has TESTER=true (no change needed)');
        }
      } else {
        val.accessMatrix.push({
          moduleId: 'announcements',
          moduleName: 'Announcements',
          roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true }
        });
        console.log('✅ Added announcements module with TESTER=true');
        changed = true;
      }

      if (changed) {
        await prisma.systemSettings.update({
          where: { key: 'access_matrix_config' },
          data: { value: JSON.stringify(val) }
        });
        console.log('✅ DB updated successfully. Backend cache will refresh within 10 seconds.');
      }
    }
  } else {
    console.log('❌ access_matrix_config not found in DB');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
