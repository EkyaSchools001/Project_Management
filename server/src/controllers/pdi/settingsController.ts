import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { getIO } from '../../socket';
import { invalidateAccessMatrixCache } from '../../middlewares/accessControl';



// Get all settings
export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settings = await prisma.pDISystemSettings.findMany({
            orderBy: { updatedAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: settings.length,
            data: { settings }
        });
    } catch (err) {
        next(err);
    }
};

// Get a setting by key
export const getSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;

        const setting = await prisma.pDISystemSettings.findUnique({
            where: { key }
        });

        if (!setting) {
            // Provide a default access_matrix_config if not yet initialized
            if (key === 'access_matrix_config') {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        setting: {
                            key: 'access_matrix_config',
                            value: JSON.stringify({ accessMatrix: [], formFlows: [] })
                        }
                    }
                });
            }

            // Provide a default hr_resources_hub if not yet initialized
            if (key === 'hr_resources_hub') {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        setting: {
                            key: 'hr_resources_hub',
                            value: JSON.stringify({
                                headerTitle: "Human Resource – Resources Hub",
                                headerSubtitle: "A centralized space for educators to access HR guidance, policies, and communication channels.",
                                aceTitle: "Becoming an ACE Educator",
                                aceContent: "Becoming an ACE Educator – Aware, Compassionate, and Engaged educator is not just a professional journey; it is a transformative process that shapes not only the lives of students but also the educators themselves.\n\nAt Ekya, we recognize the profound impact that educators have on the learning experience and overall well-being of our students.\n\nThat’s why we are committed to supporting our educators in their journey toward becoming ACE Educators.",
                                navTitle: "Navigating the HR Page",
                                navContent: "The HR page is designed to be a comprehensive resource hub for educators, covering various aspects of your professional life, from practical guidance in the classroom to understanding company policies and addressing common queries.",
                                navItem1Title: "Educator Guide",
                                navItem1Desc: "Provides essential resources like the Teacher Companion Handbook, practical procedures, and expectations for educators.",
                                navItem2Title: "Educator Essentials",
                                navItem2Desc: "Contains policies related to professional conduct, administrative procedures, leave policies, and operational guidelines.",
                                navItem3Title: "FAQ (Frequently Asked Questions)",
                                navItem3Desc: "Answers common questions educators may have regarding HR procedures and policies.",
                                slackTitle: "Slack Communication",
                                slackContent: "Effective communication between team members is essential for smooth school operations and collaboration across all departments.\n\nTherefore, we encourage each of you to continue leveraging Slack for official correspondence, announcements, updates, and discussions related to work matters.",
                                supportTitle: "We're here to support you",
                                supportSubtitle: "If you have any questions related to HR activities, feel free to reach out to the HR team through the following channels:",
                                supportEmailTitle: "Email Us",
                                supportEmail: "hr@ekyaschools.com",
                                supportTicketTitle: "Ticketing System",
                                supportTicketDesc: "Raise a request through the platform Support Ticketing System.",
                                navItem1Url: "/hr/educator-guide",
                                navItem2Url: "/hr/educator-essentials",
                                navItem3Url: "#",
                                slackGuideUrl: "#"
                            })
                        }
                    }
                });
            }

            // Provide a default hr_educator_essentials if not yet initialized
            if (key === 'hr_educator_essentials') {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        setting: {
                            key: 'hr_educator_essentials',
                            value: JSON.stringify({
                                headerBadge: "Human Resource",
                                headerTitle: "Educator Essentials",
                                headerSubtitle: "Your centralized access to job descriptions, institutional policies, and income tax guidelines.",
                                rolePurposeTitle: "Role Purpose",
                                rolePurposeContent: "As an Ekya Educator, your primary purpose is to facilitate meaningful learning experiences that align with the institution's curriculum and vision. You are a catalyst for student growth, encouraging critical thinking, empathy, and excellence.",
                                roleReportLine1: "Reports to Coordinator / School Leader",
                                roleReportLine2: "Full-time Professional Role",
                                jd1Title: "Curriculum & Planning",
                                jd1Points: "Design and implement engaging lesson plans in alignment with Ekya's pedagogical approach.\nAdapt curriculum materials to accommodate diverse learning styles and abilities.\nCollaborate with peers horizontally and vertically to ensure curriculum continuity.",
                                jd2Title: "Instruction & Delivery",
                                jd2Points: "Utilize research-based instructional strategies to foster student engagement.\nIncorporate technology and real-world applications into daily teaching.\nMaintain an active, student-centric classroom environment.",
                                jd3Title: "Assessment & Feedback",
                                jd3Points: "Design authentic formative and summative assessments to measure student understanding.\nProvide timely, constructive, and actionable feedback to students and parents.\nMaintain accurate records of student progress using institutional platforms.",
                                jd4Title: "Culture & Environment",
                                jd4Points: "Cultivate a safe, inclusive, and respectful classroom culture.\nEstablish clear routines and behavioural expectations.\nBuild strong, positive relationships with students, parents, and colleagues.",
                                jd5Title: "Professional Practice",
                                jd5Points: "Actively participate in professional development and continuous learning.\nEngage in reflective practice and peer observations.\nAdhere to all school policies and uphold the professional code of conduct.",
                                taxDocsText: "IT Declaration Guidelines 2025-26 | https://drive.google.com/file/d/1RDCY2_Eu_I0Yv_Si8-mw6xVhJnOhMQdQ/view | Learn how to accurately declare your income tax for the upcoming financial year to optimize your savings.\nIT Proof Submission Guidelines 2025-26 | https://drive.google.com/file/d/1z9atkjodYe_1nwDXq9B6dgQvyxYqeN2B/view | Step-by-step comprehensive guide to submitting your valid IT proofs to avoid unexpected salary deductions.",
                                policiesText: "Teaching Staff HR Policies 2025-26 | https://docs.google.com/document/d/1IOzSegINcgGGHPKq2x5GtFIhAlwr5MHm5qmP_kPusWo/edit?tab=t.0#heading=h.g2nxrjvq2tat | General\nAssistant Teaching Staff HR Policies 2025-26 | | General\nBehavioural Counselling HR Policies 2025-26 | | Specialist\nPhysical Education Educators HR Policies | | Specialist\nDesign and Technology Educators HR Policies | | Specialist\nVisual Arts Educators HR Policies | | Specialist\nPerforming Arts Educators HR Policies | | Specialist\nCCE - HR Policies 2025-26 | | General\nAll Staff Dress Code Policy | | Guidelines\nStaff Fee Concession Policy AY 2025-26 | | Benefits"
                            })
                        }
                    }
                });
            }

            // Provide a default hr_educator_guide if not yet initialized
            if (key === 'hr_educator_guide') {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        setting: {
                            key: 'hr_educator_guide',
                            value: JSON.stringify({
                                headerPrefix: "Educator Resources",
                                headerTitle: "EDUCATOR GUIDE",
                                headerSubtitle: "A Comprehensive Guide to Shaping Lifelong Learners",
                                headerDesc1: "Welcome to the Ekya Educator Guide. Your role here extends far beyond teaching a subject; it’s about touching lives, nurturing minds, and guiding students to become confident, contributing members of society.",
                                headerDesc2: "This guide provides the framework and philosophy essential to our shared success. It outlines practical procedures, fundamental expectations, and essential resources to help you thrive in your journey with us.",
                                handbookTitle: "TEACHER COMPANION HANDBOOK",
                                handbookDesc1: "This New Teacher’s Companion is a valuable resource for any teacher who wants the classroom to be a rich and rewarding place for both teachers and students alike.",
                                handbookDesc2: "It outlines essential policies, procedures, and expectations for educators. It serves as a quick reference for teachers while providing practical guidance for navigating their roles within the educational institution.",
                                handbookBtnText: "Teacher Companion Handbook (AY 24-25)",
                                handbookUrl: "https://drive.google.com/file/d/1t6fj33QDXDulm90U-uG0b81bkhorDHDW/view",
                                dutyTitle: "DUTY OF CARE",
                                dutySubtitle: "Navigating the Classroom with Confidence and Professionalism",
                                dutyQuote: '"Research confirms that the teacher makes the greatest difference in the learning success of students."',
                                dutyDesc: "Teaching is a physically and emotionally demanding career but also incredibly rewarding. Teachers must demonstrate professionalism, patience, responsibility, and compassion in every interaction within the classroom.",
                                profTitle: "PROFESSIONALISM",
                                profPoints: "Always do what you believe to be best for your students.\nFoster a comfortable and friendly cooperative relationship between teachers, parents, administrators, and students.\nRespect decisions of your Head of School and understand responsibilities.\nMaintain professionalism and a positive attitude at all times.\nBe mindful of tone when addressing students and colleagues.\nWork cooperatively with colleagues and share best practices.\nEnsure lessons are well prepared and engaging.\nCommunicate clearly with parents and colleagues.\nRespect confidentiality and professional boundaries.",
                                prepTitle: "BE PREPARED",
                                prepPoints: "Be sure to practice with technology before the start of school.\nUnderstand the platforms used daily such as email and learning systems.\nPlan lessons in advance and ensure materials are prepared.\nPrepare classroom resources and student learning materials beforehand.\nHave backup activities ready for classroom sessions.\nEnsure the classroom environment is ready before students arrive.",
                                orgTitle: "BE ORGANIZED",
                                orgPoints: "Prepare lesson plans and teaching materials daily.\nKeep lesson resources structured and easy to access.\nMaintain attendance records and assignment tracking.\nOrganize student work, papers, and grading systems.\nMaintain classroom order and learning materials.\nEnsure administrative documentation is properly handled.",
                                patTitle: "BE PATIENT",
                                patPoints: "Give students enough time to think and respond.\nUnderstand that learning happens at different paces.\nEncourage students who struggle and support them positively.\nMaintain calm and patience when handling difficult situations.\nProvide constructive feedback instead of criticism.",
                                realTitle: "Be a Real Person",
                                realSubtitle: "AND HONOR EACH STUDENT AS A REAL PERSON",
                                realPoints: "Treat students with respect at all times.\nNever embarrass a student or make them feel ashamed.\nEncourage leadership and confidence among students.\nRecognize achievements and support improvement.\nBuild positive relationships with students.\nAllow students to feel safe expressing themselves.\nBe authentic and approachable as a teacher.",
                                discTitle: "BE SENSIBLE WITH DISCIPLINE",
                                discPoints: "Establish clear classroom rules and expectations.\nMaintain fairness and consistency in discipline.\nEncourage respectful behavior and accountability.\nAddress disruptive behavior calmly and professionally.\nSupport students in learning from mistakes.\nMaintain positive classroom management strategies.",
                                selfCareTitle: "BE AWARE OF YOUR OWN NEEDS",
                                selfCareDesc: "Teaching is a demanding profession that requires emotional resilience and self-awareness. Taking care of yourself is not selfish—it's necessary for being the best educator for your students.",
                                selfCarePoints: "Take time outside of school to decompress.\nPrioritize work-life balance.\nExercise and maintain healthy routines.\nSeek support from colleagues and mentors.\nReflect regularly on your teaching practices.\nFocus on progress rather than perfection.",
                                headerImgUrl: "/images/hr/educator_guide_banner.png",
                                dutyImgUrl: "/images/hr/duty_of_care.png",
                                selfCareImgUrl: "/images/hr/self_care.png"
                            })
                        }
                    }
                });
            }

            // Provide a default hr_wellbeing if not yet initialized
            if (key === 'hr_wellbeing') {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        setting: {
                            key: 'hr_wellbeing',
                            value: JSON.stringify({
                                headerTitle: "WELLBEING",
                                headerSubtitle: "Student Development Department",
                                introPillar: "Health and Wellbeing",
                                introText: "The Wellbeing vertical is therefore a critical focus area for all campuses. We invite all educators and specialist staff members to explore this page and understand the priorities of wellbeing.",
                                visionTitle: "VISION",
                                visionText: "Every student will feel seen, heard, valued, supported and encouraged to achieve their full potential and flourish in their student life.",
                                missionTitle: "MISSION",
                                missionText: "To build a team that will be instrumental in empowering students to engage as committed and responsible global citizens with shared values awareness, compassion and engagement.",
                                pillarsTitle: "THE PILLARS",
                                pillar1Title: "AWARENESS",
                                pillar1Desc: "Build a purposeful, motivated and continuously learning community.",
                                pillar1Students: "Awareness programs\nClassroom introductions\nLifeSkills sessions",
                                pillar1Teachers: "Teacher awareness sessions\nCampus specific workshops",
                                pillar1Parents: "Awareness sessions",
                                pillar2Title: "COMPASSION",
                                pillar2Desc: "Cultivate skills of self-care, empathy and common humanity.",
                                pillar2Students: "Monthly Schoology posts\nTeacher / HOS check-ins",
                                pillar2Parents: "Parent teacher interaction\nMonthly newsletter bulletin\nLifeSkills learning showcase",
                                pillar3Title: "ENGAGEMENT",
                                pillar3Desc: "Build self-regulation, self-awareness and a sense of belonging.",
                                pillar3Students: "Counselling\nRemediation\nCampus specific student workshops",
                                pillar3Parents: "Weekly open line"
                            })
                        }
                    }
                });
            }

            return next(new AppError('Setting not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { setting }
        });
    } catch (err) {
        next(err);
    }
};

