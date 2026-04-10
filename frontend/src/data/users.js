export const MOCK_USERS = [
    // --- SUPER ADMIN ---
    {
        id: 'u-sa-1',
        name: 'Super Admin',
        email: 'superadmin@ekyaschools.com',
        role: 'SuperAdmin',
        status: 'Active',
        department: 'Executive',
        password: 'password123'
    },
    {
        id: 'u-sa-1-alt',
        name: 'Super Admin (Alt)',
        email: 'superadmin@ekyaschool.in',
        role: 'SuperAdmin',
        status: 'Active',
        department: 'Executive',
        password: 'password123'
    },

    // --- DIRECTORS & TOP MANAGEMENT ---
    {
        id: 'u-dir-1',
        name: 'Director',
        email: 'director@ekyaschools.com',
        role: 'ManagementAdmin',
        status: 'Active',
        department: 'Board',
        password: 'password123'
    },
    {
        id: 'u-dir-2',
        name: 'Academics Director',
        email: 'academicsdirector@ekyaschools.com',
        role: 'ManagementAdmin',
        status: 'Active',
        department: 'Academics',
        password: 'password123'
    },
    {
        id: 'u-dir-3',
        name: 'Operations Director',
        email: 'operationsdirector@ekyaschools.com',
        role: 'ManagementAdmin',
        status: 'Active',
        department: 'Operations',
        password: 'password123'
    },
    {
        id: 'u-dir-4',
        name: 'HR Director',
        email: 'hrdirector@ekyaschools.com',
        role: 'ManagementAdmin',
        status: 'Active',
        department: 'Human Resources',
        password: 'password123'
    },
    {
        id: 'u-dir-5',
        name: 'Finance Director',
        email: 'financedirector@ekyaschools.com',
        role: 'ManagementAdmin',
        status: 'Active',
        department: 'Finance',
        password: 'password123'
    },
    {
        id: 'u-dir-6',
        name: 'Innovation Director',
        email: 'innovationdirector@ekyaschools.com',
        role: 'ManagementAdmin',
        status: 'Active',
        department: 'Innovation',
        password: 'password123'
    },

    // --- DEPARTMENT MANAGERS (ADMINS) ---
    {
        id: 'u-adm-1',
        name: 'HR Manager',
        email: 'hr.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'hr',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-2',
        name: 'PD Manager',
        email: 'pd.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'pd',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-3',
        name: 'Operations Manager',
        email: 'operations.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'ops',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-4',
        name: 'Technology Manager',
        email: 'tech.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'tech',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-5',
        name: 'ELC Manager',
        email: 'ekyalearning.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'elc',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-6',
        name: 'Student Dev Manager',
        email: 'studentdev.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'sd',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-7',
        name: 'Marketing Manager',
        email: 'marketing.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'marketing',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-8',
        name: 'Admissions Manager',
        email: 'admissions.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'admissions',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-9',
        name: 'Brand Growth Manager',
        email: 'brandgrowth.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'brand',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-10',
        name: 'QA Manager',
        email: 'qa.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'qa',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-11',
        name: 'Finance Manager',
        email: 'finance.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'finance',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-12',
        name: 'Strategy Manager',
        email: 'strategy.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'strategy',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-adm-13',
        name: 'Wellbeing Manager',
        email: 'wellbeing.manager@ekyaschools.com',
        role: 'Admin',
        departmentId: 'wellbeing',
        status: 'Active',
        password: 'password123'
    },

    // --- SCHOOL HEADS (ADMINS) ---
    {
        id: 'u-sch-1',
        name: 'Principal BTM',
        email: 'principal.btmlayout@ekyaschools.com',
        role: 'Admin',
        schoolId: 'btm-p',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-2',
        name: 'Principal JP Nagar',
        email: 'principal.jpnagar@ekyaschools.com',
        role: 'Admin',
        schoolId: 'jp-p',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-3',
        name: 'Principal ITPL',
        email: 'principal.itpl@ekyaschools.com',
        role: 'Admin',
        schoolId: 'itpl-p',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-4',
        name: 'Principal Byrathi',
        email: 'principal.byrathi@ekyaschools.com',
        role: 'Admin',
        schoolId: 'byrathi-p',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-5',
        name: 'Principal Koppa',
        email: 'principal.koppagubbi@ekyaschools.com',
        role: 'Admin',
        schoolId: 'koppa',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-6',
        name: 'Principal Nice Road',
        email: 'principal.niceroad@ekyaschools.com',
        role: 'Admin',
        schoolId: 'nice',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-7',
        name: 'Principal Kasturi Nagar',
        email: 'principal.kasturinagar@ekyaschools.com',
        role: 'Admin',
        schoolId: 'kala',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-sch-8',
        name: 'Principal World School',
        email: 'principal.worldschool@ekyaschools.com',
        role: 'Admin',
        schoolId: 'world',
        status: 'Active',
        password: 'password123'
    },

    // --- TEACHING & STAFF ---
    {
        id: 'u-ts-1',
        name: 'Math Teacher BTM',
        email: 'teacher.math.btmlayout@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-2',
        name: 'Science Teacher JP Nagar',
        email: 'teacher.science.jpnagar@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-3',
        name: 'English Teacher ITPL',
        email: 'teacher.english.itpl@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-4',
        name: 'Physics Teacher Byrathi',
        email: 'teacher.physics.byrathi@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-5',
        name: 'Admin Staff BTM',
        email: 'staff.admin.btmlayout@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-6',
        name: 'HR Staff',
        email: 'staff.hr@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-7',
        name: 'Finance Staff',
        email: 'staff.finance@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-8',
        name: 'PD Trainer',
        email: 'trainer.pd@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-9',
        name: 'Student Dev Coordinator',
        email: 'coordinator.studentdev@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-ts-10',
        name: 'History Teacher Kasturi Nagar',
        email: 'teacher.history.kasturinagar@ekyaschools.com',
        role: 'TeacherStaff',
        status: 'Active',
        password: 'password123'
    },

    // --- GUESTS ---
    {
        id: 'u-gst-1',
        name: 'Guest 1',
        email: 'guest1@gmail.com',
        role: 'Guest',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-gst-2',
        name: 'Guest Viewer',
        email: 'guest.viewer@external.com',
        role: 'Guest',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-gst-3',
        name: 'Parent Access',
        email: 'parent.access@gmail.com',
        role: 'Guest',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-gst-4',
        name: 'Visitor Public',
        email: 'visitor.public@outlook.com',
        role: 'Guest',
        status: 'Active',
        password: 'password123'
    },
    {
        id: 'u-gst-5',
        name: 'External Consultant',
        email: 'external.consultant@gmail.com',
        role: 'Guest',
        status: 'Active',
        password: 'password123'
    }
];
