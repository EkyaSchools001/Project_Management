import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../../infrastructure/utils/AppError';
import prisma from '../../infrastructure/database/prisma';
import bcrypt from 'bcryptjs';
import { getIO } from '../../core/socket';
import { createNotification } from './notificationController';
import { getFormRouting } from '../utils/formWorkflowUtils';

export const getAllObservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter: any = {};

        // RBAC logic: Teachers only see their own
        if (authReq.user?.role === 'TEACHER') {
            filter = { teacherId: authReq.user.id };
        } else if (authReq.user?.role === 'SUPERADMIN') {
            // Superadmins see everything
            filter = {};
        } else if (authReq.user) {
            // For all other roles (Leader, HOS, Coordinator, Management, etc.)
            // We use their primary campus + any additional mapped campuses
            const allowedCampuses = [authReq.user.campusId];
            if (authReq.user.campusAccess) {
                const extra = authReq.user.campusAccess.split(',').filter(Boolean);
                allowedCampuses.push(...extra);
            }
            const uniqueCampuses = Array.from(new Set(allowedCampuses.filter(Boolean)));
            if (uniqueCampuses.length > 0) {
                filter = { teacher: { campusId: { in: uniqueCampuses } } };
            }
        }

        const observations = await prisma.observation.findMany({
            where: filter,
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                domainRatings: true
            }
        });

        // Map domainRatings to domains for frontend consistency and parse JSON fields
        const mappedObservations = observations.map(obs => {
            const { domainRatings, detailedReflection, ...rest } = obs;

            // Parse detailedReflection if it's a string (SQLite workaround)
            let parsedReflection = detailedReflection;
            if (typeof detailedReflection === 'string' && detailedReflection) {
                try {
                    parsedReflection = JSON.parse(detailedReflection as string);
                } catch (e) {
                    console.error("Failed to parse detailedReflection:", e);
                    // Keep as string or set to null if parsing fails
                }
            }

            return {
                ...rest,
                detailedReflection: parsedReflection,
                metaTags: (() => { try { return JSON.parse(rest.metaTags || '[]'); } catch (e) { return []; } })(),
                tools: (() => { try { return JSON.parse(rest.tools || '[]'); } catch (e) { return []; } })(),
                routines: (() => { try { return JSON.parse(rest.routines || '[]'); } catch (e) { return []; } })(),
                domains: domainRatings.map(dr => ({
                    ...dr,
                    indicators: (() => {
                        try {
                            return JSON.parse(dr.rating);
                        } catch (e) {
                            return [];
                        }
                    })()
                }))
            };
        });

        res.status(200).json({
            status: 'success',
            results: mappedObservations.length,
            data: { observations: mappedObservations }
        });
    } catch (err) {
        next(err);
    }
};