// Upsert a setting (create or update)
export const upsertSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, value } = req.body;

        console.log(`[SETTINGS] Upserting key: ${key}`);

        const previousSetting = await prisma.pDISystemSettings.findUnique({ where: { key } });

        const setting = await prisma.pDISystemSettings.upsert({
            where: { key },
            update: {
                value: JSON.stringify(value)
            },
            create: {
                key,
                value: JSON.stringify(value)
            }
        });

        // Write to Action Audit Log
        if ((req as any).user) {
            await prisma.pDIAuditLog.create({
                data: {
                    actorId: (req as any).user.id || 'system',
                    actorName: (req as any).user.fullName || (req as any).user.role || 'SuperAdmin',
                    action: previousSetting ? 'UPDATED_SETTING' : 'CREATED_SETTING',
                    targetEntity: 'SystemSettings',
                    previousData: previousSetting ? previousSetting.value : null,
                    newData: setting.value,
                }
            });
            console.log(`[AUDIT] Action logged: ${key} by ${(req as any).user.id}`);
        }

        // Broadcast the update via Socket.io
        try {
            const io = getIO();
            const broadcastData = { key, value };
            console.log(`[SOCKET] Broadcasting SETTINGS_UPDATED:`, broadcastData);
            io.emit('SETTINGS_UPDATED', broadcastData);
            console.log(`[SOCKET] Broadcast complete to all clients`);
        } catch (socketErr) {
            console.error('[SOCKET] Failed to broadcast setting update:', socketErr);
        }

        // Immediately invalidate backend access matrix cache so API routes
        // use the new permissions on the very next request
        if (key === 'access_matrix_config') {
            invalidateAccessMatrixCache();
        }

        res.status(200).json({
            status: 'success',
            data: { setting }
        });
    } catch (err) {
        next(err);
    }
};

