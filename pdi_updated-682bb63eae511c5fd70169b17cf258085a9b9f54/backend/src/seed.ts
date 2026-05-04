import prisma from './infrastructure/database/prisma';

import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Use singleton prisma


async function main() {
    console.log('Seeding database (preserving existing data)...');

    const fsLibFull = require('fs');
    const pathLibFull = require('path');
    const backupPath = pathLibFull.join(__dirname, 'data', 'full_database_backup.json');

    if (fsLibFull.existsSync(backupPath) && process.env.FORCE_RESTORE === 'true') {
        console.log('📦 Found full database backup and FORCE_RESTORE is set. Restoring...');
        const backupData = JSON.parse(fsLibFull.readFileSync(backupPath, 'utf8'));

        // Define exact deletion order (children first, parents last) to avoid foreign key errors
        const models = [
            'auditLog', 'surveyAnswer', 'surveyResponse', 'surveyQuestion', 'survey',
            'assessmentAttempt', 'assessmentAssignment', 'assessmentQuestion', 'assessment',
            'learningFestivalApplication', 'learningFestival', 'postOrientationAssessment',
            'dashboardWidget', 'dashboard', 'widgetType', 'formWorkflow', 'formTemplate',
            'announcementAcknowledgement', 'announcement', 'notification', 'courseEnrollment', 'course',
            'documentAcknowledgement', 'document', 'moocSubmission', 'pDHour', 'trainingFeedback',
            'eventAttendance', 'registration', 'trainingEvent', 'goalWindow', 'goal',
            'observationDomain', 'observation', 'growthObservation',
            'meetingShare', 'meetingReply', 'meetingActionItem', 'meetingMinutes', 'meetingAttendee', 'meeting',
            'systemSettings', 'user'
        ];

        // Delete all existing data
        for (const model of models) {
            if (prisma[model]) {
                await prisma[model].deleteMany({});
            }
        }

        console.log('Cleared existing data. Inserting backup data...');

        // Insert in reverse order (parents first, children last)
        const insertModels = [...models].reverse();

        for (const model of insertModels) {
            if (backupData[model] && backupData[model].length > 0) {
                try {
                    await prisma[model].createMany({
                        data: backupData[model]
                    });
                    console.log(`Restored ${backupData[model].length} records for ${model}`);
                } catch (e) {
                    console.log(`createMany failed for ${model}, falling back to individual creates...`);
                    for (const record of backupData[model]) {
                        await prisma[model].create({ data: record });
                    }
                    console.log(`Restored ${backupData[model].length} records for ${model} via loops`);
                }
            }
        }

        console.log('✅ Full database restore complete.');
        return; // Skip the rest of the hardcoded seed
    }


    // ── USERS ─────────────────────────────────────────────────────────────────
    const userData = [
        { name: 'Rohit', email: 'rohit.schoolleader@pdi.com', pass: 'Rohit@123', role: 'LEADER', campusId: 'EBTM', department: 'Leadership', academics: 'CORE' as const },
        { name: 'Avani', email: 'avani.admin@pdi.com', pass: 'Avani@123', role: 'ADMIN', campusId: 'EBTM', department: 'Administration', academics: 'CORE' as const },
        { name: 'Teacher One', email: 'teacher1.btmlayout@pdi.com', pass: 'Teacher1@123', role: 'TEACHER', campusId: 'EBTM', department: 'Science', academics: 'CORE' as const },
        { name: 'Teacher Two', email: 'teacher2.jpnagar@pdi.com', pass: 'Teacher2@123', role: 'TEACHER', campusId: 'EJPN', department: 'Mathematics', academics: 'CORE' as const },
        { name: 'Teacher Three', email: 'teacher3.itpl@pdi.com', pass: 'Teacher3@123', role: 'TEACHER', campusId: 'EITPL', department: 'English', academics: 'CORE' as const },
        { name: 'Teacher Four', email: 'teacher4.art@pdi.com', pass: 'Teacher4@123', role: 'TEACHER', campusId: 'EBTM', department: 'Arts', academics: 'NON_CORE' as const },
        { name: 'Teacher Five', email: 'teacher5.pt@pdi.com', pass: 'Teacher5@123', role: 'TEACHER', campusId: 'EJPN', department: 'Physical Education', academics: 'NON_CORE' as const },
        { name: 'Teacher Six', email: 'teacher6.vart@pdi.com', pass: 'Teacher6@123', role: 'TEACHER', campusId: 'EITPL', department: 'Visual Arts', academics: 'NON_CORE' as const },
        { name: 'Indu', email: 'indu.management@pdi.com', pass: 'Indu@123', role: 'MANAGEMENT', campusId: 'Head Office', department: 'Management', academics: 'CORE' as const },
        { name: 'Bharath', email: 'bharath.superadmin@padi.com', pass: 'Bharath@123', role: 'SUPERADMIN', campusId: 'Head Office', department: 'Admin', academics: 'CORE' as const },

        // --- ENICE Campus Users ---
        { name: 'Mathangi R', email: 'hos.nice@ekyaschools.com', pass: 'Mathangi@123', role: 'LEADER', campusId: 'ENICE', department: 'Leadership', academics: 'CORE' as const },
        { name: 'Asmita Shetiya', email: 'coordinator.nice@ekyaschools.com', pass: 'Asmita@123', role: 'LEADER', campusId: 'ENICE', department: 'Leadership', academics: 'CORE' as const },
        { name: 'Rima Kumari Ojha', email: 'rimakumario@ekyaschools.com', pass: 'Rima@123', role: 'TEACHER', campusId: 'ENICE', department: 'Hindi', academics: 'CORE' as const },
        { name: 'Ankita Prakash', email: 'ankitap@ekyaschools.com', pass: 'Ankita@123', role: 'TEACHER', campusId: 'ENICE', department: 'Mathematics', academics: 'CORE' as const },
        { name: 'Thejaswini', email: 'thejaswinia@ekyaschools.com', pass: 'Thejaswini@123', role: 'TEACHER', campusId: 'ENICE', department: 'Kannada', academics: 'CORE' as const },
        { name: 'Taniya Tiwary', email: 'taniyat@ekyaschools.com', pass: 'Taniya@123', role: 'TEACHER', campusId: 'ENICE', department: 'English', academics: 'CORE' as const },
        { name: 'Sugandhi S', email: 'sugandhis@ekyaschools.com', pass: 'Sugandhi@123', role: 'TEACHER', campusId: 'ENICE', department: 'Social Science', academics: 'CORE' as const },
        { name: 'S Jayalakshmi', email: 'jayalakshmis@ekyaschools.com', pass: 'Jayalakshmi@123', role: 'TEACHER', campusId: 'ENICE', department: 'Biology', academics: 'CORE' as const },
        { name: 'Shruthi Srinivas', email: 'shruthis@ekyaschools.com', pass: 'Shruthi@123', role: 'TEACHER', campusId: 'ENICE', department: 'Computer Science', academics: 'CORE' as const },
        { name: 'Susan George', email: 'susang@ekyaschools.com', pass: 'Susan@123', role: 'TEACHER', campusId: 'ENICE', department: 'Life Skills', academics: 'NON_CORE' as const },
        { name: 'Shashikumara R', email: 'shashikumarar@ekyaschools.com', pass: 'Shashikumara@123', role: 'TEACHER', campusId: 'ENICE', department: 'Physical Education', academics: 'NON_CORE' as const },
        { name: 'Rupsikha Dowerah', email: 'rupsikhad@ekyaschools.com', pass: 'Rupsikha@123', role: 'TEACHER', campusId: 'ENICE', department: 'Social Science', academics: 'CORE' as const },
        { name: 'Prashanth Mallik', email: 'prashanthm@ekyaschools.com', pass: 'Prashanth@123', role: 'TEACHER', campusId: 'ENICE', department: 'Visual Arts', academics: 'NON_CORE' as const },
        { name: 'Shakshi Sandil', email: 'shakshis@ekyaschools.com', pass: 'Shakshi@123', role: 'TEACHER', campusId: 'ENICE', department: 'English', academics: 'CORE' as const },
        { name: 'Mangala R', email: 'mangalar@ekyaschools.com', pass: 'Mangala@123', role: 'TEACHER', campusId: 'ENICE', department: 'Kannada', academics: 'CORE' as const },

        // --- System Personas ---
        { name: 'Academic Coordinator', email: 'coordinator.academic@pdi.com', pass: 'Coordinator@123', role: 'LEADER', campusId: 'EBTM', department: 'Academic', academics: 'CORE' as const },
        { name: 'Dr. Tristha', email: 'tristha.management@pdi.com', pass: 'Coordinator@123', role: 'MANAGEMENT', campusId: 'Head Office', department: 'Executive', academics: 'CORE' as const },
        { name: 'Restricted Tester', email: 'test@pdi.com', pass: 'Test@123', role: 'TESTER', campusId: 'Head Office', department: 'Testing', academics: 'CORE' as const },

        // --- Support & Coordinator Accounts ---
        { name: 'BTM Layout Support', email: 'btm.support@ekya.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'EBTM', department: 'Support', academics: 'CORE' as const },
        { name: 'BTM Principal', email: 'principal.btm@ekya.edu', pass: 'Support@123', role: 'LEADER', campusId: 'EBTM', department: 'Leadership', academics: 'CORE' as const },
        { name: 'JP Nagar Support', email: 'jpn.support@ekya.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'EJPN', department: 'Support', academics: 'CORE' as const },
        { name: 'ITPL Support', email: 'itpl.support@ekya.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'EITPL', department: 'Support', academics: 'CORE' as const },
        { name: 'Byrathi Support', email: 'byrathi.support@ekya.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'EBYR', department: 'Support', academics: 'CORE' as const },
        { name: 'NICE Road Support', email: 'niceroad.support@ekya.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'ENICE', department: 'Support', academics: 'CORE' as const },
        { name: 'CMR NPS Support', email: 'nps.support@cmr.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'CMR NPS', department: 'Support', academics: 'CORE' as const },
        { name: 'Global Support', email: 'support@ekya.edu', pass: 'Support@123', role: 'COORDINATOR', campusId: 'Head Office', department: 'Support', academics: 'CORE' as const },
    ];

    const ids: Record<string, string> = {};
    for (const u of userData) {
        const hash = await bcrypt.hash(u.pass, 10);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { fullName: u.name, passwordHash: hash, role: u.role as any, campusId: u.campusId, department: u.department, academics: u.academics },
            create: { fullName: u.name, email: u.email, passwordHash: hash, role: u.role as any, campusId: u.campusId, department: u.department, academics: u.academics },
        });
        ids[u.email] = user.id;
        console.log(`User: ${u.name} → ${user.id}`);
    }

    const leaderId = ids['rohit.schoolleader@pdi.com'];
    const adminId = ids['avani.admin@pdi.com'];
    const t1 = ids['teacher1.btmlayout@pdi.com'];
    const t2 = ids['teacher2.jpnagar@pdi.com'];
    const t3 = ids['teacher3.itpl@pdi.com'];

    // ── SYSTEM SETTINGS / ACCESS MATRIX ──────────────────────────────────────
    const accessMatrix = [
        { moduleId: 'users', moduleName: 'User Management', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, TEACHER: false, TESTER: false } },
        { moduleId: 'team', moduleName: 'Team Overview', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, TEACHER: false } },
        { moduleId: 'forms', moduleName: 'Form Templates', roles: { SUPERADMIN: true, ADMIN: true, LEADER: false, MANAGEMENT: false, TEACHER: false } },
        { moduleId: 'courses', moduleName: 'Course Catalogue', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, TEACHER: true } },
        { moduleId: 'calendar', moduleName: 'Training Calendar', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, TEACHER: true } },
        { moduleId: 'documents', moduleName: 'Documents', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, TEACHER: true } },
        { moduleId: 'reports', moduleName: 'Reports & Analytics', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, TEACHER: false } },
        { moduleId: 'settings', moduleName: 'System Settings', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, TEACHER: false } },
        { moduleId: 'attendance', moduleName: 'Attendance', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: false, COORDINATOR: true, TEACHER: true } },
        { moduleId: 'observations', moduleName: 'Observations', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true } },
        { moduleId: 'goals', moduleName: 'Goal Management', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true } },
        { moduleId: 'hours', moduleName: 'PD Hours Tracking', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true } },
        { moduleId: 'insights', moduleName: 'Data Insights', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true } },
        { moduleId: 'meetings', moduleName: 'Meetings', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true } },
        { moduleId: 'announcements', moduleName: 'Announcements', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'survey', moduleName: 'Surveys', roles: { SUPERADMIN: true, ADMIN: true, LEADER: false, MANAGEMENT: true, COORDINATOR: true, TEACHER: true } },

        // --- Educator Hub ---
        { moduleId: 'edu-hub', moduleName: 'Home (Edu Hub)', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'who-we-are', moduleName: 'Who we are', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'my-campus', moduleName: 'My campus', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'teaching', moduleName: 'Teaching', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'my-classroom', moduleName: 'My classroom', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'interactions', moduleName: 'Interactions', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'tickets', moduleName: 'Tickets', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'grow', moduleName: 'Grow', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

        // --- HR & WellBeing ---
        { moduleId: 'resources', moduleName: 'Resources', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'educator-essentials', moduleName: 'Educator Essentials', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'educator-guide', moduleName: 'Educator Guide', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'wellbeing', moduleName: 'WellBeing', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

        // --- Technology ---
        { moduleId: 'tech-sites-login', moduleName: 'Educator Site', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'greythr', moduleName: 'GreytHR', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'schoology', moduleName: 'Schoology', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'google-workspace', moduleName: 'Google Workspace', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'zoom', moduleName: 'Zoom', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'slack', moduleName: 'Slack', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'email-signature', moduleName: 'Email Signature Templates', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'ekyaverse', moduleName: 'Ekyaverse-Neverskip', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
        { moduleId: 'audit-reports', moduleName: 'Audit & Reports', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
    ];
    const formFlows = [
        { id: '1', formName: 'Walkthrough Observation', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports' },
        { id: '2', formName: 'Professional Goal', senderRole: 'TEACHER', targetDashboard: 'Leader Dashboard', targetLocation: 'Pending Approvals' },
        { id: '3', formName: 'MOOC Evidence', senderRole: 'TEACHER', targetDashboard: 'Admin Dashboard', targetLocation: 'Course Reviews' },
        { id: '4', formName: 'Teacher Reflection', senderRole: 'TEACHER', targetDashboard: 'Teacher Dashboard', targetLocation: 'My Portfolio' },
        { id: '5', formName: 'Attendance Submission', senderRole: 'TEACHER', targetDashboard: 'Admin Dashboard', targetLocation: 'Attendance Register' },
    ];
    const institutionalSections = [
        { title: "Mission & Vision", content: "To empower every learner through innovative pedagogy...", route: "/educator-hub/institutional-identity/philosophy" },
        { title: "Our Teams", content: "Discover the leadership and educators behind our success...", route: "/educator-hub/institutional-identity/schools" },
        { title: "Founder's Message", content: "A legacy of excellence built on trust and innovation...", route: "/educator-hub/institutional-identity/founders-message" },
        { title: "Contact Directory", content: "Direct lines to all campus departments...", route: "" },
        { title: "School Prayer", content: "The spiritual foundation of our community...", route: "/educator-hub/institutional-identity/prayer" }
    ];

    await prisma.systemSettings.upsert({
        where: { key: 'access_matrix_config' },
        update: { value: JSON.stringify({ accessMatrix, formFlows }) },
        create: { key: 'access_matrix_config', value: JSON.stringify({ accessMatrix, formFlows }) },
    });

    await prisma.systemSettings.upsert({
        where: { key: 'institutional_identity_sections' },
        update: { value: JSON.stringify(institutionalSections) },
        create: { key: 'institutional_identity_sections', value: JSON.stringify(institutionalSections) },
    });

    // ── FORM TEMPLATES ────────────────────────────────────────────────────────
    const observationFields = [
        { id: 'teacherId', type: 'select', label: 'Name of the Teacher', required: true, options: ['Teacher One', 'Teacher Two', 'Teacher Three', 'Teacher Four', 'Teacher Five', 'Teacher Six'] },
        { id: 'date', type: 'date', label: 'Date of Observation', required: true },
        { id: 'campus', type: 'select', label: 'Campus', required: true, options: ['EJPN', 'EITPL', 'EBTM', 'EBYR', 'ENICE', 'ENAVA'] },
        { id: 'observerRole', type: 'radio', label: "Observer's Role", required: true, options: ['Academic Coordinator', 'Head of School', 'PDI Team Member', 'Other'] },
        { id: 'domain3A', type: 'header', label: '3A: Planning & Preparation' },
        { id: '3A_1', type: 'radio', label: 'Knowledge of Content and Pedagogy', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3A_2', type: 'radio', label: 'Knowledge of Students', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3A_3', type: 'radio', label: 'Knowledge of Resources', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3A_4', type: 'radio', label: 'Designing a Microplan', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3A_5', type: 'radio', label: 'Using Student Assessments', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3A_evidence', type: 'textarea', label: 'Evidence for 3A' },
        { id: 'domain3B1', type: 'header', label: '3B1: Classroom Practice' },
        { id: '3B1_1', type: 'radio', label: 'Respect and Rapport', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3B1_2', type: 'radio', label: 'Culture for Learning', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3B1_3', type: 'radio', label: 'Managing Classroom Procedures', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3B1_4', type: 'radio', label: 'Managing Student Behaviour', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: '3B1_evidence', type: 'textarea', label: 'Evidence for 3B1' },
    ];

    const specialistFields = [
        { id: 'teacherId', type: 'select', label: 'Name of the Specialist Teacher', required: true, options: ['Teacher Four', 'Teacher Five', 'Teacher Six'] },
        { id: 'date', type: 'date', label: 'Date of Observation', required: true },
        { id: 'campus', type: 'select', label: 'Campus', required: true, options: ['EJPN', 'EITPL', 'EBTM', 'EBYR', 'ENICE', 'ENAVA'] },
        { id: 'observerRole', type: 'radio', label: "Observer's Role", required: true, options: ['Academic Coordinator', 'Head of School', 'PDI Team Member', 'Other'] },
        { id: 'domainS1', type: 'header', label: 'S1: Specialized Instruction & Skills' },
        { id: 'S1_1', type: 'radio', label: 'Skill-Based Pedagogy', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'S1_2', type: 'radio', label: 'Use of Specialist Resources', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'S1_3', type: 'radio', label: 'Safety & Procedure Management', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'S1_evidence', type: 'textarea', label: 'Evidence for S1' },
        { id: 'domainS2', type: 'header', label: 'S2: Student Engagement & Artistic/Physical Expression' },
        { id: 'S2_1', type: 'radio', label: 'Engaging Diverse Talent', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'S2_2', type: 'radio', label: 'Feedback on Skill Development', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'S2_evidence', type: 'textarea', label: 'Evidence for S2' },
    ];

    const reflectionFields = [
        { id: 'r1', type: 'radio', label: 'A1: Content and Pedagogy', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'r2', type: 'radio', label: 'A2: Knowledge of Students', options: ['Basic', 'Developing', 'Effective', 'Highly Effective', 'Not Observed'] },
        { id: 'r23', type: 'textarea', label: 'Your Strengths', required: true },
        { id: 'r24', type: 'textarea', label: 'Areas for Improvement', required: true },
        { id: 'r25', type: 'text', label: 'Goal for yourself', required: true },
        { id: 'r26', type: 'textarea', label: 'Additional Comments' },
    ];

    const moocFields = [
        { id: 'courseName', type: 'text', label: 'Name of Course', required: true },
        { id: 'hours', type: 'text', label: 'Number of Hours', required: true },
        { id: 'platform', type: 'select', label: 'Platform', required: true, options: ['Coursera', 'FutureLearn', 'Khan Academy', 'edX', 'Alison', 'Class Central', 'Schoology', 'Other'] },
        { id: 'startDate', type: 'date', label: 'Date of Start', required: true },
        { id: 'endDate', type: 'date', label: 'Date of End', required: true },
        { id: 'hasCertificate', type: 'radio', label: 'Do you have a certificate?', options: ['yes', 'no'], required: true },
        { id: 'proofLink', type: 'text', label: 'Drive Link' },
        { id: 'effectivenessRating', type: 'rating', label: 'Course Effectiveness Rating (1-10)' },
        { id: 'additionalFeedback', type: 'textarea', label: 'Additional Feedback' },
    ];

    const goalFields = [
        { id: 'educatorName', type: 'select', label: 'Name of the Educator', required: true, options: ['Teacher One', 'Teacher Two', 'Teacher Three', 'Teacher Four', 'Teacher Five', 'Teacher Six'] },
        { id: 'campus', type: 'select', label: 'Campus', required: true, options: ['EJPN', 'EITPL', 'EBTM', 'EBYR'] },
        { id: 'dateOfGoalSetting', type: 'date', label: 'Date of Goal Setting', required: true },
        { id: 'goalForYear', type: 'textarea', label: 'Goal for the Academic Year', required: true },
        { id: 'reasonForGoal', type: 'textarea', label: 'Reason for the Goal', required: true },
        { id: 'actionStep', type: 'textarea', label: 'Action Step', required: true },
        { id: 'pillarTag', type: 'select', label: 'Pillar Tag', required: true, options: ['Live the Lesson', 'Authentic Assessments', 'Instruct to Inspire', 'Care about Culture', 'Engaging Environment', 'Professional Practice'] },
    ];

    const templates = [
        // --- OBSERVATIONS (12) ---
        { name: 'Walkthrough Observation', type: 'OBSERVATION', isDefault: true, structure: JSON.stringify(observationFields) },
        { name: 'Specialist Observation', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(specialistFields) },
        { name: 'Formal Classroom Observation', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Peer Observation', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Quick Check Maintenance', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Learning Walk', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Instructional Focus Visit', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Deep Dive Observation', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Curriculum Alignment Check', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Student Engagement Scan', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Differentiation Spotlight', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },
        { name: 'Assessment Integration Review', type: 'OBSERVATION', isDefault: false, structure: JSON.stringify(observationFields) },

        // --- GOALS (2) ---
        { name: 'Professional Goal', type: 'GOAL', isDefault: true, structure: JSON.stringify(goalFields) },
        { name: 'Annual Goal Setting', type: 'GOAL', isDefault: false, structure: JSON.stringify(goalFields) },

        // --- MOOC (2) ---
        { name: 'MOOC Evidence', type: 'MOOC', isDefault: true, structure: JSON.stringify(moocFields) },
        { name: 'External Certifications Submission', type: 'MOOC', isDefault: false, structure: JSON.stringify(moocFields) },

        // --- OTHERS ---
        { name: 'Teacher Reflection', type: 'REFLECTION', isDefault: true, structure: JSON.stringify(reflectionFields) },
        { name: 'Attendance Submission', type: 'ATTENDANCE', isDefault: true, structure: JSON.stringify([]) },
    ];

    for (const t of templates) {
        const existing = await (prisma.formTemplate as any).findFirst({ where: { name: t.name } });

        if (existing) {
            await prisma.formTemplate.update({
                where: { id: existing.id },
                data: { type: t.type, structure: t.structure, isDefault: t.isDefault }
            });
        } else {
            await prisma.formTemplate.create({ data: t });
        }
    }
    console.log('Seeded 12 Observation forms, 2 Goal forms, and 2 MOOC forms.');



    // ── TRAINING EVENTS ───────────────────────────────────────────────────────
    // Seed training events only if they don't already exist (match by title)
    const seedEvents = [
        { title: 'Effective Questioning Techniques', topic: 'Pedagogy', type: 'Workshop', date: 'Jan 25, 2026', time: '9:00 AM – 12:00 PM', location: 'EBTM Campus', capacity: 30, status: 'COMPLETED', attendanceEnabled: true, attendanceClosed: false, attendanceTriggeredAt: new Date(), description: 'Deep dive into Socratic questioning and formative discussion strategies.', createdById: leaderId },
        { title: 'Google Workspace for Education', topic: 'Technology', type: 'Training', date: 'Feb 5, 2026', time: '10:00 AM – 1:00 PM', location: 'EJPN Campus', capacity: 25, status: 'COMPLETED', attendanceEnabled: false, attendanceClosed: true, description: 'Hands-on training for Docs, Slides, Meet and Classroom integration.', createdById: adminId },
        { title: 'Building a Positive Class Culture', topic: 'Culture', type: 'Seminar', date: 'Feb 18, 2026', time: '2:00 PM – 5:00 PM', location: 'EITPL Campus', capacity: 40, status: 'APPROVED', description: 'Strategies for restorative practices and student wellbeing.', createdById: leaderId },
        { title: 'Differentiated Instruction Masterclass', topic: 'Pedagogy', type: 'Workshop', date: 'Mar 10, 2026', time: '9:00 AM – 4:00 PM', location: 'Head Office', capacity: 20, status: 'APPROVED', description: 'Learn how to address diverse learning needs in one classroom.', createdById: adminId },
    ];

    const events: any[] = [];
    for (const ev of seedEvents) {
        const existing = await prisma.trainingEvent.findFirst({ where: { title: ev.title } });
        if (existing) {
            events.push(existing);
            console.log(`Skipping existing event: ${ev.title}`);
        } else {
            const created = await prisma.trainingEvent.create({ data: ev });
            events.push(created);
            console.log(`Created event: ${ev.title}`);
        }
    }

    // Register teachers for first two events (skip if already registered)
    for (const uid of [t1, t2, t3]) {
        for (const ev of events.slice(0, 2)) {
            const existingReg = await prisma.registration.findUnique({ where: { eventId_userId: { eventId: ev.id, userId: uid } } });
            if (!existingReg) {
                await prisma.registration.create({ data: { eventId: ev.id, userId: uid } });
            }
        }
    }
    console.log('Seeded training events + registrations');

    // ── OBSERVATIONS (2 per teacher) ──────────────────────────────────────────
    const observations = [
        { teacherId: t1, domain: 'Domain 3A', score: 4.2, date: 'Jan 15, 2026', campus: 'EBTM', learningArea: 'Science', grade: '7', section: 'A', notes: 'Well-structured lesson with clear objectives. Excellent use of visuals.', actionStep: 'Incorporate more open-ended questions to deepen student inquiry.' },
        { teacherId: t1, domain: 'Domain 3B1', score: 3.8, date: 'Feb 2,  2026', campus: 'EBTM', learningArea: 'Science', grade: '8', section: 'B', notes: 'Positive classroom environment. Students felt comfortable sharing ideas.', actionStep: 'Work on transition times between activities to improve pacing.' },
        { teacherId: t2, domain: 'Domain 3A', score: 4.5, date: 'Jan 20, 2026', campus: 'EJPN', learningArea: 'Mathematics', grade: '9', section: 'C', notes: 'Outstanding microplan aligned with curriculum goals. Clear progression of concepts.', actionStep: 'Add more real-world application problems to strengthen conceptual understanding.' },
        { teacherId: t2, domain: 'Domain 3B1', score: 4.0, date: 'Feb 8,  2026', campus: 'EJPN', learningArea: 'Mathematics', grade: '10', section: 'A', notes: 'Good management of student behaviour. Warm-up activity was effective.', actionStep: 'Explore brain break strategies to maintain focus during long problem sets.' },
        { teacherId: t3, domain: 'Domain 3A', score: 4.1, date: 'Jan 22, 2026', campus: 'EITPL', learningArea: 'English', grade: '6', section: 'B', notes: 'Creative lesson design with strong text selection. Students were engaged readers.', actionStep: 'Introduce more structured debate and argument-building exercises.' },
        { teacherId: t3, domain: 'Domain 3B1', score: 3.9, date: 'Feb 12, 2026', campus: 'EITPL', learningArea: 'English', grade: '7', section: 'D', notes: 'Strong culture for learning. Students were proud to share creative writing.', actionStep: 'Implement peer editing workshops to strengthen collaborative literacy.' },
    ];

    for (const o of observations) {
        const existingObs = await prisma.observation.findFirst({ where: { teacherId: o.teacherId, date: o.date, domain: o.domain } });
        if (!existingObs) {
            await prisma.observation.create({
                data: { teacherId: o.teacherId, observerId: leaderId, date: o.date, domain: o.domain, score: o.score, notes: o.notes, actionStep: o.actionStep, status: 'SUBMITTED', campus: o.campus, grade: o.grade, section: o.section, learningArea: o.learningArea, hasReflection: false },
            });
        }
    }
    console.log('Seeded observations for all three teachers');

    // ── GOALS (2 per teacher) ─────────────────────────────────────────────────
    const goals = [
        { teacherId: t1, teacherEmail: 'teacher1.btmlayout@pdi.com', title: 'Improve Inquiry-Based Learning', description: 'Implement at least 3 inquiry-based lesson cycles per term using the 5E model.', progress: 65, dueDate: 'Jun 30, 2026', isSchoolAligned: true, category: 'Instruct to Inspire', campus: 'EBTM', actionStep: 'Complete online module on inquiry-based learning and trial one lesson per week.' },
        { teacherId: t1, teacherEmail: 'teacher1.btmlayout@pdi.com', title: 'Formative Assessment Mastery', description: 'Use exit tickets and peer feedback consistently across all Science units.', progress: 40, dueDate: 'May 15, 2026', isSchoolAligned: false, category: 'Authentic Assessments', campus: 'EBTM', actionStep: 'Design a bank of 20 exit tickets aligned to curriculum standards.' },
        { teacherId: t2, teacherEmail: 'teacher2.jpnagar@pdi.com', title: 'Real-World Maths Integration', description: 'Connect all Maths units to real-world scenarios through project-based tasks.', progress: 50, dueDate: 'Jun 30, 2026', isSchoolAligned: true, category: 'Live the Lesson', campus: 'EJPN', actionStep: 'Design one real-world project per unit using financial literacy themes.' },
        { teacherId: t2, teacherEmail: 'teacher2.jpnagar@pdi.com', title: 'Differentiated Instruction', description: 'Implement tiered tasks to support advanced and struggling learners simultaneously.', progress: 30, dueDate: 'Apr 30, 2026', isSchoolAligned: false, category: 'Engaging Environment', campus: 'EJPN', actionStep: 'Attend the Differentiated Instruction Masterclass in March 2026.' },
        { teacherId: t3, teacherEmail: 'teacher3.itpl@pdi.com', title: 'Student Voice Through Writing', description: 'Build a student portfolio programme where learners publish one piece each term.', progress: 70, dueDate: 'Jun 30, 2026', isSchoolAligned: true, category: 'Care about Culture', campus: 'EITPL', actionStep: 'Set up a classroom blog and establish a weekly writing workshop routine.' },
        { teacherId: t3, teacherEmail: 'teacher3.itpl@pdi.com', title: 'Reading Comprehension Strategies', description: 'Explicitly teach 5 comprehension strategies and track student growth each term.', progress: 55, dueDate: 'May 31, 2026', isSchoolAligned: false, category: 'Instruct to Inspire', campus: 'EITPL', actionStep: 'Implement a reading log system and weekly comprehension strategy lesson.' },
    ];

    for (const g of goals) {
        const existingGoal = await prisma.goal.findFirst({ where: { teacherId: g.teacherId, title: g.title } });
        if (!existingGoal) {
            await prisma.goal.create({ data: { ...g, assignedBy: 'Rohit', status: g.progress === 100 ? 'COMPLETED' : 'IN_PROGRESS' } });
        }
    }
    console.log('Seeded goals for all three teachers');

    // ── MOOC SUBMISSIONS (1 approved per teacher) ─────────────────────────────
    const moocs = [
        { userId: t1, teacherName: 'Teacher One', teacherEmail: 'teacher1.btmlayout@pdi.com', courseName: 'Science of Teaching and Learning', platform: 'Coursera', hours: 20, rating: 9, feedback: 'Excellent course. Immediately applicable in the classroom.' },
        { userId: t2, teacherName: 'Teacher Two', teacherEmail: 'teacher2.jpnagar@pdi.com', courseName: 'Teaching Mathematics for Understanding', platform: 'edX', hours: 15, rating: 8, feedback: 'Great frameworks for conceptual maths instruction.' },
        { userId: t3, teacherName: 'Teacher Three', teacherEmail: 'teacher3.itpl@pdi.com', courseName: 'Teaching English Language and Literacy', platform: 'FutureLearn', hours: 18, rating: 9, feedback: 'Very relevant to my daily teaching practice.' },
    ];

    for (const m of moocs) {
        const existingMooc = await prisma.moocSubmission.findFirst({ where: { userId: m.userId, courseName: m.courseName } });
        if (!existingMooc) {
            await prisma.moocSubmission.create({
                data: { userId: m.userId, teacherName: m.teacherName, teacherEmail: m.teacherEmail, courseName: m.courseName, platform: m.platform, hours: m.hours, startDate: new Date('2025-10-01'), endDate: new Date('2025-12-15'), hasCertificate: 'yes', certificateType: 'link', proofLink: 'https://drive.google.com/certificate', effectivenessRating: m.rating, additionalFeedback: m.feedback, status: 'APPROVED' },
            });
        }
    }
    console.log('Seeded MOOC submissions for all three teachers');

    // ── PD HOURS BREAKDOWN (Stacked Bars) ────────────────────────────────────
    const categories = ['Workshop', 'MOOC', 'In-house Training', 'Self-study'];
    for (const uid of [t1, t2, t3]) {
        for (const cat of categories) {
            const h = Math.floor(Math.random() * 10) + 2;
            await prisma.pDHour.create({
                data: {
                    userId: uid,
                    activity: `${cat} Activity for ${cat}`,
                    hours: h,
                    category: cat,
                    status: 'APPROVED',
                    date: new Date()
                }
            });
        }
    }
    console.log('Seeded PD Hours breakdown for all three teachers');

    // ── COURSES + ENROLLMENTS ─────────────────────────────────────────────────
    const course1 = await prisma.course.upsert({ where: { id: 'seed-course-1' }, update: {}, create: { id: 'seed-course-1', title: 'Foundations of Pedagogy', description: 'Core pedagogical frameworks for effective teaching.', instructor: 'Dr. Priya Sharma', hours: 30, category: 'Pedagogy', status: 'PUBLISHED' } });
    const course2 = await prisma.course.upsert({ where: { id: 'seed-course-2' }, update: {}, create: { id: 'seed-course-2', title: 'EdTech Essentials', description: 'Using technology tools effectively in the modern classroom.', instructor: 'Rajiv Menon', hours: 20, category: 'Technology', status: 'PUBLISHED' } });
    const course3 = await prisma.course.upsert({ where: { id: 'seed-course-3' }, update: {}, create: { id: 'seed-course-3', title: 'Classroom Culture & Wellbeing', description: 'Build a positive, inclusive learning environment.', instructor: 'Ananya Das', hours: 25, category: 'Culture', status: 'PUBLISHED' } });

    for (const uid of [t1, t2, t3]) {
        const existingEnrollment = await prisma.courseEnrollment.findFirst({ where: { courseId: course1.id, userId: uid } });
        if (!existingEnrollment) {
            await prisma.courseEnrollment.create({ data: { courseId: course1.id, userId: uid, progress: 60 } });
        }
    }
    console.log('Seeded courses and enrollments');

    // ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────
    const announcements = [
        { title: 'New PD Policy Update', description: 'Please review the updated professional development handbook available in Documents.', role: 'Admin', priority: 'High', status: 'Published', createdById: adminId, targetRoles: '["TEACHER","LEADER"]' },
        { title: 'Term 2 Schedule', description: 'The academic calendar for Term 2 has been finalized.', role: 'Leader', priority: 'Normal', status: 'Published', createdById: leaderId, targetRoles: '["TEACHER"]' },
        { title: 'Campus Maintenance', description: 'Network maintenance scheduled for this Saturday.', role: 'Admin', priority: 'Normal', status: 'Published', createdById: adminId, targetRoles: '["TEACHER","LEADER","MANAGEMENT"]' },
        { title: 'System Maintenance', description: 'The portal will be down for maintenance on Sunday from 2 AM to 4 AM.', createdById: adminId, role: 'ADMIN', priority: 'High', status: 'Published', isPinned: true, targetRoles: '["TEACHER", "LEADER"]', targetDepartments: '[]', targetCampuses: '[]' },
        { title: 'New PD Policy', description: 'Please review the updated professional development policy in the documents section.', createdById: leaderId, role: 'LEADER', priority: 'Normal', status: 'Published', isPinned: false, targetRoles: '["TEACHER"]', targetDepartments: '[]', targetCampuses: '[]' },
    ];

    for (const a of announcements) {
        const existingAnn = await prisma.announcement.findFirst({ where: { title: a.title, createdById: a.createdById } });
        if (!existingAnn) {
            await prisma.announcement.create({ data: { ...a } });
        }
    }
    console.log('Seeded announcements');

    // ── MEETINGS ──────────────────────────────────────────────────────────────
    const meetings = [
        { title: 'Weekly Staff Briefing', description: 'Updates on upcoming events and student welfare.', meetingType: 'Staff', meetingDate: '2026-02-22', startTime: '08:30', endTime: '09:30', mode: 'Offline', createdById: leaderId, status: 'Scheduled', campusId: 'EBTM' },
        { title: 'Science Dept Review', description: 'Reviewing Term 1 assessment data.', meetingType: 'Department', meetingDate: '2026-02-25', startTime: '14:00', endTime: '15:30', mode: 'Online', createdById: leaderId, status: 'Scheduled', departmentId: 'Science' },
        { title: 'Academic Standards', description: 'Quarterly review of academic standards.', meetingType: 'Management', meetingDate: '2026-03-01', startTime: '10:00', endTime: '12:00', mode: 'Online', createdById: adminId, status: 'Scheduled' },
        { title: 'Term 1 Retrospective', description: 'Discussing what went well and areas for improvement.', meetingType: 'Academic Review', meetingDate: '2026-01-15', startTime: '15:00', endTime: '16:30', mode: 'Offline', createdById: leaderId, status: 'Completed', momStatus: 'Published' },
        { title: 'Weekly Staff Meeting', description: 'Regular weekly sync for all staff.', meetingType: 'Staff', meetingDate: '2026-02-25', startTime: '15:00', endTime: '16:00', mode: 'Offline', locationLink: 'Conference Room A', createdById: leaderId, status: 'Scheduled', momStatus: 'Not Created' },
        { title: 'Science Department Huddle', description: 'Curriculum planning for next term.', meetingType: 'Department', meetingDate: '2026-02-20', startTime: '10:00', endTime: '11:00', mode: 'Online', locationLink: 'https://meet.google.com/abc-defg-hij', createdById: leaderId, status: 'Completed', momStatus: 'Published' },
    ];

    for (const m of meetings) {
        const existingMeeting = await prisma.meeting.findFirst({ where: { title: m.title, meetingDate: m.meetingDate } });
        if (existingMeeting) {
            console.log(`Skipping existing meeting: ${m.title}`);
            continue;
        }
        const meeting = await prisma.meeting.create({ data: m });

        // Create MoM if Published
        if (m.momStatus === 'Published') {
            await prisma.meetingMinutes.create({
                data: {
                    meetingId: meeting.id,
                    objective: m.title.includes('Retrospective') ? 'Discussing what went well' : 'Discuss curriculum planning',
                    agendaPoints: JSON.stringify(['Review last term', 'Plan next term']),
                    discussionSummary: 'Productive discussion on new modules.',
                    decisions: JSON.stringify(['Adopt new textbook', 'Schedule follow-up']),
                    attendanceCount: 3,
                    status: 'Published',
                    createdById: leaderId
                }
            });
        }

        // Invite relevant teachers
        const staffMeetings = ['Weekly Staff Briefing', 'Term 1 Retrospective', 'Weekly Staff Meeting'];
        if (staffMeetings.includes(m.title)) {
            for (const attendeeData of [
                { meetingId: meeting.id, userId: t1, attendanceStatus: 'Invited' },
                { meetingId: meeting.id, userId: t2, attendanceStatus: 'Invited' },
                { meetingId: meeting.id, userId: t3, attendanceStatus: 'Invited' },
            ]) {
                const existingAt = await prisma.meetingAttendee.findFirst({ where: { meetingId: attendeeData.meetingId, userId: attendeeData.userId } });
                if (!existingAt) await prisma.meetingAttendee.create({ data: attendeeData });
            }
        } else if (m.title.includes('Science')) {
            const existingAt1 = await prisma.meetingAttendee.findFirst({ where: { meetingId: meeting.id, userId: t1 } });
            if (!existingAt1) await prisma.meetingAttendee.create({ data: { meetingId: meeting.id, userId: t1, attendanceStatus: 'Invited' } });
        }
    }
    console.log('Seeded meetings and invitations');

    // ── EVENT ATTENDANCE ──────────────────────────────────────────────────────
    const event1 = events[0];
    const attendanceRecords = [
        { eventId: event1.id, teacherId: t1, teacherName: 'Teacher One', teacherEmail: 'teacher1.btmlayout@pdi.com', status: true, schoolId: 'EBTM', department: 'Science' },
        { eventId: event1.id, teacherId: t2, teacherName: 'Teacher Two', teacherEmail: 'teacher2.jpnagar@pdi.com', status: true, schoolId: 'EJPN', department: 'Mathematics' },
    ];

    for (const r of attendanceRecords) {
        const existingAtt = await prisma.eventAttendance.findUnique({ where: { eventId_teacherEmail: { eventId: r.eventId, teacherEmail: r.teacherEmail } } });
        if (!existingAtt) {
            await prisma.eventAttendance.create({ data: r });
        }
    }
    console.log('Seeded event attendance');

    // ── SURVEYS ───────────────────────────────────────────────────────────────
    const existingSurvey = await (prisma as any).survey.findFirst({ where: { title: 'AY 25–26 PD Term 1 Survey' } });
    if (!existingSurvey) await (prisma as any).survey.create({
        data: {
            title: 'AY 25–26 PD Term 1 Survey',
            academicYear: '2025-2026',
            term: '1',
            description: 'Dear Educators, We are about to complete the first term of the academic year...',
            isActive: true,
            isAnonymous: true,
            questions: {
                create: [
                    { pageNumber: 1, orderIndex: 1, questionText: 'Campus', questionType: 'multiple_choice', isRequired: true, options: JSON.stringify(['CMR NPS', 'EJPN', 'EITPL', 'EBTM', 'EBYR', 'ENICE', 'PU HRBR', 'PU ITPL', 'PU BTM', 'PU BYR']) },
                    { pageNumber: 1, orderIndex: 2, questionText: 'How satisfied are you with the professional development opportunities provided by us?', questionType: 'rating_scale', isRequired: true, options: JSON.stringify({ min: 1, max: 5, lowLabel: 'Not Satisfied at All', highLabel: 'Very Satisfied' }) },
                    { pageNumber: 1, orderIndex: 3, questionText: 'What is the one reason for your rating?', questionType: 'long_text', isRequired: true },
                    { pageNumber: 2, orderIndex: 4, questionText: 'Which sessions did you find most useful?', questionType: 'multi_select', isRequired: true, options: JSON.stringify(['Differentiating Specific Lesson Components using AI (SS Block)', 'Differentiating Specific Lesson Components using AI (P/M Block)', 'Strategies for Maximising Student Engagement', 'AI Bootcamp Session', 'Arduino Workshop', 'Teacher Sensitization', 'Mastering Online Teaching', 'C&I Training']) },
                    { pageNumber: 2, orderIndex: 5, questionText: 'Describe why you selected the above sessions', questionType: 'long_text', isRequired: true },
                    { pageNumber: 2, orderIndex: 6, questionText: 'Mention one way you implemented this learning in class', questionType: 'long_text', isRequired: true },
                    { pageNumber: 2, orderIndex: 7, questionText: 'How effective was post-session support?', questionType: 'rating_scale', isRequired: true, options: JSON.stringify({ min: 1, max: 5 }) },
                    { pageNumber: 2, orderIndex: 8, questionText: 'Sessions that could be improved', questionType: 'long_text', isRequired: false },
                    { pageNumber: 2, orderIndex: 9, questionText: 'Anything else to share', questionType: 'long_text', isRequired: false },
                    { pageNumber: 3, orderIndex: 10, questionText: 'Were you observed at least once in Term 1?', questionType: 'yes_no', isRequired: true },
                    { pageNumber: 3, orderIndex: 11, questionText: 'Rate effectiveness of classroom observation feedback', questionType: 'rating_scale', isRequired: true, options: JSON.stringify({ min: 1, max: 5 }) },
                    { pageNumber: 3, orderIndex: 12, questionText: 'Reason for rating', questionType: 'long_text', isRequired: true },
                    { pageNumber: 3, orderIndex: 13, questionText: 'Additional comments', questionType: 'long_text', isRequired: false },
                    { pageNumber: 4, orderIndex: 14, questionText: 'Rate effectiveness of LA Touchpoints', questionType: 'rating_scale', isRequired: true, options: JSON.stringify({ min: 1, max: 5 }) },
                    { pageNumber: 4, orderIndex: 15, questionText: 'Reason for rating', questionType: 'long_text', isRequired: true },
                    { pageNumber: 4, orderIndex: 16, questionText: 'Additional comments', questionType: 'long_text', isRequired: false },
                    { pageNumber: 5, orderIndex: 17, questionText: 'Rate satisfaction with updated MOOCs', questionType: 'rating_scale', isRequired: true, options: JSON.stringify({ min: 1, max: 5 }) },
                    { pageNumber: 5, orderIndex: 18, questionText: 'Reason for rating', questionType: 'long_text', isRequired: true },
                    { pageNumber: 5, orderIndex: 19, questionText: 'Additional comments', questionType: 'long_text', isRequired: false },
                    { pageNumber: 6, orderIndex: 20, questionText: 'Rate effectiveness of Toolkit Levels', questionType: 'rating_scale', isRequired: true, options: JSON.stringify({ min: 1, max: 5 }) },
                    { pageNumber: 6, orderIndex: 21, questionText: 'Reason for rating', questionType: 'long_text', isRequired: true },
                    { pageNumber: 6, orderIndex: 22, questionText: 'Additional comments', questionType: 'long_text', isRequired: false },
                    { pageNumber: 7, orderIndex: 23, questionText: 'Preferred PD formats', questionType: 'multi_select', isRequired: true, options: JSON.stringify(['In-person Training', 'Online Training Session', 'Self-paced Online Courses', 'Peer Collaboration Groups', 'One-on-one Coaching', 'Other']) },
                    { pageNumber: 7, orderIndex: 24, questionText: 'Preferred frequency', questionType: 'multiple_choice', isRequired: true, options: JSON.stringify(['Monthly', 'Quarterly', 'Annually', 'As needed']) },
                    { pageNumber: 7, orderIndex: 25, questionText: 'Topics for future PD', questionType: 'long_text', isRequired: true },
                    { pageNumber: 7, orderIndex: 26, questionText: 'Additional suggestions', questionType: 'long_text', isRequired: false },
                ]
            }
        }
    });

    // ── ASSESSMENTS (DYNAMIC SEEDING) ─────────────────────────────────────────
    const fsLib = require('fs');
    const pathLib = require('path');
    const templatesPath = pathLib.join(__dirname, 'data', 'assessment_templates.json');

    if (fsLib.existsSync(templatesPath)) {
        console.log('Found assessment_templates.json. Seeding dynamically...');
        const templates = JSON.parse(fsLib.readFileSync(templatesPath, 'utf8'));

        for (const template of templates) {
            const existing = await prisma.assessment.findFirst({ where: { title: template.title } });
            if (!existing) {
                await prisma.assessment.create({
                    data: {
                        title: template.title,
                        description: template.description || '',
                        type: template.type,
                        isTimed: template.isTimed,
                        timeLimitMinutes: template.timeLimitMinutes,
                        maxAttempts: template.maxAttempts,
                        createdById: adminId, // using adminId from earlier in seed.ts
                        questions: {
                            create: template.questions.map(q => ({
                                prompt: q.prompt,
                                type: q.type,
                                options: q.options,
                                correctAnswer: q.correctAnswer,
                                points: q.points
                            }))
                        }
                    }
                });
                console.log('Seeded Assessment Template:', template.title);
            } else {
                console.log('Assessment already exists:', template.title);
            }
        }
    } else {
        console.log('No assessment_templates.json found, skipping assessment seeds.');
    }

    // ── LAC (LEARNING ASSESSMENT & CURRICULUM) ───────────────────────────────
    console.log('\n--- Seeding LAC Module ---');
    
    // 1. Seed LAC Campuses
    const lacCampuses = [
        { name: 'CMR NPS', location: 'Bangalore' },
        { name: 'EJPN', location: 'Bangalore' },
        { name: 'EITPL', location: 'Bangalore' },
        { name: 'EBTM', location: 'Bangalore' },
        { name: 'EBYR', location: 'Bangalore' },
        { name: 'ENICE', location: 'Bangalore' },
        { name: 'ENAVA', location: 'Bangalore' },
        { name: 'PU BTM', location: 'Bangalore' },
        { name: 'PU BYR', location: 'Bangalore' },
        { name: 'PU HRBR', location: 'Bangalore' },
        { name: 'PU ITPL', location: 'Bangalore' },
        { name: 'PU NICE', location: 'Bangalore' },
        { name: 'Head Office', location: 'Bangalore' },
    ];

    const lacCampusMap: Record<string, string> = {};
    for (const c of lacCampuses) {
        const res = await prisma.lacCampus.upsert({
            where: { name: c.name },
            update: { location: c.location },
            create: c
        });
        lacCampusMap[c.name] = res.id;
    }
    console.log('Seeded LAC Campuses');

    // 2. Seed LAC Subjects
    const lacSubjects = [
        'Art', 'Computer Science', 'Drama', 'English', 'Global Perspectives',
        'Hindi', 'Kannada', 'Life Skills', 'Math', 'Music', 'PE', 'Science',
        'Social Science', 'Spanish', 'VA', 'Mathematics'
    ];

    const lacSubjectMap: Record<string, string> = {};
    for (const name of lacSubjects) {
        const res = await prisma.lacSubject.upsert({
            where: { name },
            update: {},
            create: { name }
        });
        lacSubjectMap[name] = res.id;
    }
    console.log('Seeded LAC Subjects');

    // 3. Seed LAC Tasks & Statuses (Dummy Data)
    const teachers = await prisma.user.findMany({ where: { role: 'TEACHER' } });
    if (teachers.length > 0) {
        const mathId = lacSubjectMap['Mathematics'] || lacSubjectMap['Math'];
        const scienceId = lacSubjectMap['Science'];

        const teachersByCampus: Record<string, any[]> = {};
        for (const t of teachers) {
            const cId = t.campusId || 'EBTM';
            if (!teachersByCampus[cId]) teachersByCampus[cId] = [];
            teachersByCampus[cId].push(t);
        }

        let taskCount = 0;
        let statusCount = 0;

        for (const [campusCode, campusTeachers] of Object.entries(teachersByCampus)) {
            const lacCampusId = lacCampusMap[campusCode];
            if (!lacCampusId) continue;

            const tasksData = [
                { subjectId: mathId, campusId: lacCampusId, unit: 'Algebra 1', task: 'Complete Chapter 1 Exercises', type: 'Formative', mode: 'Offline', week: 1, weekCheck: true },
                { subjectId: mathId, campusId: lacCampusId, unit: 'Algebra 1', task: 'Grade Mid-Term Papers', type: 'Summative', mode: 'Online', week: 2, weekCheck: false },
                { subjectId: scienceId, campusId: lacCampusId, unit: 'Physics Basics', task: 'Setup Lab Experiment 3', type: 'Practical', mode: 'Offline', week: 1, weekCheck: true },
                { subjectId: scienceId, campusId: lacCampusId, unit: 'Chemistry', task: 'Review Periodic Table Quiz', type: 'Formative', mode: 'Online', week: 3, weekCheck: true },
                { subjectId: scienceId, campusId: lacCampusId, unit: 'Biology', task: 'Submit Field Trip Proposal', type: 'Administrative', mode: 'Offline', week: 4, weekCheck: false },
            ];

            for (const data of tasksData) {
                if (!data.subjectId) continue;
                
                const task = await prisma.lacTask.create({ data });
                taskCount++;

                for (const teacher of campusTeachers) {
                    const statuses = ['Pending', 'In Progress', 'Complete'];
                    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                    await prisma.lacTaskStatus.create({
                        data: {
                            taskId: task.id,
                            campusId: lacCampusId,
                            teacherId: teacher.id,
                            status: randomStatus,
                            published: true,
                            scoreEntered: randomStatus === 'Complete',
                            evidence: false
                        }
                    });
                    statusCount++;
                }
            }
        }
        console.log(`Created ${taskCount} LAC tasks and ${statusCount} statuses across all campuses.`);
    }

    console.log('\n✅ Seed complete! All teachers now have equal data + Surveys, Meetings, Attendance, and LAC entries.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