export const createObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const data = req.body;

        console.log("DEBUG: createObservation received body:", JSON.stringify(data, null, 2));
        console.log("DEBUG: Observer ID:", authReq.user?.id);

        // Try to link to a teacher user if email is provided
        let teacherId = data.teacherId;
        if (!teacherId && data.teacherEmail) {
            console.log("DEBUG: No teacherId provided, looking up by email:", data.teacherEmail);
            const teacher = await prisma.user.findUnique({ where: { email: data.teacherEmail } });
            if (teacher) {
                teacherId = teacher.id;
                console.log("DEBUG: Found teacher by email:", teacherId);
            } else {
                // Auto-create teacher if not found to support manual input
                try {
                    console.log("DEBUG: Teacher not found. Auto-creating teacher for email:", data.teacherEmail);
                    const newTeacher = await prisma.user.create({
                        data: {
                            email: data.teacherEmail,
                            fullName: data.teacher || 'Manual Entry Teacher',
                            passwordHash: await bcrypt.hash('Teacher@123', 10), // Default passwordHash
                            role: 'TEACHER'
                        }
                    });
                    teacherId = newTeacher.id;
                    console.log("DEBUG: Auto-created teacher:", teacherId);
                } catch (userErr) {
                    console.error("Error auto-creating teacher:", userErr);
                    // Fallback to unknown if creation fails (e.g. race condition)
                    teacherId = (await prisma.user.findUnique({ where: { email: data.teacherEmail } }))?.id || 'unknown';
                }
            }
        }

        const newObservationData = {
            teacherId: String(teacherId && teacherId !== 'unknown' ? teacherId : ''),
            observerId: String(authReq.user?.id || ''),
            date: String(data.date || new Date().toISOString()),
            domain: String(data.domain || 'General'),
            score: Number(data.score || 0),
            notes: String(data.notes || data.feedback || ''),
            status: (data.status === 'DRAFT' ? 'DRAFT' : 'SUBMITTED') as any,
            actionStep: String(data.actionStep || ''),
            teacherReflection: String(data.teacherReflection || ''),
            // Ensure detailedReflection is stringified for SQLite if it's an object
            detailedReflection: typeof data.detailedReflection === 'object' ? JSON.stringify(data.detailedReflection) : String(data.detailedReflection || ''),
            discussionMet: !!data.discussionMet,
            hasReflection: !!data.hasReflection,
            campus: String(data.campus || ''),
            block: String(data.block || data.classroom?.block || ''),
            grade: String(data.grade || data.classroom?.grade || ''),
            section: String(data.section || data.classroom?.section || ''),
            learningArea: String(data.learningArea || data.classroom?.learningArea || ''),
            type: String(data.type || ''),
            strengths: String(data.strengths || data.glows || ''),
            areasOfGrowth: String(data.areasOfGrowth || data.grows || ''),
            otherComment: String(data.otherComment || ''),
            metaTags: typeof data.metaTags === 'object' ? JSON.stringify(data.metaTags) : String(data.metaTags || '[]'),
            tools: typeof data.tools === 'object' ? JSON.stringify(data.tools) : String(data.tools || '[]'),
            routines: typeof data.routines === 'object' ? JSON.stringify(data.routines) : String(data.routines || '[]'),
            createdAt: new Date()
        };

        if (!newObservationData.teacherId || !newObservationData.observerId) {
            console.error("DEBUG: Validation failed. teacherId:", newObservationData.teacherId, "observerId:", newObservationData.observerId);
            return next(new AppError('A valid teacher and authenticated observer are required', 400));
        }

        console.log("DEBUG: Attempting to create observation in DB with data:", JSON.stringify(newObservationData, null, 2));

        // Create the observation
        const createdObservation = await prisma.observation.create({
            data: {
                ...newObservationData,
                domainRatings: {
                    create: (data.domains || []).map((d: any) => ({
                        domainId: String(d.domainId),
                        title: d.title,
                        rating: JSON.stringify(d.indicators || []), // Store indicators as JSON in rating for now
                        evidence: d.evidence
                    }))
                }
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                domainRatings: true
            }
        });

        // Map for frontend
        const { domainRatings, detailedReflection, ...rest } = createdObservation;

        let parsedReflection = detailedReflection;
        if (typeof detailedReflection === 'string' && detailedReflection) {
            try {
                parsedReflection = JSON.parse(detailedReflection);
            } catch (e) { }
        }

        const mappedObservation = {
            ...rest,
            detailedReflection: parsedReflection,
            domains: domainRatings.map(dr => ({
                ...dr,
                indicators: (() => {
                    try {
                        return JSON.parse(dr.rating);
                    } catch (e) {
                        return [];
                    }
                })()
            }))
        };

        // Real-time update
        const io = getIO();
        io.to(`user:${mappedObservation.teacherId}`).emit('observation:created', mappedObservation);
        if (mappedObservation.campus) {
            io.to(`campus:${mappedObservation.campus}`).emit('observation:created', mappedObservation);
        }

        // Determine routing dynamically based on FormWorkflow settings
        const routing = await getFormRouting(
            'Walkthrough Observation',
            authReq.user?.role || 'LEADER',
            mappedObservation.campus || undefined,
            mappedObservation.learningArea || undefined // Use learningArea as subject
        );

        // Send in-app notification to teacher
        await createNotification({
            userId: mappedObservation.teacherId,
            title: 'New Observation',
            message: `A new ${mappedObservation.domain} observation has been submitted by ${authReq.user?.fullName}.`,
            type: 'SUCCESS',
            link: routing ? `${routing.route}/dashboard` : '/teacher/dashboard'
        });

        res.status(201).json({
            status: 'success',
            data: { observation: mappedObservation }
        });
    } catch (err: any) {
        console.error("FATAL ERROR in createObservation:");
        console.error("Error Message:", err.message);
        console.error("Stack Trace:", err.stack);
        if (err.code) console.error("Prisma Error Code:", err.code);
        if (err.meta) console.error("Prisma Error Meta:", JSON.stringify(err.meta));
        next(err);
    }
};

