import { Response } from 'express';
import { prisma } from '../../app';
import { UserRole } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../middlewares/auth';
import { getIO } from '../../socket';
import { createNotification } from './notificationController';

export const getAllTrainingEvents = async (req: AuthRequest, res: Response) => {
    try {
        let filter: any = {};
        if (req.user?.role === 'LEADER' || req.user?.role === 'SCHOOL_LEADER') {
            filter = {
                OR: [
                    { schoolId: req.user.campusId },
                    { schoolId: null },
                    { schoolId: '' },
                    { createdById: req.user.id },
                    { proposedById: req.user.id },
                    // Limit Admin/Superadmin events to global or my campus
                    {
                        AND: [
                            {
                                createdBy: {
                                    role: { in: ['ADMIN', 'SUPERADMIN'] }
                                }
                            },
                            {
                                OR: [
                                    { schoolId: req.user.campusId },
                                    { schoolId: null },
                                    { schoolId: '' },
                                    { schoolId: 'ALL' },
                                    { schoolId: 'all' }
                                ]
                            }
                        ]
                    }
                ]
            };
        }

        const events = await prisma.trainingEvent.findMany({
            where: filter,
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                _count: {
                    select: { attendanceRecords: true }
                }
            },
            orderBy: { date: 'asc' }
        });

        // Map registrations to registrants for frontend compatibility with ultra-safety
        const mappedEvents = events.map(event => ({
            ...event,
            registrants: (event.registrations || []).map(reg => ({
                id: reg.user?.id || 'N/A',
                name: reg.user?.fullName || 'Unknown',
                email: reg.user?.email || 'N/A',
                role: reg.user?.role || UserRole.TeacherStaff,
                dateRegistered: reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
            })),
            attendanceCount: (event as any)._count?.attendanceRecords || 0
        }));

        res.status(200).json({
            status: 'success',
            data: { events: mappedEvents }
        });
    } catch (error: any) {
        console.error('Error fetching training events:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const getTrainingEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const event = await prisma.trainingEvent.findUnique({
            where: { id },
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                role: true,
                                campusId: true,
                                department: true
                            }
                        }
                    }
                },
                _count: {
                    select: { attendanceRecords: true }
                }
            }
        });

        console.log('--- DEBUG EVENT ---', JSON.stringify(event, null, 2));

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }

        // Map registrations to registrants for frontend compatibility with ultra-safety
        const mappedEvent = {
            ...event,
            registrants: (event.registrations || []).map((reg: any) => ({
                id: reg.user?.id || 'N/A',
                name: reg.user?.fullName || 'Unknown',
                email: reg.user?.email || 'N/A',
                role: reg.user?.role || UserRole.TeacherStaff,
                campusId: reg.user?.campusId || 'N/A',
                department: reg.user?.department || 'N/A',
                dateRegistered: reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
            })),
            attendanceCount: (event as any)._count?.attendanceRecords || 0
        };

        res.status(200).json({
            status: 'success',
            data: { event: mappedEvent }
        });
    } catch (error: any) {
        console.error('Error fetching training event:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

export const createTrainingEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { title, topic, type, date, time, location, capacity, description, objectives, status, proposedById, schoolId, entryType, teacherId, teacherName, trainingHours } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'User not authenticated' });
        }

        if (!title || !date || !location) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: title, date, and location are required'
            });
        }

        // Fetch user to get campusId if schoolId not provided
        let campusId = schoolId;
        if (!campusId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            campusId = user?.campusId;
        }

        const event = await prisma.trainingEvent.create({
            data: {
                title,
                topic,
                type,
                date,
                time,
                location,
                capacity: capacity ? parseInt(capacity.toString()) : 30, // Default to 30 if not provided
                description,
                objectives,
                status: status || 'PLANNED',
                proposedById: proposedById || userId,
                createdById: userId, // Capture creator
                schoolId: campusId, // Default to creator's campus
                attendanceEnabled: false,
                attendanceClosed: false,
                entryType,
                teacherId,
                teacherName,
                trainingHours: trainingHours ? parseFloat(trainingHours.toString()) : 2.0
            } as any
        });

        const io = getIO();
        if (event.schoolId) {
            io.to(`campus:${event.schoolId}`).to('admins').emit('training:created', event);
        } else {
            io.emit('training:created', event);
        }

        // Notify teachers in the campus about the new training
        if (event.schoolId) {
            const teachers = await prisma.user.findMany({
                where: {
                    campusId: event.schoolId,
                    role: UserRole.TeacherStaff
                },
                select: { id: true }
            });

            for (const teacher of teachers) {
                await createNotification({
                    userId: teacher.id,
                    title: 'New Training Available',
                    message: `A new training session "${event.title}" has been scheduled for ${new Date(event.date).toLocaleDateString()}.`,
                    type: 'INFO',
                    link: '/teacher/training'
                });
            }
        }

        res.status(201).json({
            status: 'success',
            data: { event }
        });
    } catch (error: any) {
        console.error('Error creating training event:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.params;

        if (!userId) {
            throw new AppError('Authentication required', 401);
        }

        const registration = await prisma.registration.create({
            data: {
                userId,
                eventId: eventId as string,
            }
        });

        const io = getIO();
        const event = await prisma.trainingEvent.findUnique({ where: { id: eventId as string } });
        if (event?.schoolId) {
            io.to(`campus:${event.schoolId}`).emit('training:updated', { id: eventId });
        } else {
            io.emit('training:updated', { id: eventId });
        }

        // Notify the user about successful registration
        await createNotification({
            userId,
            title: 'Registration Successful',
            message: `You have successfully registered for the training: ${(await prisma.trainingEvent.findUnique({ where: { id: eventId as string } }))?.title || 'Unknown Event'}.`,
            type: 'SUCCESS',
            link: '/teacher/training'
        });

        res.status(200).json({
            status: 'success',
            data: { registration }
        });
    } catch (error: any) {
        console.error('Registration error details:', error);

        if (error.code === 'P2002') {
            return res.status(400).json({
                status: 'error',
                message: 'Already registered for this event'
            });
        }

        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
            code: error.code
        });
    }
};


