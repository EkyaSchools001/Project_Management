const fs = require('fs');
const path = require('path');

const dirs = [
    'src/app/routes',
    'src/app/layouts',
    'src/app/providers',
    'src/modules/auth/pages',
    'src/modules/auth/components',
    'src/modules/dashboard/pages',
    'src/modules/dashboard/components',
    'src/modules/departments/HR',
    'src/modules/departments/ProfessionalDevelopment',
    'src/modules/departments/Operations',
    'src/modules/departments/Technology',
    'src/modules/departments/LearningCentre',
    'src/modules/departments/StudentDevelopment',
    'src/modules/departments/Marketing',
    'src/modules/departments/Admissions',
    'src/modules/departments/BrandGrowth',
    'src/modules/departments/QualityAssurance',
    'src/modules/departments/FinanceAccounts',
    'src/modules/departments/StrategicInnovation',
    'src/modules/departments/WellBeing',
    'src/modules/schools/ProgressiveSchools',
    'src/modules/schools/PurposeBasedSchools',
    'src/modules/schools/WorldSchool',
    'src/modules/roles/SuperAdmin',
    'src/modules/roles/ManagementAdmin',
    'src/modules/roles/Admin',
    'src/modules/roles/TeacherStaff',
    'src/modules/roles/Guest',
    'src/components/common',
    'src/components/ui',
    'src/components/navigation',
    'src/data',
    'src/hooks',
    'src/utils',
    'src/styles'
];

dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created: ${dir}`);
    }
});