// Delete a setting
export const deleteSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;

        await prisma.pDISystemSettings.delete({
            where: { key }
        });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

// Download Full Database Backup
export const downloadBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const models = [
            'user', 'meeting', 'meetingAttendee', 'meetingMinutes', 'meetingActionItem',
            'meetingReply', 'meetingShare', 'observation', 'observationDomain', 'goal',
            'goalWindow', 'trainingEvent', 'registration', 'eventAttendance', 'trainingFeedback',
            'pDHour', 'moocSubmission', 'document', 'documentAcknowledgement', 'course',
            'courseEnrollment', 'systemSettings', 'dashboardLayout', 'formTemplate', 'notification',
            'announcement', 'announcementAcknowledgement', 'survey', 'surveyQuestion', 'surveyResponse',
            'surveyAnswer', 'postOrientationAssessment', 'learningFestival', 'learningFestivalApplication',
            'assessment', 'assessmentQuestion', 'assessmentAssignment', 'assessmentAttempt',
            'growthObservation', 'formWorkflow', 'auditLog', 'dashboard', 'dashboardWidget', 'widgetType'
        ];

        const backupData: Record<string, any[]> = {};

        for (const model of models) {
            // @ts-ignore
            if (prisma[model]) {
                // @ts-ignore
                backupData[model] = await prisma[model].findMany();
            }
        }

        res.status(200).json({
            status: 'success',
            data: backupData
        });
    } catch (err) {
        next(err);
    }
};

