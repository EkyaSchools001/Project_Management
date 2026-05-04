import { Response } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';
import { AuthRequest } from '../middlewares/auth';
import { getIO } from '../../core/socket';
import { createNotification } from './notificationController';
import { getFormRouting } from '../utils/formWorkflowUtils';



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

        const submission = await (prisma.moocSubmission as any).create({
            data: {
                userId,
                courseName: courseName || 'Draft Course',
                track: req.body.track,
                campus: req.body.campus,
                platform: platform || 'Draft',
                otherPlatform,
                hours: hours ? parseFloat(hours) : 0,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : new Date(),
                hasCertificate: hasCertificate || 'no',
                certificateType,
                proofLink,
                certificateFile,
                certificateFileName,
                keyTakeaways,
                unansweredQuestions,
                enjoyedMost,
                effectivenessRating: effectivenessRating ? (Array.isArray(effectivenessRating) ? effectivenessRating[0] : parseInt(effectivenessRating)) : 5,
                additionalFeedback,
                teacherName: name,
                teacherEmail: email,
                status: req.body.status || 'PENDING'
            } as any,
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

        // Push websockets
        const io = getIO();
        io.to(userId).emit('mooc:created', submission);
        io.to(`user:${userId}`).emit('mooc:created', submission);
        if (submission.status !== 'DRAFT') {
            io.to('leaders').emit('mooc:created', submission);
        }

        // Notify leaders about new MOOC evidence
        const sub = submission as any;
        if (sub.status !== 'DRAFT' && sub.user?.campusId) {
            const leaders = await prisma.user.findMany({
                where: {
                    role: { in: ['LEADER', 'SCHOOL_LEADER', 'ADMIN'] },
                    campusId: sub.user.campusId
                },
                select: { id: true }
            });

            for (const leader of leaders) {
                await createNotification({
                    userId: leader.id,
                    title: 'New MOOC Evidence',
                    message: `${sub.user.fullName} has submitted evidence for "${sub.courseName}".`,
                    type: 'INFO',
                    link: '/leader/mooc'
                });
            }
        }

        // Determine routing and notify relevant parties
        const routing = await getFormRouting(
            'MOOC Evidence',
            req.user?.role || 'TEACHER',
            sub.user?.campusId || undefined,
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
        if (role === 'TEACHER') {
            submissions = await (prisma.moocSubmission as any).findMany({
                where: { userId },
                orderBy: { submittedAt: 'desc' }
            });
        } else if (role === 'LEADER' || role === 'SCHOOL_LEADER') {
            submissions = await (prisma.moocSubmission as any).findMany({
                where: { 
                    user: { campusId: req.user?.campusId },
                    status: { not: 'DRAFT' }
                },
                include: {
                    user: {
                        select: { fullName: true, email: true, campusId: true }
                    }
                },
                orderBy: { submittedAt: 'desc' }
            });
        } else {
            // Admins see everything (except drafts)
            submissions = await (prisma.moocSubmission as any).findMany({
                where: {
                    status: { not: 'DRAFT' }
                },
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
            message: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
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

        const submission = await (prisma.moocSubmission as any).update({
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
            'TEACHER', // The teacher is receiving the notification
            submission.user?.campusId || undefined,
            undefined
        );

        const sub2 = submission as any;
        // Persist notification for the teacher
        await createNotification({
            userId: sub2.userId,
            title: `MOOC Submission ${status}`,
            message: `Your evidence for "${sub2.courseName}" has been ${status.toLowerCase()}.`,
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

export const updateMoocDraft = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('Authentication required', 401);
        }
        
        // Ensure user owns this draft or is an admin
        const existing: any = await (prisma.moocSubmission as any).findUnique({ where: { id } });
        if (!existing || (existing.userId !== userId && req.user?.role === 'TEACHER')) {
            throw new AppError('Unauthorized or not found', 404);
        }

        const {
            courseName,
            track,
            campus,
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
            email,
            status
        } = req.body;

        const submission = await (prisma.moocSubmission as any).update({
            where: { id },
            data: {
                ...(courseName && { courseName }),
                ...(req.body.track && { track: req.body.track }),
                ...(req.body.campus && { campus: req.body.campus }),
                ...(platform && { platform }),
                ...(otherPlatform !== undefined && { otherPlatform }),
                ...(hours !== undefined && hours !== "" && { hours: parseFloat(hours) }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(hasCertificate && { hasCertificate }),
                ...(certificateType !== undefined && { certificateType }),
                ...(proofLink !== undefined && { proofLink }),
                ...(certificateFile !== undefined && { certificateFile }),
                ...(certificateFileName !== undefined && { certificateFileName }),
                ...(keyTakeaways !== undefined && { keyTakeaways }),
                ...(unansweredQuestions !== undefined && { unansweredQuestions }),
                ...(enjoyedMost !== undefined && { enjoyedMost }),
                ...(effectivenessRating && { effectivenessRating: Array.isArray(effectivenessRating) ? effectivenessRating[0] : parseInt(effectivenessRating) }),
                ...(additionalFeedback !== undefined && { additionalFeedback }),
                ...(name && { teacherName: name }),
                ...(email && { teacherEmail: email }),
                ...(status && { status })
            } as any
        });

        // Trigger websocket sync
        const io = getIO();
        io.to(userId).emit('mooc:updated', submission);
        io.to(`user:${userId}`).emit('mooc:updated', submission);
        if (submission.status !== 'DRAFT') {
            io.to('leaders').emit('mooc:updated', submission);
        }

        res.status(200).json({
            status: 'success',
            data: { submission }
        });
    } catch (error: any) {
        console.error('Error updating MOOC draft:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};
