import { Response } from 'express';
import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../middlewares/auth';
import { getIO } from '../../socket';

export const getPdHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('Authentication required', 401);
        }

        const pdHistory = await prisma.pDHour.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            data: { pdHistory }
        });
    } catch (error: any) {
        console.error('Error fetching PD history:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

export const createPdEntry = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('Authentication required', 401);
        }

        const { activity, hours, category, status, date } = req.body;

        if (!activity || !hours || !category) {
            throw new AppError('Missing required fields: activity, hours, and category are required', 400);
        }

        const pdEntry = await prisma.pDHour.create({
            data: {
                userId,
                activity,
                hours: parseFloat(hours),
                category,
                status: status || 'APPROVED',
                date: date ? new Date(date) : new Date()
            }
        });

        // Trigger Real-time Analytics Update
        try {
            getIO().emit('ANALYTICS_UPDATED', { type: 'PD_HOURS', campusId: (req.user as any).campusId });
        } catch (e) {
            console.warn('Socket emit failed for analytics update');
        }

        res.status(201).json({
            status: 'success',
            data: { pdEntry }
        });
    } catch (error: any) {
        console.error('Error creating PD entry:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

export const triggerPdSnapshot = async (req: AuthRequest, res: Response) => {
    try {
        const { teacherId } = req.body;

        // Fetch teacher data
        const teacher = await prisma.user.findUnique({
            where: { id: teacherId },
            include: { pdHours: true }
        });

        if (!teacher) {
            throw new AppError('Teacher not found', 404);
        }

        const totalHours = teacher.pdHours.reduce((acc, curr) => acc + curr.hours, 0);
        const targetHours = 20;

        const { emailService } = require('../../infrastructure/services/emailService');
        const success = await emailService.sendPDHoursSnapshot(teacher, {
            totalHours,
            targetHours
        });

        if (success) {
            res.status(200).json({
                status: 'success',
                message: 'PD Hours snapshot email sent successfully'
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to send snapshot email. Please check if email service is configured.'
            });
        }
    } catch (error: any) {
        console.error('Error triggering PD snapshot:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};
