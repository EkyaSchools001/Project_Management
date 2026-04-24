import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../infrastructure/utils/AppError';

export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return next(new AppError('Forbidden: Insufficient permissions', 403));
        }
        next();
    };
};

export const restrictToCampus = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        // If no user, let protect middleware handle it
        if (!user) return next();

        const requestedCampusId = req.query?.campusId || req.body?.campusId || req.params?.campusId;

        // SUPERADMIN, ADMIN, TESTER can access any campus
        if (['SUPERADMIN', 'MANAGEMENT', 'ADMIN', 'TESTER'].includes(user.role)) {
            return next();
        }

        // COORDINATOR and SCHOOL_LEADER must only access their own campus
        if (['COORDINATOR', 'SCHOOL_LEADER'].includes(user.role)) {
            if (requestedCampusId && requestedCampusId !== user.campusId) {
                return next(new AppError('Forbidden: Access restricted to your campus only', 403));
            }
        }

        next();
    };
};

export const restrictToOwner = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        // If no user, let protect middleware handle it
        if (!user) return next();

        const requestedTeacherId = req.query?.teacherId || req.body?.teacherId || req.params?.teacherId;

        if (user.role === 'TEACHER') {
            if (requestedTeacherId && requestedTeacherId !== user.id) {
                return next(new AppError('Forbidden: Access restricted to your own data', 403));
            }
        }
        next();
    };
};