export const updateEventStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const event = await prisma.trainingEvent.update({
            where: { id: id as string },
            data: { status }
        });

        const io = getIO();
        if (event.schoolId) {
            io.to(`campus:${event.schoolId}`).to('admins').emit('training:updated', event);
        } else {
            io.emit('training:updated', event);
        }

        res.status(200).json({
            status: 'success',
            data: { event }
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};


export const deleteTrainingEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        // Fetch registrants before deletion to notify them
        const registrants = await prisma.registration.findMany({
            where: { eventId: id as string },
            include: { user: { select: { id: true } } }
        });

        const event = await prisma.trainingEvent.findUnique({ where: { id: id as string } });

        // Manual cascade: Delete all registrations for this event first
        await prisma.registration.deleteMany({
            where: { eventId: id as string }
        });

        await prisma.trainingEvent.delete({
            where: { id: id as string }
        });

        const io = getIO();
        if (event?.schoolId) {
            io.to(`campus:${event.schoolId}`).to('admins').emit('training:deleted', { id: String(id) });
        } else {
            io.emit('training:deleted', { id: String(id) });
        }

        // Notify registrants about cancellation
        for (const reg of registrants) {
            if (reg.user) {
                await createNotification({
                    userId: reg.user.id,
                    title: 'Training Cancelled',
                    message: `The training session "${event?.title || 'Unknown'}" has been cancelled.`,
                    type: 'WARNING',
                    link: '/teacher/training'
                });
            }
        }

        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (error: any) {
        console.error('Error deleting training event:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const updateTrainingEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, topic, type, date, time, location, capacity, description, objectives, status, trainingHours } = req.body;

        const event = await prisma.trainingEvent.update({
            where: { id: id as string },
            data: {
                title,
                topic,
                type,
                date,
                time,
                location,
                capacity: capacity ? parseInt(capacity) : undefined,
                description,
                objectives,
                status,
                trainingHours: trainingHours ? parseFloat(trainingHours.toString()) : undefined
            } as any
        });

        const io = getIO();
        if (event.schoolId) {
            io.to(`campus:${event.schoolId}`).to('admins').emit('training:updated', event);
        } else {
            io.emit('training:updated', event);
        }

        // Notify registrants about the update
        const registrants = await prisma.registration.findMany({
            where: { eventId: id as string },
            include: { user: { select: { id: true } } }
        });

        for (const reg of registrants) {
            if (reg.user) {
                await createNotification({
                    userId: reg.user.id,
                    title: 'Training Updated',
                    message: `The training session "${event.title}" has been updated. Please check the new details.`,
                    type: 'INFO',
                    link: '/teacher/training'
                });
            }
        }

        res.status(200).json({
            status: 'success',
            data: { event }
        });
    } catch (error: any) {
        console.error('Error updating training event:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};
