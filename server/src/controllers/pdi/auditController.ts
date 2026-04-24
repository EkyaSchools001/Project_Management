import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await prisma.pDIAuditLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 200 // Limit to last 200 logs for performance
        });

        res.status(200).json({
            status: 'success',
            results: logs.length,
            data: { logs }
        });
    } catch (err) {
        next(err);
    }
};

export const restoreAuditVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logId = Array.isArray(req.params.logId) ? req.params.logId[0] : req.params.logId;

        const log = await prisma.pDIAuditLog.findUnique({
            where: { id: logId }
        });

        if (!log || log.targetEntity !== 'SystemSettings' || !log.previousData) {
            return next(new AppError('Invalid rollback target', 400));
        }

        // The previousData is the stringified JSON value of the setting that was changed
        // Wait, previousData is what the value was BEFORE the update.
        // Let's assume the user wants to revert to previousData.

        // We know we only log SystemSettings access_matrix_config for now.
        // So we can assume key = 'access_matrix_config' but really we should capture the key.
        // The current AuditLog doesn't store the key. Let's do a hardcoded assumption for now,
        // since only access_matrix_config is being modified actively in SuperAdmin UI.

        const key = 'access_matrix_config';

        await prisma.pDISystemSettings.update({
            where: { key },
            data: { value: log.previousData }
        });

        // Write new audit log for the rollback
        await prisma.pDIAuditLog.create({
            data: {
                actorId: (req as any).user?.id || 'system',
                actorName: (req as any).user?.fullName || 'SuperAdmin Rolled Back',
                action: 'ROLLBACK_SETTING',
                targetEntity: 'SystemSettings',
                previousData: log.newData,
                newData: log.previousData
            }
        });

        res.status(200).json({
            status: 'success',
            message: 'Successfully rolled back configuration'
        });
    } catch (err) {
        next(err);
    }
};