// Restore Database from JSON Backup
export const restoreFromBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const backupData = req.body;
        console.log('[RESTORE] Starting manual database restore...');

        const models = [
            'user', 'meeting', 'meetingAttendee', 'meetingMinutes', 'meetingActionItem',
            'meetingReply', 'meetingShare', 'observation', 'observationDomain', 'goal',
            'goalWindow', 'trainingEvent', 'registration', 'eventAttendance', 'trainingFeedback',
            'pDHour', 'moocSubmission', 'document', 'documentAcknowledgement', 'course',
            'courseEnrollment', 'systemSettings', 'dashboardLayout', 'formTemplate', 'notification',
            'announcement', 'announcementAcknowledgement', 'survey', 'surveyQuestion', 'surveyResponse',
            'surveyAnswer', 'postOrientationAssessment', 'learningFestival', 'learningFestivalApplication',
            'assessment', 'assessmentQuestion', 'assessmentAssignment', 'assessmentAttempt',
            'growthObservation', 'formWorkflow', 'auditLog', 'dashboard', 'dashboardWidget', 'widgetType'
        ];

        // We use a transaction to ensure atomic restore if possible, 
        // but since we are doing sequential upserts, we'll just iterate.
        for (const model of models) {
            const data = backupData[model];
            if (data && Array.isArray(data) && data.length > 0) {
                console.log(`[RESTORE] Restoring ${data.length} records for model: ${model}`);
                for (const item of data) {
                    // @ts-ignore
                    await prisma[model].upsert({
                        where: { id: item.id },
                        update: item,
                        create: item
                    });
                }
            }
        }

        console.log('[RESTORE] ✅ Restore successful');

        res.status(200).json({
            status: 'success',
            message: 'Database restored successfully'
        });
    } catch (err) {
        console.error('[RESTORE] ❌ Restore failed:', err);
        next(err);
    }
};
