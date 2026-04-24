import { PrismaClient, UserRole, AccessLevel, RoleScope } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MODULE_DATA = [
  { group: "Academics", code: "ACAD", mods: ["Timetable", "Curriculum", "Gradebook", "Progress Reports", "Exams", "Homework", "Co-curricular", "Calendar"] },
  { group: "Attendance", code: "ATT", mods: ["Student Attendance", "Staff Attendance", "Leave Mgmt", "Biometric", "Attendance Reports"] },
  { group: "Finance", code: "FIN", mods: ["Fee Mgmt", "Payments", "Expense Tracking", "Payroll", "Invoicing", "Finance Reports", "Scholarship"] },
  { group: "HR & payroll", code: "HR", mods: ["Staff Records", "Recruitment", "Appraisal", "Leave Calendar", "Compliance", "Self-service"] },
  { group: "Lifecycle", code: "LIFE", mods: ["Admissions", "Student Profiles", "ID Cards", "Alumni", "Health Records", "Transport Assign"] },
  { group: "Communication", code: "COMM", mods: ["Announcements", "Parent Messaging", "SMS/Email", "Events", "Circulars"] },
  { group: "Operations", code: "OPS", mods: ["Library", "Transport", "Canteen", "Assets", "Maintenance", "Visitors"] },
  { group: "Analytics", code: "BI", mods: ["Campus Dashboard", "Management BI", "Academic Analytics", "Finance Analytics", "Audit Log"] },
  { group: "System", code: "SYS", mods: ["User Mgmt", "Module Config", "Integrations", "Notifications", "Security"] },
];

async function main() {
  console.log('🌱 Starting Full System Seed...');

  // 1. Create Default Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@schoolos.com' },
    update: {},
    create: {
      email: 'admin@schoolos.com',
      password: hashedPassword,
      name: 'System Administrator',
      fullName: 'System Administrator',
      role: UserRole.SUPER_ADMIN,
      roleScope: RoleScope.SYSTEM,
      status: 'Active',
      campusId: 'CAMPUS_001',
    }
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // 2. Create Modules
  for (const group of MODULE_DATA) {
    for (const modName of group.mods) {
      await prisma.eRPModule.upsert({
        where: { name: modName },
        update: {},
        create: {
          name: modName,
          group: group.group,
          code: `${group.code}_${modName.toUpperCase().replace(/\s+/g, '_')}`.substring(0, 10),
        }
      });
    }
  }

  const allModules = await prisma.eRPModule.findMany();
  console.log(`✅ Created ${allModules.length} modules.`);

  // 3. Default Permissions
  const roles = Object.values(UserRole);
  
  for (const role of roles) {
    for (const mod of allModules) {
      let access = AccessLevel.NONE;

      if (role === UserRole.SUPER_ADMIN) access = AccessLevel.FULL;
      else if (role === UserRole.MANAGEMENT) access = AccessLevel.FULL;
      else if (role === UserRole.HOS) access = AccessLevel.FULL;
      else if (role === UserRole.COORDINATOR && (mod.group === "Academics" || mod.group === "Attendance")) access = AccessLevel.SCOPED;
      else if (role.startsWith('TEACHER') && mod.group === "Academics") access = AccessLevel.SCOPED;

      await prisma.rolePermission.upsert({
        where: {
          role_moduleId_action: {
            role,
            moduleId: mod.id,
            action: 'view'
          }
        },
        update: { access },
        create: {
          role,
          moduleId: mod.id,
          action: 'view',
          access
        }
      });
    }
  }

  console.log('✅ RBAC Seeding Complete.');
  console.log('🚀 SYSTEM READY');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
