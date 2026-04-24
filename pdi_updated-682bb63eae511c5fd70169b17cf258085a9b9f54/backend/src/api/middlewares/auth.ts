import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../infrastructure/utils/AppError';
import prisma from '../../infrastructure/database/prisma';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        fullName?: string;
        campusId?: string | null;
        campusAccess?: string | null;
        department?: string | null;
    };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret as string) as AuthRequest['user'];
        if (!decoded || !decoded.id) {
            console.error('[AUTH] Token verification succeeded but ID missing');
            return next(new AppError('Invalid token payload', 401));
        }

        console.log(`[AUTH] Verifying user ID: ${decoded.id}`);
        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, role: true, campusId: true, campusAccess: true, fullName: true, department: true }
        });

        if (!user) {
            console.warn(`[AUTH] User not found: ${decoded.id}`);
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = user;
        console.log(`[AUTH] Success for: ${user.fullName}`);
        next();
    } catch (err: any) {
        console.error('JWT Verification Failed:', err.message);
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const rawRole = req.user?.role || '';
        // Remove underscores and multiple spaces for normalization
        let userRole = rawRole.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

        // Final normalization to base roles
        if (userRole.includes('SCHOOL LEADER') || userRole === 'LEADER') {
            userRole = 'LEADER';
        } else if (userRole.includes('MANAGEMENT') || userRole === 'MANAGEMENT') {
            userRole = 'MANAGEMENT';
        } else if (userRole.includes('TEACHER') || userRole === 'TEACHER') {
            userRole = 'TEACHER';
        } else if (userRole.includes('COORDINATOR') || userRole === 'COORDINATOR') {
            userRole = 'COORDINATOR';
        } else if (userRole.includes('ADMIN') && userRole !== 'SUPERADMIN') {
            userRole = 'ADMIN';
        }

        const allowedRoles = roles.map(r => {
            let role = r.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
            if (role.includes('SCHOOL LEADER') || role === 'LEADER') return 'LEADER';
            if (role.includes('MANAGEMENT') || role === 'MANAGEMENT') return 'MANAGEMENT';
            if (role.includes('TEACHER') || role === 'TEACHER') return 'TEACHER';
            if (role.includes('COORDINATOR') || role === 'COORDINATOR') return 'COORDINATOR';
            if (role.includes('ADMIN') && role !== 'SUPERADMIN') return 'ADMIN';
            return role;
        });

        // Always allow SUPERADMIN to everything
        if (userRole === 'SUPERADMIN') {
            return next();
        }

        const isAllowed = allowedRoles.includes(userRole);

        console.log(`[AUTH-DEBUG] Raw: '${rawRole}' -> Normalized: '${userRole}' | Required: [${allowedRoles.join(', ')}] | Result: ${isAllowed ? 'PASS' : 'FAIL'}`);

        if (!req.user || !isAllowed) {
            console.warn(`[AUTH] Access denied. User Role: '${userRole}', Required: [${allowedRoles.join(', ')}]`);
            return next(
                new AppError(`Permission denied. Role '${userRole}' is not authorized. Required: [${allowedRoles.join(', ')}]`, 403)
            );
        }
        next();
    };
};
