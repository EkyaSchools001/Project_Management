import { Response } from 'express';
import { prisma } from '../../app';
import { UserRole } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../middlewares/auth';
import { getIO } from '../../socket';
import { createNotification } from './notificationController';
import { getFormRouting } from '../../utils/formWorkflowUtils';



export const submitMoocEvidence = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('Authentication required', 401);
        }

        const {
            courseName,
            platform,
            otherPlatform,
            hours,
            startDate,
            endDate,
            hasCertificate,
            certificateType,
            proofLink,
            certificateFile,
            certificateFileName,
            keyTakeaways,
            unansweredQuestions,
            enjoyedMost,
            effectivenessRating,
            additionalFeedback,
            name,
            email
        } = req.body;

        const submission = await prisma.moocSubmission.create({
            data: {
                userId,
                courseName,
                platform,
                otherPlatform,
                hours: parseFloat(hours),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                hasCertificate,
                certificateType,
                proofLink,
                certificateFile,
                certificateFileName,
                keyTakeaways,
                unansweredQuestions,
                enjoyedMost,
                effectivenessRating: Array.isArray(effectivenessRating) ? effectivenessRating[0] : effectivenessRating,
                additionalFeedback,
                teacherName: name,
                teacherEmail: email,
                status: req.body.status || 'PENDING'
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        campusId: true
                    }
                }
            }
        });

        // Emit to leaders
        const io = getIO();
        io.to('leaders').emit('mooc:created', submission);

        // Notify leaders about new MOOC evidence
        if (submission.status !== 'DRAFT' && submission.user?.campusId) {
            const leaders = await prisma.user.findMany({
                where: {
                    role: { in: [UserRole.LEADER, UserRole.SCHOOL_LEADER, UserRole.Admin] },
                    campusId: submission.user.campusId
                },
                select: { id: true }
            });

            for (const leader of leaders) {
                await createNotification({
                    userId: leader.id,
                    title: 'New MOOC Evidence',
                    message: `${submission.user.fullName} has submitted evidence for "${submission.courseName}".`,
                    type: 'INFO',
                    link: '/leader/mooc'
                });
            }
        }

        // Determine routing and notify relevant parties
        const routing = await getFormRouting(
            'MOOC Evidence',
            req.user?.role || 'TEACHER',
            submission.user?.campusId || undefined,
            undefined // Subject not applicable for MOOC evidence usually
        );

        // For now, we notify the target dashboard users via notification if needed
        // But the requirement specifically mentioned "the response will be visible in the [Dashboard]"
        // So we can at least log or use this routing info for later.

        res.status(201).json({
            status: 'success',
            data: { submission }
        });
    } catch (error: any) {
        console.error('Error submitting MOOC evidence:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

export const getAllMoocSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const role = req.user?.role;
        const userId = req.user?.id;

        let submissions;
        if (role === UserRole.TeacherStaff) {
            submissions = await prisma.moocSubmission.findMany({
                where: { userId },
                orderBy: { submittedAt: 'desc' }
            });
        } else if (role === UserRole.LEADER || role === UserRole.SCHOOL_LEADER) {
            submissions = await prisma.moocSubmission.findMany({
                where: { user: { campusId: req.user?.campusId } },
                include: {
                    user: {
                        select: { fullName: true, email: true, campusId: true }
                    }
                },
                orderBy: { submittedAt: 'desc' }
            });
        } else {
            // Admins see everything
            submissions = await prisma.moocSubmission.findMany({
                include: {
                    user: {
                        select: { fullName: true, email: true, campusId: true }
                    }
                },
                orderBy: { submittedAt: 'desc' }
            });
        }

        const mappedSubmissions = submissions.map((sub: any) => ({
            ...sub,
            name: sub.teacherName || sub.user?.fullName || 'Unknown',
            email: sub.teacherEmail || sub.user?.email || '',
            campus: sub.user?.campusId || 'Unknown',
            completionDate: sub.endDate || sub.submittedAt
        }));

        res.status(200).json({
            status: 'success',
            data: { submissions: mappedSubmissions }
        });
    } catch (error: any) {
        console.error('Error fetching MOOC submissions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const updateMoocStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { status } = req.body;

        if (!['PENDING', 'APPROVED', 'REJECTED', 'DRAFT'].includes(status)) {
            throw new AppError('Invalid status', 400);
        }

        const submission = await prisma.moocSubmission.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        campusId: true
                    }
                }
            }
        });

        // Emit to the specific teacher and all leaders
        const io = getIO();
        io.to(submission.userId).emit('mooc:updated', submission);
        io.to(`user:${submission.userId}`).emit('mooc:updated', submission); // Using new user:ID room convention
        io.to('leaders').emit('mooc:updated', submission);

        // Determine routing for the update notification (Teacher side)
        const routing = await getFormRouting(
            'MOOC Evidence',
            UserRole.TeacherStaff, // The teacher is receiving the notification
            submission.user?.campusId || undefined,
            undefined
        );

        // Persist notification for the teacher
        await createNotification({
            userId: submission.userId,
            title: `MOOC Submission ${status}`,
            message: `Your evidence for "${submission.courseName}" has been ${status.toLowerCase()}.`,
            type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
            link: routing ? `${routing.route}/mooc` : '/teacher/mooc'
        });

        res.status(200).json({
            status: 'success',
            data: { submission }
        });
    } catch (error: any) {
        console.error('Error updating MOOC status:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};
