import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { createNotification } from './notificationController';
import { getIO } from '../../socket';

const RATING_MAP: Record<string, number> = {
    'Highly Effective': 4,
    'Effective': 3,
    'Developing': 2,
    'Basic': 1,
    'Needs Improvement': 1,
    'Not Observed': 0
};

export const createGrowthObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const {
            teacherId,
            academicYear,
            moduleType,
            subject,
            block,
            grade,
            section,
            observationDate,
            overallRating,
            status,
            formPayload,
            // New fields from specialist forms
            feedback,
            notes,
            actionStep,
            teacherReflection,
            discussedWithTeacher,
            strengths,
            areasOfGrowth,
            metaTags,
            cultureTools,
            routinesObserved,
            instructionalTools,
            tools,
            routines
        } = req.body;

        if (!teacherId || !academicYear || !moduleType) {
            return next(new AppError('teacherId, academicYear, and moduleType are required', 400));
        }

        const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
        if (!teacher) {
            return next(new AppError('Teacher not found', 404));
        }

        const stringify = (val: any) => typeof val === 'object' ? JSON.stringify(val) : val;

        const observation = await prisma.growthObservation.create({
            data: {
                teacherId,
                observerId: authReq.user!.id,
                campusId: teacher.campusId,
                academicYear,
                moduleType,
                subject: (subject || formPayload?.learningArea || formPayload?.subject || ''),
                block: (block || formPayload?.block || ''),
                grade: (grade || formPayload?.grade || ''),
                section: (section || formPayload?.section || ''),
                observationDate: observationDate ? new Date(observationDate) : new Date(),
                overallRating: typeof overallRating === 'string' ? (RATING_MAP[overallRating] || 0) : (Number(overallRating || formPayload?.score) || 0),
                status: (status || 'SUBMITTED') as any,
                formPayload: stringify(formPayload || req.body) as string,
                // Map specialist fields correctly
                notes: (notes || feedback || formPayload?.notes || '') as string,
                actionStep: (actionStep || formPayload?.actionStep || '') as string,
                teacherReflection: (teacherReflection || formPayload?.teacherReflection || '') as string,
                discussionMet: discussedWithTeacher === true || discussedWithTeacher === 'Yes' || formPayload?.discussedWithTeacher === true,
                strengths: (strengths || formPayload?.strengths || '') as string,
                areasOfGrowth: (areasOfGrowth || formPayload?.areasOfGrowth || '') as string,
                metaTags: (stringify(metaTags || formPayload?.metaTags || []) as string),
                tools: (stringify(tools || cultureTools || instructionalTools || formPayload?.tools || formPayload?.cultureTools || formPayload?.instructionalTools || []) as string),
                routines: (stringify(routines || routinesObserved || formPayload?.routines || formPayload?.routinesObserved || []) as string),
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        campusId: true
                    }
                },
                observer: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true
                    }
                }
            }
        });

        // Real-time update
        getIO().emit('growth-observation:created', observation);

        // Notify teacher
        await createNotification({
            userId: teacherId,
            title: 'New Observation',
            message: `A new ${moduleType.replace('_', ' ')} observation has been submitted by ${authReq.user?.fullName}.`,
            type: 'SUCCESS',
            link: '/teacher/observations'
        });

        res.status(201).json({
            status: 'success',
            data: { observation }
        });
    } catch (err) {
        next(err);
    }
};