export const updateObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const authReq = req as AuthRequest;
        const currentUserId = authReq.user?.id;
        const userRole = authReq.user?.role;

        // Fetch existing observation to check ownership
        const existingObservation = await prisma.observation.findUnique({
            where: { id: String(id) }
        });

        if (!existingObservation) {
            return next(new AppError('Observation not found', 404));
        }

        // If user is a teacher, they can only update THEIR OWN observation
        // and only reflection-related fields
        if (userRole === 'TEACHER') {
            if (existingObservation.teacherId !== currentUserId) {
                return next(new AppError('You are not authorized to update this reflection', 403));
            }

            // Strictly limit what a teacher can update
            const allowedForTeacher = ['teacherReflection', 'detailedReflection', 'hasReflection', 'status'];
            const forbiddenKeys = Object.keys(data).filter(key => !allowedForTeacher.includes(key));

            if (forbiddenKeys.length > 0) {
                // If they try to update forbidden fields, we still allow the update but only of the allowed fields
                // OR we can throw error. Let's just filter them.
            }
        }

        // Pick only fields supported by the Prisma schema
        // and normalize status case
        const updateData: any = {
            updatedAt: new Date()
        };

        const allowedFields = userRole === 'TEACHER'
            ? ['teacherReflection', 'detailedReflection', 'hasReflection', 'status']
            : ['teacherReflection', 'detailedReflection', 'hasReflection', 'notes', 'actionStep', 'discussionMet', 'score', 'domain', 'status', 'campus', 'block', 'grade', 'section', 'learningArea', 'type', 'strengths', 'areasOfGrowth', 'otherComment', 'metaTags', 'tools', 'routines', 'formPayload'];

        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                if (field === 'status') {
                    const statusMap: Record<string, string> = {
                        'Submitted': 'SUBMITTED',
                        'submitted': 'SUBMITTED',
                        'Draft': 'DRAFT',
                        'draft': 'DRAFT',
                        'Reviewed': 'REVIEWED',
                        'reviewed': 'REVIEWED'
                    };
                    updateData.status = (statusMap[data.status] || data.status.toUpperCase()) as any;
                } else if (field === 'score') {
                    updateData.score = Number(data[field]);
                } else if (['hasReflection', 'discussionMet'].includes(field)) {
                    updateData[field] = !!data[field];
                } else {
                    if (field === 'detailedReflection' && typeof data[field] === 'object') {
                        updateData[field] = JSON.stringify(data[field]);
                    } else if (['metaTags', 'tools', 'routines'].includes(field) && typeof data[field] === 'object') {
                        updateData[field] = JSON.stringify(data[field]);
                    } else {
                        updateData[field] = String(data[field]);
                    }
                }
            }
        });

        const updatedObservation = await prisma.observation.update({
            where: { id: String(id) },
            data: updateData,
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                domainRatings: true
            }
        });

        // Map for frontend
        const { domainRatings, detailedReflection, ...rest } = updatedObservation;

        // Parse back for response
        let parsedReflection = detailedReflection;
        if (typeof detailedReflection === 'string' && detailedReflection) {
            try {
                parsedReflection = JSON.parse(detailedReflection);
            } catch (e) {
                console.error("Error parsing detailedReflection in update response", e);
            }
        }

        const mappedObservation = {
            ...rest,
            detailedReflection: parsedReflection,
            domains: domainRatings.map(dr => ({
                ...dr,
                indicators: (() => {
                    try {
                        return JSON.parse(dr.rating);
                    } catch (e) {
                        return [];
                    }
                })()
            }))
        };

        const io = getIO();
        io.to(`user:${mappedObservation.teacherId}`).emit('observation:updated', mappedObservation);
        if (mappedObservation.campus) {
            io.to(`campus:${mappedObservation.campus}`).emit('observation:updated', mappedObservation);
        }

        // Notify teacher if observation was updated by someone else
        if (userRole !== 'TEACHER') {
            await createNotification({
                userId: mappedObservation.teacherId,
                title: 'Observation Updated',
                message: `Your observation from ${new Date(mappedObservation.date).toLocaleDateString()} has been updated by ${authReq.user?.fullName}.`,
                type: 'INFO',
                link: '/teacher/dashboard'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { observation: mappedObservation }
        });
    } catch (err) {
        next(err);
    }
};

