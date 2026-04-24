import { Response } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';
import { AuthRequest } from '../middlewares/auth';
import { getIO } from '../../core/socket';

// Toggle Attendance (Enable/Close)
// Toggle Attendance (Enable/Close)
export const toggleAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { action } = req.body; // 'enable' or 'close'
        const userId = req.user?.id;

        if (!['enable', 'close'].includes(action)) {
            return res.status(400).json({ status: 'error', message: 'Invalid action' });
        }

        const event = await prisma.trainingEvent.findUnique({ where: { id } });

        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }

        // Permission Validation: Creator, ADMIN, SUPERADMIN, or LEADER
        const userRole = (req.user?.role || '').toUpperCase().trim();
        const isAuthorized = event.createdById === userId ||
            ['ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER', 'MANAGEMENT'].includes(userRole);

        if (!isAuthorized) {
            return res.status(403).json({
                status: 'error',
                message: `Permission denied. Role '${userRole}' is not authorized to manage attendance for this event. Required: [ADMIN, SUPERADMIN, LEADER, SCHOOL_LEADER, MANAGEMENT]`
            });
        }


        const updateData: any = {};
        if (action === 'enable') {
            updateData.attendanceEnabled = true;
            updateData.attendanceClosed = false;
            updateData.attendanceTriggeredAt = new Date();
        } else if (action === 'close') {
            updateData.attendanceEnabled = false;
            updateData.attendanceClosed = true;
        }

        const updatedEvent = await prisma.trainingEvent.update({
            where: { id },
            data: updateData
        });

        // Emit real-time update
        const io = getIO();
        if (updatedEvent.schoolId) {
            io.to(`campus:${updatedEvent.schoolId}`).emit('attendance:toggled', {
                eventId: id,
                action,
                attendanceEnabled: updatedEvent.attendanceEnabled,
                attendanceClosed: updatedEvent.attendanceClosed
            });
        } else {
            io.emit('attendance:toggled', {
                eventId: id,
                action,
                attendanceEnabled: updatedEvent.attendanceEnabled,
                attendanceClosed: updatedEvent.attendanceClosed
            });
        }

        res.status(200).json({
            status: 'success',
            data: { event: updatedEvent }
        });

    } catch (error: any) {
        console.error('Error toggling attendance:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Submit Attendance
export const submitAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // eventId
        const userId = req.user?.id;
        const { mobile, employeeId, department } = req.body;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'User not authenticated' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const event = await prisma.trainingEvent.findUnique({ where: { id } });

        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }

        if (!event.attendanceEnabled) {
            return res.status(400).json({ status: 'error', message: 'Attendance is not enabled for this event' });
        }

        if (event.attendanceClosed) {
            return res.status(400).json({ status: 'error', message: 'Attendance for this event is closed' });
        }

        // Lazy-close fallback: Check if the current day has already passed the event day
        if (event.date) {
            const eventDateStr = event.date;
            const parsedEventDate = new Date(eventDateStr);
            if (!isNaN(parsedEventDate.getTime())) {
                const eventDay = new Date(parsedEventDate.getFullYear(), parsedEventDate.getMonth(), parsedEventDate.getDate());
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                if (eventDay.getTime() < today.getTime()) {
                    // Update database to definitively close it
                    await prisma.trainingEvent.update({
                        where: { id: event.id },
                        data: { attendanceClosed: true, attendanceEnabled: false }
                    });
                    return res.status(400).json({ status: 'error', message: 'Attendance time has expired for this event (allowed until 11:59 PM of the event day)' });
                }
            }
        }

        // Check for existing record
        const existing = await prisma.eventAttendance.findUnique({
            where: {
                eventId_teacherEmail: {
                    eventId: id,
                    teacherEmail: user.email // Use fetched user email
                }
            }
        });

        if (existing) {
            return res.status(409).json({ status: 'error', message: 'You have already submitted attendance' });
        }

        const attendance = await prisma.eventAttendance.create({
            data: {
                eventId: id,
                teacherId: userId,
                teacherName: user.fullName || 'Unknown',
                teacherEmail: user.email,
                schoolId: user.campusId, // Use fetched campusId
                mobile,
                employeeId,
                department,
                status: true
            }
        });

        // Emit real-time update
        const io = getIO();
        if (user.campusId) {
            io.to(`campus:${user.campusId}`).emit('attendance:submitted', {
                eventId: id,
                attendance
            });
            // Also notify analytics subscribers
            io.emit('ANALYTICS_UPDATED', { type: 'ATTENDANCE', campusId: user.campusId });
        } else {
            io.emit('attendance:submitted', {
                eventId: id,
                attendance
            });
            io.emit('ANALYTICS_UPDATED', { type: 'ATTENDANCE' });
        }

        res.status(201).json({
            status: 'success',
            data: { attendance }
        });

    } catch (error: any) {
        console.error('Error submitting attendance:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get Event Attendance List
export const getEventAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const userId = req.user?.id;

        const event = await prisma.trainingEvent.findUnique({ where: { id } });

        if (!event) return res.status(404).json({ status: 'error', message: 'Event not found' });

        // Security: Open to Admin, Creator, or Leader of the same campus
        const userRole = (req.user?.role || '').toUpperCase().trim();
        const isAdmin = ['ADMIN', 'SUPERADMIN', 'MANAGEMENT'].includes(userRole);
        const isOwner = event.createdById === userId;
        const isCampusLeader = ['LEADER', 'SCHOOL_LEADER'].includes(userRole) &&
            (event.schoolId === req.user?.campusId || !event.schoolId || event.schoolId === 'all');

        if (!isAdmin && !isOwner && !isCampusLeader) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to view attendance for this event'
            });
        }

        const attendance = await prisma.eventAttendance.findMany({
            where: { eventId: id },
            orderBy: { submittedAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: attendance.length,
            data: { attendance }
        });

    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


// Get All Attendance (Global Admin View)
export const getAllAttendance = async (req: AuthRequest, res: Response) => {
    try {
        let filter: any = {};
        if (req.user?.role === 'LEADER' || req.user?.role === 'SCHOOL_LEADER') {
            filter.schoolId = req.user.campusId;
        }

        // Add filtering by school, date, event if needed via query params
        const attendance = await prisma.eventAttendance.findMany({
            where: filter,
            include: {
                event: {
                    select: { title: true, date: true }
                }
            },
            orderBy: { submittedAt: 'desc' },
            take: 100 // Limit for now
        });

        res.status(200).json({
            status: 'success',
            results: attendance.length,
            data: { attendance }
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Award Training Hours to all present attendees
export const awardTrainingHours = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // eventId
        const userId = req.user?.id;

        const event = await prisma.trainingEvent.findUnique({
            where: { id },
            include: { attendanceRecords: true }
        });

        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }

        // Check if user is authorized to award hours
        const userRole = (req.user?.role || '').toUpperCase().trim();
        const isAuthorized = event.createdById === userId ||
            ['ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER', 'MANAGEMENT'].includes(userRole);

        if (!isAuthorized) {
            return res.status(403).json({ status: 'error', message: 'Not authorized to award hours' });
        }

        if ((event as any).hoursAwarded) {
            return res.status(400).json({ status: 'error', message: 'Training hours have already been awarded for this event' });
        }

        const attendees = event.attendanceRecords.filter(a => a.status === true);
        if (attendees.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No attendees recorded for this event' });
        }

        const hoursAwarded = (event as any).trainingHours || 2.0;
        const topicShort = event.topic || 'Training';

        // Create PDHour records for each attendee
        const pdEntries = await Promise.all(
            attendees.map(attendee =>
                prisma.pDHour.create({
                    data: {
                        userId: attendee.teacherId,
                        activity: event.title,
                        hours: hoursAwarded,
                        category: event.topic,
                        status: 'APPROVED',
                        date: new Date()
                    }
                })
            )
        );

        // Mark event as hours awarded
        await prisma.trainingEvent.update({
            where: { id },
            data: { hoursAwarded: true } as any
        });

        // Emit real-time update for each awarded teacher
        const io = getIO();
        attendees.forEach(attendee => {
            io.to(`user:${attendee.teacherId}`).emit('pd:awarded', {
                activity: event.title,
                hours: hoursAwarded
            });
        });

        // Trigger Global Analytics Refresh
        io.emit('ANALYTICS_UPDATED', { type: 'PD_HOURS' });

        res.status(200).json({
            status: 'success',
            message: `Successfully awarded ${hoursAwarded} hours to ${attendees.length} attendees`,
            data: { pdEntries }
        });

    } catch (error: any) {
        console.error('Error awarding training hours:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Mark Attendance manually by Admin/Leader
export const markAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId, teacherId, teacherName, teacherEmail } = req.body;
        const userId = req.user?.id;

        if (!eventId || !teacherId || !teacherEmail) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        const event = await prisma.trainingEvent.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Event not found' });
        }

        // Permission Validation: Creator, ADMIN, SUPERADMIN, or LEADER
        const userRole = (req.user?.role || '').toUpperCase().trim();
        const isAuthorized = event.createdById === userId ||
            ['ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER', 'MANAGEMENT'].includes(userRole);

        if (!isAuthorized) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to mark attendance for this event'
            });
        }

        // Check for existing record
        const existing = await prisma.eventAttendance.findUnique({
            where: {
                eventId_teacherEmail: {
                    eventId,
                    teacherEmail
                }
            }
        });

        if (existing) {
            return res.status(409).json({ status: 'error', message: 'Attendance already marked for this user' });
        }

        // Get teacher details to fetch their campusId (schoolId)
        const teacher = await prisma.user.findUnique({ where: { id: teacherId } });

        const attendance = await prisma.eventAttendance.create({
            data: {
                eventId,
                teacherId,
                teacherName: teacherName || teacher?.fullName || 'Unknown',
                teacherEmail,
                schoolId: teacher?.campusId || event.schoolId,
                status: true
            }
        });

        // Emit real-time update
        const io = getIO();
        io.emit('attendance:submitted', {
            eventId,
            attendance
        });
        io.emit('ANALYTICS_UPDATED', { type: 'ATTENDANCE' });

        res.status(201).json({
            status: 'success',
            data: { attendance }
        });

    } catch (error: any) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
