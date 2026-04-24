import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SETTINGS = [
    {
        key: 'access_matrix_config',
        value: {
            accessMatrix: [
                // ── Core Management ──────────────────────────────────────────────────
                { moduleId: 'users', moduleName: 'User Management', roles: { SUPERADMIN: true, ADMIN: true, LEADER: false, MANAGEMENT: false, COORDINATOR: false, TEACHER: false, TESTER: false } },
                { moduleId: 'team', moduleName: 'Team Management', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: false, TEACHER: false, TESTER: false } },
                { moduleId: 'forms', moduleName: 'Forms & Workflows', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: false, TESTER: false } },
                { moduleId: 'settings', moduleName: 'System Settings', roles: { SUPERADMIN: true, ADMIN: true, LEADER: false, MANAGEMENT: false, COORDINATOR: false, TEACHER: false, TESTER: false } },
                { moduleId: 'courses', moduleName: 'MOOC & Courses', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'calendar', moduleName: 'Calendar & Training', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'documents', moduleName: 'Documents', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'reports', moduleName: 'Reports & Stats', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: false, TESTER: false } },
                { moduleId: 'attendance', moduleName: 'Attendance', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

                // ── Observation & Growth ─────────────────────────────────────────────
                { moduleId: 'observations', moduleName: 'Observations', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'goals', moduleName: 'Goals', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'hours', moduleName: 'PD Hours', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'insights', moduleName: 'Insights', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: false, TESTER: false } },
                { moduleId: 'meetings', moduleName: 'Meetings', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'announcements', moduleName: 'Announcements', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'survey', moduleName: 'Surveys', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'festival', moduleName: 'Learning Festival', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'okr', moduleName: 'OKR', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'portfolio', moduleName: 'Portfolio', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'growth-analytics', moduleName: 'Growth Analytics', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: false, TESTER: false } },

                // ── Specialized Frameworks ───────────────────────────────────────────
                { moduleId: 'assessments', moduleName: 'Assessments', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'danielson', moduleName: 'Danielson Framework', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'quick-feedback', moduleName: 'Quick Feedback', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'performing-arts', moduleName: 'Performing Arts', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'life-skills', moduleName: 'Life Skills', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'pe-obs', moduleName: 'PE Observation', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'va-obs', moduleName: 'VA Observation', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

                // ── Educator Hub ──────────────────────────────────────────────────────────
                { moduleId: 'edu-hub', moduleName: 'Home (Edu Hub)', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'who-we-are', moduleName: 'Who we are', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'my-campus', moduleName: 'My campus', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'teaching', moduleName: 'Teaching', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'my-classroom', moduleName: 'My classroom', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'interactions', moduleName: 'Interactions', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'tickets', moduleName: 'Tickets', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'grow', moduleName: 'Grow', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

                // ── HR & WellBeing ────────────────────────────────────────────────────────
                { moduleId: 'resources', moduleName: 'Resources', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'educator-essentials', moduleName: 'Educator Essentials', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'educator-guide', moduleName: 'Educator Guide', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'wellbeing', moduleName: 'WellBeing', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },

                // ── Technology ────────────────────────────────────────────────────────────
                { moduleId: 'tech-sites-login', moduleName: 'Educator Site', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'greythr', moduleName: 'GreytHR', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'schoology', moduleName: 'Schoology', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'google-workspace', moduleName: 'Google Workspace', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'zoom', moduleName: 'Zoom', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'slack', moduleName: 'Slack', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'email-signature', moduleName: 'Email Signature Templates', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'ekyaverse', moduleName: 'Ekyaverse-Neverskip', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'audit-reports', moduleName: 'Audit & Reports', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                
                // ── New Modules ──────────────────────────────────────────────────────
                { moduleId: 'lac', moduleName: 'LAC (Checklist)', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
                { moduleId: 'culture-environment', moduleName: 'Culture & Environment', roles: { SUPERADMIN: true, ADMIN: true, LEADER: true, MANAGEMENT: true, COORDINATOR: true, TEACHER: true, TESTER: true } },
            ]
        }
    },
    {
        key: 'page_tech_slack',
        value: {
            heroTitle: "SLACK",
            introQuote: "Slack is a centralized Internal Communication tool that connects teams, facilitates sharing of content, wishing teams on special occasions, milestones, celebrations & events. This platform increases visibility on events across teams hence building an open-door culture.",
            guideSectionTitle: "QUICK START GUIDE TO SLACK",
            guideLinkTitle: "How to use Slack: your quick start guide",
            guideLinkUrl: "https://slack.com/intl/en-gb/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide"
        }
    },
    {
        key: 'page_tech_schoology',
        value: {
            heroTitle: "SCHOOLOGY",
            heroImage: "/assets/technology/schoology_banner.png",
            introTitle: "INTRODUCTION",
            introContent1: "Schoology is a social networking service virtual learning environment for K-12 school and higher education institutions.",
            introContent2: "Also known as a learning management system (LMS), the cloud-based platform provides tools needed to manage an online classroom.",
            tutorialTitle: "TUTORIAL ON HOW TO LOGIN",
            tutorialInstruction: "Please click on the links below to see how to login to Schoology",
            onboardingTitle: "SCHOOLOGY ONBOARDING COURSE FOR ALL TEACHERS",
            onboardingDesc: "It is essential for everyone to join the Schoology onboarding course.",
            onboardingLinkTitle: "How to join a course with access code",
            onboardingLinkUrl: "#",
            accessCode: "HZ9R-C83S-GCB2T",
            loginLinksText: "Desktop/Browser | https://app.schoology.com\nMobile/tablet app (Android/iOS) | #"
        }
    },
    {
        key: 'page_tech_zoom',
        value: {
            heroTitle: "ZOOM",
            heroImage: "",
            introContent: "The platform that we will be using at Ekya and CMR K-12 for virtual school is Zoom.",
            tutorialsTitle: "TUTORIALS",
            settingsTitle: "ZOOM SETTINGS",
            engagementTitle: "TOOLS FOR CALL ENGAGEMENT",
            engagementInstruction: "Some tools you may want to consider using to engage students when on a Zoom call include:",
            onlineLearningUrl: "#",
            tutorialsText: "How to join a meeting | #\nSharing Your Screen | #\nHost Controls in a Meeting | #",
            toolsText: "Mentimeter | ask poll questions | #\nNearpod | gamify a quiz | #",
            setUpPointsText: "Require a meeting password\nEnable your waiting room",
            duringPointsText: "Do not allow participants to rename themselves",
            afterPointsText: "When you leave the session, do make sure that you end the call for everyone"
        }
    },
    {
        key: 'page_culture_environment',
        value: {
            heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
            pillarTitle: "Pillar of Practice",
            mainTitle: "CULTURE &",
            italicTitle: "ENVIRONMENT",
            cultureIntro1: "At Ekya, we have high expectations for our students and believe creating a positive environment is essential for their success.",
            cultureIntro2: "We encourage self-managing behavior and believe that our students can positively impact the world around them.",
            envIntro: "What is the physical environment we create for children? How do we create and organize spaces?"
        }
    },
    {
        key: 'hr_wellbeing',
        value: {
            headerTitle: "WELLBEING",
            headerSubtitle: "Student Development Department",
            introPillar: "Health and Wellbeing",
            introText: "The Wellbeing vertical is therefore a critical focus area for all campuses.",
            visionTitle: "VISION",
            visionText: "Every student will feel seen, heard, valued, supported and encouraged.",
            missionTitle: "MISSION",
            missionText: "To build a team that will be instrumental in empowering students.",
            pillarsTitle: "THE PILLARS",
            pillar1Title: "AWARENESS",
            pillar1Desc: "Build a purposeful, motivated and continuously learning community.",
            pillar1Students: "Awareness programs\nClassroom introductions",
            pillar1Teachers: "Teacher awareness sessions",
            pillar1Parents: "Awareness sessions",
            pillar2Title: "COMPASSION",
            pillar2Desc: "Cultivate skills of self-care, empathy and common humanity.",
            pillar2Students: "Monthly Schoology posts",
            pillar2Parents: "Parent teacher interaction",
            pillar3Title: "ENGAGEMENT",
            pillar3Desc: "Build self-regulation, self-awareness and a sense of belonging.",
            pillar3Students: "Counselling",
            pillar3Parents: "Weekly open line"
        }
    },
    {
        key: 'hr_educator_essentials',
        value: {
            headerBadge: "Human Resource",
            headerTitle: "Educator Essentials",
            headerSubtitle: "Your centralized access to job descriptions, institutional policies, and income tax guidelines.",
            rolePurposeTitle: "Role Purpose",
            rolePurposeContent: "As an Ekya Educator, your primary purpose is to facilitate meaningful learning experiences.",
            roleReportLine1: "Reports to Coordinator / School Leader",
            roleReportLine2: "Full-time Professional Role",
            jd1Title: "Curriculum & Planning",
            jd1Points: "Design and implement engaging lesson plans.\nAdapt curriculum materials.\nCollaborate with peers.",
            jd2Title: "Instruction & Delivery",
            jd2Points: "Utilize research-based instructional strategies.\nIncorporate technology.\nMaintain an active classroom environment.",
            jd3Title: "Assessment & Feedback",
            jd3Points: "Design authentic assessments.\nProvide timely feedback.\nMaintain accurate records.",
            jd4Title: "Culture & Environment",
            jd4Points: "Cultivate a safe classroom culture.\nEstablish clear routines.\nBuild strong relationships.",
            jd5Title: "Professional Practice",
            jd5Points: "Participate in professional development.\nEngage in reflective practice.\nAdhere to school policies.",
            taxDocsText: "IT Declaration Guidelines | # | Learn how to declare your income tax.\nIT Proof Submission Guidelines | # | Guide to submitting IT proofs.",
            policiesText: "Teaching Staff HR Policies | # | General\nAll Staff Dress Code Policy | # | Guidelines"
        }
    },
    {
        key: 'page_tech_sites_login',
        value: {
            title: "Educator ",
            titleAccent: "Site",
            subtitle: "Access all your essential school platforms and external tools from one unified secure gateway.",
            bannerUrl: "/assets/tech-sites/banner.png",
            sitesText: "Ekya/CMR Email | https://mail.google.com | Access your official Google Workspace email and collaboration tools.\ngreytHR | https://ekyacmr.greythr.com/uas/portal/auth/login | Payroll, leave management, and employee self-service portal.\nEkyaverse - Neverskip | https://app.neverskip.com/appnew/login.php | Core school management system for attendance, grades, and records.\nSchoology | https://app.schoology.com | Learning Management System for course content and student engagement.\nPowerSchool | https://powerschool.com | Curriculum & Instruction platform for academic planning and tracking."
        }
    },
    {
        key: 'page_tech_greythr',
        value: {
            heroTitle: "GREYTHR",
            heroImage: "/assets/technology/greythr_banner.png",
            description: "GreytHR is a 24x7 Employee Self Service portal.",
            points: "Effective management of attendance, leaves & payroll.\nSeamless payroll process.\nFAQ document prepared to address the commonly captured queries or issues.",
            tutorialTitle: "TUTORIAL",
            knowledgeBankLabel: "Knowledge Bank",
            knowledgeBankUrl: "https://ekyacmr.greythr.com/uas/portal/auth/login"
        }
    },
    {
        key: 'page_tech_email_signature',
        value: {
            heroTitle: "EMAIL SIGNATURE",
            heroAccent: "TEMPLATE",
            instructionTitle: "How to setup your Email Signature?",
            setupSteps: "Open Gmail.\nAt the top right, click Settings and then See all settings.\nScroll down the General menu.\nIn the \"Signature\" section, click on +Create New and add your signature text in the box.\nSelect the new signature in the drop-down menus provided in the Signature defaults section.\nAt the bottom of the page, click Save Changes.",
            brandAssetsTitle: "Official Brand ",
            brandAssetsAccent: "Logos",
            brandAssetsDescription: "Download the official, high-resolution brand assets for your email signature.",
            cmrLogoLabel: "CMR NPS Logo",
            cmrLogoUrl: "https://drive.google.com/file/d/1iFzxxUX1SH2R72ovwQIof8xSePGYdW_U/view",
            ekyaLogoLabel: "Ekya Schools Logo",
            ekyaLogoUrl: "https://drive.google.com/file/d/1dbhuhFAMp6DaIhDk9CNUWGtp2BD7f9Jp/view"
        }
    },
    {
        key: 'page_tech_ekyaverse',
        value: {
            heroTitle: "EKYAVERSE - ",
            heroTitleAccent: "NEVERSKIP",
            heroBgImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
            tutorialHeader: "TUTORIAL",
            iframeUrl: "https://drive.google.com/file/d/1vsOWv7vaL0CxcEO4cM3QZWDxiTz2qO3h/preview",
            videoTutorialTitle: "Video Tutorial",
            videoTutorialDesc: "Watch the full step-by-step video guide for Neverskip ERP.",
            videoTutorialUrl: "#"
        }
    }
];

async function main() {
    console.log('🌱 Seeding PDI System Settings...');

    for (const setting of SETTINGS) {
        await prisma.pDISystemSettings.upsert({
            where: { key: setting.key },
            update: {
                value: JSON.stringify(setting.value)
            },
            create: {
                key: setting.key,
                value: JSON.stringify(setting.value)
            }
        });
        console.log(`✅ Seeded setting: ${setting.key}`);
    }

    console.log('✨ PDI Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
