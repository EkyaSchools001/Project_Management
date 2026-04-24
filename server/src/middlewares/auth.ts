import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { prisma } from '../app';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        fullName?: string;
        campusId?: string | null;
        campusAccess?: string | null;
        department?: any | null;
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

    // --- Mock Token Support for Local Dev ---
    if (token.startsWith('mock-token-')) {
        const mockId = token.replace('mock-token-', '');
        req.user = {
            id: mockId,
            role: 'SuperAdmin',
            fullName: 'Mock User',
            campusId: 'EBTM',
            campusAccess: 'EBTM',
            department: 'PD'
        };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key') as any;
        const userId = decoded.id || decoded.sub;

        if (!decoded || !userId) {
            return next(new AppError('Invalid token payload', 401));
        }

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, campusId: true, campusAccess: true, fullName: true, department: true }
        });

        if (!user) {
            console.warn(`[AUTH] Token for non-existent user ID: ${decoded.id}`);
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = user;
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

        // Check if the user has the exact required role, or falls into the right family/bucket
        // If they pass a specific new role, we just match it.
        // For backwards compatibility with PDI routes asking for "TEACHER", "LEADER", etc.
        const normalizedRoleBuckets: Record<string, string> = {
            'SCHOOL LEADER': 'HOS',
            'LEADER': 'HOS',
            'MANAGEMENT': 'MANAGEMENT',
            'COORDINATOR': 'COORDINATOR',
            'TEACHER': 'TEACHER_CORE', // Legacy mapping
            'ADMIN': 'ADMIN_OPS', // Legacy mapping
            'SUPERADMIN': 'SUPERADMIN'
        };

        // If the role isn't exactly matched, check if it maps to a legacy bucket, or is already a valid ERP role
        if (normalizedRoleBuckets[userRole]) {
            userRole = normalizedRoleBuckets[userRole];
        } else if (userRole.includes('TEACHER')) {
            userRole = 'TEACHER_CORE';
        } else if (userRole.includes('ADMIN') && userRole !== 'SUPERADMIN' && !userRole.startsWith('ADMIN_')) {
            userRole = 'ADMIN_OPS'; 
        } else if (userRole.includes('MANAGEMENT_ADMIN')) {
            userRole = 'MANAGEMENT';
        }

        const allowedRoles = roles.map(r => {
            let role = r.toUpperCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
            if (normalizedRoleBuckets[role]) return normalizedRoleBuckets[role];
            if (role.includes('TEACHER')) return 'TEACHER_CORE';
            if (role.includes('ADMIN') && role !== 'SUPERADMIN' && !role.startsWith('ADMIN_')) return 'ADMIN_OPS';
            return role;
        });

        // Always allow SUPERADMIN to everything
        if (userRole === 'SUPERADMIN' || userRole === 'SUPER ADMIN') {
            return next();
        }

        // Expand allowed roles: HOS is allowed everywhere COORDINATOR or TEACHER is. MANAGEMENT everywhere.
        // Instead of strict equality, we could do hierarchical, but for now stick to `allowedRoles.includes` or specific overrides
        const hierarchyMap: Record<string, string[]> = {
            'HOS': ['COORDINATOR', 'TEACHER_CORE', 'TEACHER_SPECIALIST', 'TEACHER_SENIOR', 'TEACHER_PARTTIME'],
            'MANAGEMENT': ['HOS', 'COORDINATOR', 'TEACHER_CORE', 'TEACHER_SPECIALIST', 'TEACHER_SENIOR', 'TEACHER_PARTTIME'],
            'COORDINATOR': ['TEACHER_CORE', 'TEACHER_SPECIALIST', 'TEACHER_SENIOR', 'TEACHER_PARTTIME']
        };

        let isAllowed = allowedRoles.includes(userRole);

        // Check if user role dominates any of the allowed roles
        if (!isAllowed && hierarchyMap[userRole]) {
            isAllowed = allowedRoles.some(ar => hierarchyMap[userRole].includes(ar));
        }

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
