import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { UserRole } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';
import { getIO } from '../../socket';

const determineAcademicType = (department?: string): 'CORE' | 'NON_CORE' => {
    const coreSubjects = [
        "Mathematics",
        "Science",
        "English",
        "Social Studies",
        "Social Science",
        "Computer Science",
        "Hindi",
        "Kannada",
        "Biology",
        "Physics",
        "Chemistry",
        "Leadership",
        "Administration",
        "Management",
        "Admin"
    ];

    if (department && coreSubjects.includes(department)) {
        return "CORE";
    }

    return "NON_CORE";
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.query;

        const whereClause: any = {};
        if (role) {
            whereClause.role = role;
        }

        const user = (req as any).user;
        const isAdmin = user && (user.role === 'SUPERADMIN' || user.role === 'ADMIN');

        // General visibility logic for Non-Admin roles (Leader, HOS, Coordinator, Management, etc.)
        if (user && !isAdmin && user.role !== 'TEACHER' && user.role !== 'MANAGEMENT') {
            const accessConditions: any[] = [];
            const allowedCampuses = [user.campusId];
            if (user.campusAccess) {
                const extra = typeof user.campusAccess === 'string' ? user.campusAccess.split(',').filter(Boolean) : 
                    Array.isArray(user.campusAccess) ? user.campusAccess : [];
                allowedCampuses.push(...extra);
            }
            const uniqueCampuses = Array.from(new Set(allowedCampuses.filter(Boolean)));

            if (uniqueCampuses.length > 0) {
                accessConditions.push({ campusId: { in: uniqueCampuses } });
            }
            if (user.id) {
                accessConditions.push({ managerId: user.id });
            }
            if (accessConditions.length > 0) {
                whereClause.OR = accessConditions;
            }
        }


        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                department: true,
                campusId: true,
                campusAccess: true,
                status: true,
                academics: true,
                category: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, email, role, campusId, department, academics, category, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError('User already exists with this email', 400));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password || 'password123', 12);

        const newUser = await prisma.user.create({
            data: {
                name: fullName || email,
                password: password || 'password123',
                fullName,
                email,
                role: role ? role : undefined,
                campusId,
                department,
                academics: academics || (role === 'TEACHER' ? determineAcademicType(department) : 'CORE'),
                category: category || 'IN_SERVICE',
                passwordHash: hashedPassword,
                status: 'Active'
            }
        });

        res.status(201).json({
            status: 'success',
            data: { user: newUser }
        });

        getIO().emit('user:changed', { action: 'create', user: newUser });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return next(new AppError('Invalid user ID', 400));
        }

        const { fullName, role, campusId, department, status, academics, category, campusAccess } = req.body;

        const updateData: any = {};
        if (fullName !== undefined) updateData.fullName = fullName;
        if (role !== undefined) updateData.role = role;
        if (campusId !== undefined) updateData.campusId = campusId;
        if (campusAccess !== undefined) updateData.campusAccess = campusAccess;
        if (department !== undefined) {
            updateData.department = department;
            // Auto-update academics if not explicitly provided and role is teacher
            if (academics === undefined) {
                const currentUser = await prisma.user.findUnique({ where: { id } });
                if (currentUser?.role === UserRole.TEACHER_CORE || (role === 'TEACHER')) {
                    updateData.academics = determineAcademicType(department);
                }
            }
        }
        if (status !== undefined) updateData.status = status;
        if (academics !== undefined) updateData.academics = academics;
        if (category !== undefined) updateData.category = category;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });

        getIO().emit('user:changed', { action: 'update', user: updatedUser });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                department: true,
                campusId: true,
                campusAccess: true,
                status: true,
                academics: true,
                lastActive: true,
                createdAt: true
            }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return next(new AppError('Invalid user ID', 400));
        }

        await prisma.user.delete({ where: { id } });

        res.status(204).json({
            status: 'success',
            data: null
        });

        getIO().emit('user:changed', { action: 'delete', id });
    } catch (err) {
        next(err);
    }
};

export const getUnverifiedUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            where: { isVerified: false },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
                campusId: true,
                department: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        next(err);
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) return next(new AppError('User ID is required', 400));
        
        const user = await prisma.user.update({
            where: { id },
            data: { isVerified: true, status: 'Active' }
        });

        res.status(200).json({
            status: 'success',
            data: { user }
        });

        getIO().emit('user:changed', { action: 'verify', user });
        getIO().emit('security:access_request_resolved', { id, action: 'verified' });
    } catch (err) {
        next(err);
    }
};

export const denyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) return next(new AppError('User ID is required', 400));

        // In this context, deny means delete the pending application
        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({
            status: 'success',
            data: null
        });

        getIO().emit('user:changed', { action: 'delete', id });
        getIO().emit('security:access_request_resolved', { id, action: 'denied' });
    } catch (err) {
        next(err);
    }
};