export const getObservationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const authReq = req as AuthRequest;

        const observation = await prisma.observation.findUnique({
            where: { id: String(id) },
            include: {
                teacher: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        campusId: true
                    }
                },
                domainRatings: true
            }
        });

        if (!observation) {
            return next(new AppError('Observation not found', 404));
        }

        // RBAC: Check if user has access to this observation
        if (authReq.user?.role === 'TEACHER' && observation.teacherId !== authReq.user.id) {
            return next(new AppError('You are not authorized to view this observation', 403));
        }

        // Parse JSON fields
        const { domainRatings, detailedReflection, ...rest } = observation;

        let parsedReflection = detailedReflection;
        if (typeof detailedReflection === 'string' && detailedReflection) {
            try {
                parsedReflection = JSON.parse(detailedReflection);
            } catch (e) { }
        }

        const mappedObservation = {
            ...rest,
            detailedReflection: parsedReflection,
            metaTags: (() => { try { return JSON.parse(rest.metaTags || '[]'); } catch (e) { return []; } })(),
            tools: (() => { try { return JSON.parse(rest.tools || '[]'); } catch (e) { return []; } })(),
            routines: (() => { try { return JSON.parse(rest.routines || '[]'); } catch (e) { return []; } })(),
            domains: domainRatings.map(dr => ({
                ...dr,
                indicators: (() => {
                    try {
                        return JSON.parse(dr.rating);
                    } catch (e) {
                        return [];
                    }
                })()
            }))
        };

        res.status(200).json({
            status: 'success',
            data: { observation: mappedObservation }
        });
    } catch (err) {
        next(err);
    }
};


export const getClusters = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clusters = await prisma.cluster.findMany({
            include: {
                domains: {
                    include: {
                        subdomains: {
                            include: {
                                parameters: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({ status: 'success', data: { clusters } });
    } catch (err) {
        next(err);
    }
};

export const getClusterById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { number } = req.params;
        const cluster = await prisma.cluster.findUnique({
            where: { number: parseInt(number as string) },
            include: {
                domains: {
                    include: {
                        subdomains: {
                            include: {
                                parameters: true
                            }
                        }
                    }
                }
            }
        });

        if (!cluster) return next(new AppError('Cluster not found', 404));

        res.status(200).json({ status: 'success', data: { cluster } });
    } catch (err) {
        next(err);
    }
};

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const schedule = await prisma.observationSchedule.create({
            data: {
                teacherId: data.teacherId,
                observerId: data.observerId,
                clusterNumber: parseInt(data.clusterNumber),
                scheduledDate: new Date(data.scheduledDate),
                startTime: data.startTime,
                grade: data.grade,
                section: data.section,
                subject: data.subject,
                status: 'SCHEDULED'
            }
        });

        res.status(201).json({ status: 'success', data: { schedule } });
    } catch (err) {
        next(err);
    }
};

export const getSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter: any = {};

        if (authReq.user?.role === 'TEACHER') {
            filter = { teacherId: authReq.user.id };
        } else if (authReq.user?.role !== 'SUPERADMIN' && authReq.user?.role !== 'ADMIN') {
            // For campus-specific roles
            filter = { teacher: { campusId: authReq.user?.campusId } };
        }

        const schedules = await prisma.observationSchedule.findMany({
            where: filter,
            include: {
                teacher: { select: { fullName: true, id: true, campusId: true } },
                observer: { select: { fullName: true, id: true } }
            },
            orderBy: { scheduledDate: 'desc' }
        });

        res.status(200).json({ status: 'success', data: { schedules } });
    } catch (err) {
        next(err);
    }
};

export const submitStructuredObservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { clusterNumber, scheduleId, metadata, responses, stats } = req.body;

        // 1. Get schedule info
        const schedule = await prisma.observationSchedule.findUnique({
            where: { id: scheduleId },
            include: { teacher: true }
        });

        if (!schedule) return next(new AppError('Schedule not found', 404));

        // 2. Create the main Observation record
        const observation = await prisma.observation.create({
            data: {
                teacherId: schedule.teacherId,
                observerId: authReq.user?.id || '',
                scheduleId: scheduleId,
                date: metadata.date,
                domain: `Cluster ${clusterNumber}`,
                score: stats.yes, // Overall score based on % Yes
                notes: metadata.runningNotes,
                actionStep: metadata.actionStep,
                status: 'SUBMITTED',
                campus: schedule.teacher.campusId,
                grade: metadata.grade,
                section: metadata.section,
                learningArea: metadata.learningArea,
                strengths: metadata.glows,
                areasOfGrowth: metadata.grows,
                tools: metadata.toolsObserved,
                routines: metadata.routinesProcedures,
                otherComment: metadata.additionalComments,
                createdAt: new Date()
            }
        });

        // 3. Create structured responses
        const responseData = Object.entries(responses).map(([paramId, res]: any) => ({
            observationId: observation.id,
            parameterId: paramId,
            rating: res.rating,
            comment: res.comment
        }));

        await prisma.observationResponse.createMany({
            data: responseData
        });

        // 4. Update schedule status
        await prisma.observationSchedule.update({
            where: { id: scheduleId },
            data: { status: 'SUBMITTED' }
        });

        res.status(201).json({ status: 'success', data: { observation } });
    } catch (err) {
        next(err);
    }
};