export const getGrowthObservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { teacherId, campusId, moduleType, academicYear, status, includeLegacy } = req.query;

        let filter: any = {};

        // Security / RBAC
        if (authReq.user?.role === 'TEACHER') {
            filter.teacherId = authReq.user.id;
        } else if (teacherId) {
            filter.teacherId = String(teacherId);
        }

        if (campusId) filter.campusId = String(campusId);
        if (moduleType) filter.moduleType = moduleType as any;
        if (academicYear) filter.academicYear = String(academicYear);
        if (status) filter.status = status as any;

        const observations = await prisma.growthObservation.findMany({
            where: filter,
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                observer: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true
                    }
                }
            },
            orderBy: {
                observationDate: 'desc'
            }
        });

        const mappedObservations = observations.map(obs => ({
            ...obs,
            formPayload: (() => {
                try {
                    return typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload || '{}') : obs.formPayload;
                } catch (e) {
                    return obs.formPayload;
                }
            })()
        }));

        // Fetch Legacy Observations if requested or if no moduleType filter (to show in general dashboard)
        let legacyMapped: any[] = [];
        if (!moduleType || moduleType === 'QUICK_FEEDBACK' || includeLegacy === 'true') {
            const legacyFilter: any = {};
            if (authReq.user?.role === 'TEACHER') {
                legacyFilter.teacherId = authReq.user.id;
            } else if (teacherId) {
                legacyFilter.teacherId = String(teacherId);
            }

            const legacyObs = await prisma.observation.findMany({
                where: legacyFilter,
                include: {
                    teacher: {
                        select: { id: true, fullName: true, email: true }
                    },
                    observer: {
                        select: { id: true, fullName: true, role: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            legacyMapped = legacyObs.map((obs: any) => ({
                id: obs.id,
                teacherId: obs.teacherId,
                observerId: obs.observerId,
                campusId: obs.campus,
                academicYear: '2024-25', // Default for legacy
                moduleType: 'QUICK_FEEDBACK', // Map to Quick Feedback for visibility
                subject: obs.learningArea,
                block: obs.block,
                grade: obs.grade,
                section: obs.section,
                observationDate: obs.date ? new Date(obs.date) : obs.createdAt,
                overallRating: obs.score,
                status: obs.status,
                notes: obs.notes,
                actionStep: obs.actionStep,
                teacherReflection: obs.teacherReflection,
                discussionMet: obs.discussionMet,
                strengths: obs.strengths,
                areasOfGrowth: obs.areasOfGrowth,
                metaTags: obs.metaTags,
                tools: obs.tools,
                routines: obs.routines,
                createdAt: obs.createdAt,
                updatedAt: obs.updatedAt,
                teacher: obs.teacher,
                observer: obs.observer,
                formPayload: {
                    teacherName: obs.teacher?.fullName || 'Teacher',
                    learningArea: obs.learningArea,
                    score: obs.score,
                    notes: obs.notes,
                    strengths: obs.strengths,
                    areasOfGrowth: obs.areasOfGrowth,
                    detailedReflection: obs.detailedReflection ? JSON.parse(obs.detailedReflection) : null
                }
            }));
        }

        const allObservations = [...mappedObservations, ...legacyMapped].sort((a, b) =>
            new Date(b.observationDate).getTime() - new Date(a.observationDate).getTime()
        );

        res.status(200).json({
            status: 'success',
            results: allObservations.length,
            data: { observations: allObservations }
        });
    } catch (err) {
        next(err);
    }
};

export const getGrowthObservationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params;

        let observation = await prisma.growthObservation.findUnique({
            where: { id: String(id) },
            include: {
                teacher: { select: { id: true, fullName: true, email: true, campusId: true } },
                observer: { select: { id: true, fullName: true, role: true } }
            }
        }) as any;

        if (!observation) {
            // Try legacy table
            const legacy = await prisma.observation.findUnique({
                where: { id: String(id) },
                include: {
                    teacher: { select: { id: true, fullName: true, email: true } },
                    observer: { select: { id: true, fullName: true, role: true } }
                }
            });

            if (legacy) {
                observation = {
                    id: legacy.id,
                    teacherId: legacy.teacherId,
                    observerId: legacy.observerId,
                    campusId: legacy.campus,
                    academicYear: '2024-25',
                    moduleType: 'QUICK_FEEDBACK',
                    subject: legacy.learningArea,
                    block: legacy.block,
                    grade: legacy.grade,
                    section: legacy.section,
                    observationDate: legacy.date ? new Date(legacy.date) : legacy.createdAt,
                    overallRating: legacy.score,
                    status: legacy.status,
                    notes: legacy.notes,
                    actionStep: legacy.actionStep,
                    teacherReflection: legacy.teacherReflection,
                    discussionMet: legacy.discussionMet,
                    strengths: legacy.strengths,
                    areasOfGrowth: legacy.areasOfGrowth,
                    metaTags: legacy.metaTags,
                    tools: legacy.tools,
                    routines: legacy.routines,
                    createdAt: legacy.createdAt,
                    updatedAt: legacy.updatedAt,
                    teacher: (legacy as any).teacher,
                    observer: (legacy as any).observer,
                    formPayload: JSON.stringify({
                        teacherName: (legacy as any).teacher?.fullName || 'Teacher',
                        teacherEmail: (legacy as any).teacher?.email || '',
                        learningArea: legacy.learningArea,
                        subject: legacy.learningArea,
                        score: legacy.score,
                        overallRating: legacy.score,
                        notes: legacy.notes,
                        strengths: legacy.strengths,
                        areasOfGrowth: legacy.areasOfGrowth,
                        actionStep: legacy.actionStep,
                        teacherReflection: legacy.teacherReflection,
                        discussedWithTeacher: legacy.discussionMet,
                        block: legacy.block,
                        grade: legacy.grade,
                        section: legacy.section,
                        metaTags: (() => { try { return JSON.parse(legacy.metaTags || '[]'); } catch (e) { return []; } })(),
                        cultureTools: (() => { try { return JSON.parse(legacy.tools || '[]'); } catch (e) { return []; } })(),
                        instructionalTools: [],
                        routinesObserved: (() => { try { return JSON.parse(legacy.routines || '[]'); } catch (e) { return []; } })(),
                        detailedReflection: legacy.detailedReflection ? JSON.parse(legacy.detailedReflection) : null
                    })
                };
            }
        }

        if (!observation) {
            return next(new AppError('Observation not found', 404));
        }

        // Security: Teachers can only view their own
        if (authReq.user?.role === 'TEACHER' && observation.teacherId !== authReq.user.id) {
            return next(new AppError('You are not authorized to view this observation', 403));
        }

        const mapped = {
            ...observation,
            formPayload: (() => {
                try {
                    return typeof observation.formPayload === 'string' ? JSON.parse(observation.formPayload || '{}') : observation.formPayload;
                } catch (e) {
                    return observation.formPayload;
                }
            })()
        };

        res.status(200).json({
            status: 'success',
            data: { observation: mapped }
        });
    } catch (err) {
        next(err);
    }
};

export const updateGrowthObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params;
        const data = req.body;

        const existing = await prisma.growthObservation.findUnique({ where: { id: String(id) } });
        if (!existing) return next(new AppError('Observation not found', 404));

        // Security: Leaders can update almost anything, teachers maybe just reflections (though not requested yet for unified table)
        // For now, let's just implement a general update for leaders
        if (authReq.user?.role === 'TEACHER' && existing.teacherId !== authReq.user.id) {
            return next(new AppError('Not authorized', 403));
        }

        const f = data.formPayload || {};
        const stringify = (val: any) => typeof val === 'object' ? JSON.stringify(val) : val;

        const updated = await prisma.growthObservation.update({
            where: { id: String(id) },
            data: {
                academicYear: data.academicYear || f.academicYear,
                moduleType: data.moduleType || f.moduleType,
                subject: data.subject || f.subject || f.learningArea,
                block: data.block || f.block,
                grade: data.grade || f.grade,
                section: data.section || f.section,
                observationDate: data.observationDate ? new Date(data.observationDate) : (f.observationDate ? new Date(f.observationDate) : undefined),
                overallRating: data.overallRating !== undefined ? Number(data.overallRating) : (f.overallRating !== undefined ? Number(f.overallRating) : (f.score !== undefined ? Number(f.score) : undefined)),
                status: data.status || f.status,
                formPayload: data.formPayload ? (stringify(data.formPayload) as string) : undefined,
                // Map specialist fields if provided
                notes: data.notes || data.feedback || f.notes || f.feedback,
                actionStep: data.actionStep || f.actionStep,
                teacherReflection: data.teacherReflection || f.teacherReflection,
                discussionMet: data.discussedWithTeacher !== undefined ? (data.discussedWithTeacher === true || data.discussedWithTeacher === 'Yes') : (f.discussedWithTeacher !== undefined ? (f.discussedWithTeacher === true || f.discussedWithTeacher === 'Yes') : undefined),
                strengths: data.strengths || f.strengths,
                areasOfGrowth: data.areasOfGrowth || f.areasOfGrowth,
                metaTags: (data.metaTags || f.metaTags) ? (stringify(data.metaTags || f.metaTags) as string) : undefined,
                tools: (data.tools || data.cultureTools || data.instructionalTools || f.tools || f.cultureTools || f.instructionalTools) ? (stringify(data.tools || data.cultureTools || data.instructionalTools || f.tools || f.cultureTools || f.instructionalTools) as string) : undefined,
                routines: (data.routines || data.routinesObserved || f.routines || f.routinesObserved) ? (stringify(data.routines || data.routinesObserved || f.routines || f.routinesObserved) as string) : undefined,
            }
        });

        res.status(200).json({
            status: 'success',
            data: { observation: updated }
        });
    } catch (err) {
        next(err);
    }
};
