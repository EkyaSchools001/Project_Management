import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { AppError } from '../../utils/AppError';
import { getIO } from '../../socket';
import { invalidateAccessMatrixCache } from '../../middlewares/accessControl';



// Get all settings
export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settings = await prisma.pDISystemSettings.findMany({
            orderBy: { updatedAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: settings.length,
            data: { settings }
        });
    } catch (err) {
        next(err);
    }
};

// Get a setting by key
export const getSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;

        const setting = await prisma.pDISystemSettings.findUnique({
            where: { key }
        });

        if (!setting) {
            // Provide a default access_matrix_config if not yet initialized
            if (key === 'access_matrix_config') {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        setting: {
                            key: 'access_matrix_config',
                            value: JSON.stringify({ accessMatrix: [], formFlows: [] })
                        }
                    }
                });
            }
            return next(new AppError('Setting not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { setting }
        });
    } catch (err) {
        next(err);
    }
};

// Upsert a setting (create or update)
export const upsertSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, value } = req.body;

        console.log(`[SETTINGS] Upserting key: ${key}`);

        const previousSetting = await prisma.pDISystemSettings.findUnique({ where: { key } });

        const setting = await prisma.pDISystemSettings.upsert({
            where: { key },
            update: {
                value: JSON.stringify(value)
            },
            create: {
                key,
                value: JSON.stringify(value)
            }
        });

        // Write to Action Audit Log
        if ((req as any).user) {
            await prisma.pDIAuditLog.create({
                data: {
                    actorId: (req as any).user.id || 'system',
                    actorName: (req as any).user.fullName || (req as any).user.role || 'SuperAdmin',
                    action: previousSetting ? 'UPDATED_SETTING' : 'CREATED_SETTING',
                    targetEntity: 'SystemSettings',
                    previousData: previousSetting ? previousSetting.value : null,
                    newData: setting.value,
                }
            });
            console.log(`[AUDIT] Action logged: ${key} by ${(req as any).user.id}`);
        }

        // Broadcast the update via Socket.io
        try {
            const io = getIO();
            const broadcastData = { key, value };
            console.log(`[SOCKET] Broadcasting SETTINGS_UPDATED:`, broadcastData);
            io.emit('SETTINGS_UPDATED', broadcastData);
            console.log(`[SOCKET] Broadcast complete to all clients`);
        } catch (socketErr) {
            console.error('[SOCKET] Failed to broadcast setting update:', socketErr);
        }

        // Immediately invalidate backend access matrix cache so API routes
        // use the new permissions on the very next request
        if (key === 'access_matrix_config') {
            invalidateAccessMatrixCache();
        }

        res.status(200).json({
            status: 'success',
            data: { setting }
        });
    } catch (err) {
        next(err);
    }
};

// Delete a setting
export const deleteSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;

        await prisma.pDISystemSettings.delete({
            where: { key }
        });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

// Download Full Database Backup
export const downloadBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const models = [
            'user', 'meeting', 'meetingAttendee', 'meetingMinutes', 'meetingActionItem',
            'meetingReply', 'meetingShare', 'observation', 'observationDomain', 'goal',
            'goalWindow', 'trainingEvent', 'registration', 'eventAttendance', 'trainingFeedback',
            'pDHour', 'moocSubmission', 'document', 'documentAcknowledgement', 'course',
            'courseEnrollment', 'systemSettings', 'dashboardLayout', 'formTemplate', 'notification',
            'announcement', 'announcementAcknowledgement', 'survey', 'surveyQuestion', 'surveyResponse',
            'surveyAnswer', 'postOrientationAssessment', 'learningFestival', 'learningFestivalApplication',
            'assessment', 'assessmentQuestion', 'assessmentAssignment', 'assessmentAttempt',
            'growthObservation', 'formWorkflow', 'auditLog', 'dashboard', 'dashboardWidget', 'widgetType'
        ];

        const backupData: Record<string, any[]> = {};

        for (const model of models) {
            // @ts-ignore
            if (prisma[model]) {
                // @ts-ignore
                backupData[model] = await prisma[model].findMany();
            }
        }

        res.status(200).json({
            status: 'success',
            data: backupData
        });
    } catch (err) {
        next(err);
    }
};

// Restore Database from JSON Backup
export const restoreFromBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const backupData = req.body;
        console.log('[RESTORE] Starting manual database restore...');

        const models = [
            'user', 'meeting', 'meetingAttendee', 'meetingMinutes', 'meetingActionItem',
            'meetingReply', 'meetingShare', 'observation', 'observationDomain', 'goal',
            'goalWindow', 'trainingEvent', 'registration', 'eventAttendance', 'trainingFeedback',
            'pDHour', 'moocSubmission', 'document', 'documentAcknowledgement', 'course',
            'courseEnrollment', 'systemSettings', 'dashboardLayout', 'formTemplate', 'notification',
            'announcement', 'announcementAcknowledgement', 'survey', 'surveyQuestion', 'surveyResponse',
            'surveyAnswer', 'postOrientationAssessment', 'learningFestival', 'learningFestivalApplication',
            'assessment', 'assessmentQuestion', 'assessmentAssignment', 'assessmentAttempt',
            'growthObservation', 'formWorkflow', 'auditLog', 'dashboard', 'dashboardWidget', 'widgetType'
        ];

        // We use a transaction to ensure atomic restore if possible, 
        // but since we are doing sequential upserts, we'll just iterate.
        for (const model of models) {
            const data = backupData[model];
            if (data && Array.isArray(data) && data.length > 0) {
                console.log(`[RESTORE] Restoring ${data.length} records for model: ${model}`);
                for (const item of data) {
                    // @ts-ignore
                    await prisma[model].upsert({
                        where: { id: item.id },
                        update: item,
                        create: item
                    });
                }
            }
        }

        console.log('[RESTORE] ✅ Restore successful');

        res.status(200).json({
            status: 'success',
            message: 'Database restored successfully'
        });
    } catch (err) {
        console.error('[RESTORE] ❌ Restore failed:', err);
        next(err);
    }
};
