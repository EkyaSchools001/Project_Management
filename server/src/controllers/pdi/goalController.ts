import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { UserRole } from '@prisma/client';
import { AuthRequest } from '../../middlewares/auth';
import { AppError } from '../../utils/AppError';
import { createGoalSchema } from '../../pdi/core/models/schemas';
import { createNotification } from './notificationController';
import { isWindowOpen } from './goalWindowController';
import { getIO } from '../../socket';
import { autoBackup } from '../../utils/pdi/autoBackup';

export const getAllGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        let filter: any = {};
        if (authReq.user?.role === UserRole.TEACHER_CORE) {
            filter.teacherId = authReq.user.id;
        } else if (authReq.user?.role === UserRole.HOS) {
            filter.OR = [
                { campus: authReq.user.campusId },
                { teacher: { campusId: authReq.user.campusId } }
            ];
        }

        const goals = await prisma.goal.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
            include: {
                teacher: {
                    select: {
                        fullName: true,
                        email: true,
                        academics: true,
                        campusId: true,
                        department: true
                    }
                }
            }
        });

        const formattedGoals = goals.map(g => ({
            ...g,
            campus: g.campus || (g.teacher as any)?.campusId || null,
            teacher: g.teacher?.fullName || 'Unknown Teacher',
            teacherEmail: g.teacherEmail || g.teacher?.email || null,
            teacherDepartment: g.teacher?.department || null,
            academics: g.teacher?.academics || 'CORE'
        }));

        res.status(200).json({
            status: 'success',
            results: formattedGoals.length,
            data: { goals: formattedGoals }
        });
    } catch (err) {
        next(err);
    }
};

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const result = createGoalSchema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError('Validation failed', 400));
        }

        const data = result.data;
        let teacherId = data.teacherId;

        if (authReq.user?.role !== UserRole.TEACHER_CORE && !teacherId && data.teacherEmail) {
            const targetTeacher = await prisma.user.findUnique({ where: { email: data.teacherEmail } });
            if (targetTeacher) {
                teacherId = targetTeacher.id;
            } else {
                return next(new AppError('Target teacher not found', 404));
            }
        }

        if (!teacherId) {
if (authReq.user?.role === UserRole.TEACHER_CORE) {
                teacherId = authReq.user.id;
            } else {
                return next(new AppError('A valid teacherId or teacherEmail is required', 400));
            }
        }

        const newGoal = await prisma.goal.create({
            data: {
                teacherId: teacherId,
                teacherEmail: data.teacherEmail || undefined,
                title: data.title,
                description: data.description || undefined,
                dueDate: data.dueDate,
                progress: data.progress ?? 0,
                status: data.status || 'SELF_REFLECTION_PENDING',
                isSchoolAligned: data.isSchoolAligned ?? false,
                category: data.category || undefined,
                assignedBy: authReq.user?.id,
                actionStep: data.actionStep || undefined,
                campus: data.campus || (authReq.user as any)?.campusId || undefined,
                academicType: data.academicType || 'CORE'
            }
        });

        const io = getIO();
        io.to(`user:${teacherId}`).emit('goal:created', {
            ...newGoal,
            teacher: (await prisma.user.findUnique({ where: { id: teacherId } }))?.fullName || 'Unknown Teacher'
        });
        // Also notify leaders of relevant campus
        if (newGoal.campus) {
            io.to(`campus:${newGoal.campus}`).emit('goal:created', newGoal);
        }

        // Notify teacher if goal was assigned by someone else and it's not a draft
        if (authReq.user?.role !== UserRole.TEACHER_CORE && newGoal.status !== 'DRAFT') {
            await createNotification({
                userId: teacherId,
                title: 'New Goal Assigned',
                message: `A new professional growth goal "${newGoal.title}" has been assigned to you by ${authReq.user?.fullName}.`,
                type: 'INFO',
                link: '/teacher/goals'
            });
        }

        // Full DB Auto-Backup
        await autoBackup();

        res.status(201).json({ status: 'success', data: { goal: newGoal } });
    } catch (err) {
        next(err);
    }
};

export const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params as { id: string };
        const { progress, status, title, description, dueDate, category, actionStep, campus, goalSettingForm, selfReflectionForm } = req.body;

        const existing = await prisma.goal.findUnique({ where: { id } });
        if (!existing) return next(new AppError('Goal not found', 404));

        if (authReq.user?.role === UserRole.TEACHER_CORE && existing.teacherId !== authReq.user.id) {
            return next(new AppError('Access denied', 403));
        }

        const updated = await prisma.goal.update({
            where: { id },
            data: {
                progress: typeof progress === 'number' ? progress : undefined,
                status: status || undefined,
                title: title || undefined,
                description: description || undefined,
                dueDate: dueDate || undefined,
                category: category || undefined,
                actionStep: actionStep || undefined,
                campus: campus || undefined,
                goalSettingForm: goalSettingForm ? (typeof goalSettingForm === 'string' ? JSON.stringify({ ...JSON.parse(goalSettingForm), adminOverride: true }) : JSON.stringify({ ...goalSettingForm, adminOverride: true })) : undefined,
                selfReflectionForm: selfReflectionForm ? (typeof selfReflectionForm === 'string' ? JSON.stringify({ ...JSON.parse(selfReflectionForm), adminOverride: true }) : JSON.stringify({ ...selfReflectionForm, adminOverride: true })) : undefined,
            }
        });

        const io = getIO();
        io.to(`user:${updated.teacherId}`).emit('goal:updated', updated);
        if (updated.campus) {
            io.to(`campus:${updated.campus}`).emit('goal:updated', updated);
        }

        // Notify teacher if goal was updated by someone else (e.g. by Leader/Admin)
        if (authReq.user?.role !== UserRole.TEACHER_CORE) {
            await createNotification({
                userId: updated.teacherId,
                title: 'Goal Updated',
                message: `Your goal "${updated.title}" has been updated by ${authReq.user?.fullName}.`,
                type: 'INFO',
                link: '/teacher/goals'
            });
        }

        // Full DB Auto-Backup
        await autoBackup();

        res.status(200).json({ status: 'success', data: { goal: updated } });
    } catch (err) {
        next(err);
    }
};

export const initiateSelfReflection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const teacherId = authReq.user?.id;

        if (!teacherId) return next(new AppError('Unauthorized', 401));

        if (!(await isWindowOpen('SELF_REFLECTION'))) {
            return next(new AppError('Self-reflection window is closed', 403));
        }

        const currentYear = new Date().getFullYear();
        const existing = await prisma.goal.findFirst({
            where: {
                teacherId,
                title: { contains: `Annual Professional Growth Reflection ${currentYear}` },
                status: { not: 'COMPLETED' }
            }
        });

        if (existing) {
            return res.status(200).json({ status: 'success', data: { goal: existing } });
        }

        const newGoal = await prisma.goal.create({
            data: {
                teacherId,
                title: `Annual Professional Growth Reflection ${currentYear}`,
                description: `Teacher-initiated self-reflection for the ${currentYear} academic year.`,
                status: 'SELF_REFLECTION_PENDING',
                academicType: (authReq.user as any)?.academics || 'CORE',
                campus: (authReq.user as any)?.campusId || undefined,
                dueDate: new Date(currentYear, 11, 31).toISOString() // Default to end of year
            }
        });

        res.status(201).json({ status: 'success', data: { goal: newGoal } });
    } catch (err) {
        next(err);
    }
};



export const submitSelfReflection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params as { id: string };
        const { reflectionData } = req.body;

        if (!(await isWindowOpen('SELF_REFLECTION'))) {
            return next(new AppError('Self-reflection window is closed', 403));
        }

        const goal = await prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.teacherId !== authReq.user?.id) {
            return next(new AppError('Goal not found or access denied', 404));
        }

        const updated = await prisma.goal.update({
            where: { id },
            data: {
                selfReflectionForm: JSON.stringify(reflectionData),
                selfReflectionCompletedAt: new Date(),
                status: 'SELF_REFLECTION_SUBMITTED',
                progress: 33
            }
        });

        const io = getIO();
        io.to(`user:${updated.teacherId}`).emit('goal:updated', updated);
        if (updated.campus) {
            io.to(`campus:${updated.campus}`).emit('goal:updated', updated);
        }

        // Notify HOS
        const teacher = await prisma.user.findUnique({ where: { id: goal.teacherId } });
        if (teacher?.campusId) {
            const hos = await prisma.user.findFirst({ where: { role: UserRole.HOS, campusId: teacher.campusId } });
            if (hos) {
                await createNotification({
                    userId: hos.id,
                    title: 'New Self-Reflection',
                    message: `${teacher.fullName} has submitted a self-reflection.`,
                    type: 'INFO',
                    link: `/leader/goals`
                });
            }
        }

        res.status(200).json({ status: 'success', data: { goal: updated } });
    } catch (err) {
        next(err);
    }
};

export const submitGoalSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const { settingData } = req.body;

        if (!(await isWindowOpen('GOAL_SETTING'))) {
            return next(new AppError('Goal setting window is closed', 403));
        }

        const goal = await prisma.goal.findUnique({ where: { id } });
        if (!goal) return next(new AppError('Goal not found', 404));

        if (goal.status !== 'SELF_REFLECTION_SUBMITTED') {
            return next(new AppError('Workflow violation: Self-reflection required first', 400));
        }

        const updated = await prisma.goal.update({
            where: { id },
            data: {
                goalSettingForm: JSON.stringify(settingData),
                goalSettingCompletedAt: new Date(),
                category: settingData.pillarTag || goal.category,
                actionStep: settingData.actionStep || goal.actionStep,
                dueDate: settingData.goalEndDate ? new Date(settingData.goalEndDate).toISOString() : goal.dueDate,
                status: 'GOAL_SET',
                progress: 66
            }
        });

        const io = getIO();
        io.to(`user:${updated.teacherId}`).emit('goal:updated', updated);
        if (updated.campus) {
            io.to(`campus:${updated.campus}`).emit('goal:updated', updated);
        }

        await createNotification({
            userId: goal.teacherId,
            title: 'Goal Expectations Set',
            message: `Expectations have been set for your goal: ${goal.title}`,
            type: 'INFO',
            link: '/teacher/goals'
        });

        res.status(200).json({ status: 'success', data: { goal: updated } });
    } catch (err) {
        next(err);
    }
};

export const submitGoalCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const { completionData, status: finalStatus } = req.body;

        if (!(await isWindowOpen('GOAL_COMPLETION'))) {
            return next(new AppError('Goal completion window is closed', 403));
        }

        const goal = await prisma.goal.findUnique({ where: { id } });
        if (!goal) return next(new AppError('Goal not found', 404));

        if (goal.status !== 'GOAL_SET') {
            return next(new AppError('Workflow violation: Goal setting required first', 400));
        }

        const updated = await prisma.goal.update({
            where: { id },
            data: {
                goalCompletionForm: JSON.stringify(completionData),
                goalCompletionCompletedAt: new Date(),
                status: finalStatus,
                progress: finalStatus === 'GOAL_COMPLETED' ? 100 : finalStatus === 'PARTIALLY_MET' ? 50 : 0
            }
        });

        const io = getIO();
        io.emit('goal:updated', updated);

        await createNotification({
            userId: goal.teacherId,
            title: 'Goal Finalized',
            message: `Evaluation completed for: ${goal.title}. Status: ${finalStatus}`,
            type: 'SUCCESS',
            link: '/teacher/goals'
        });

        res.status(200).json({ status: 'success', data: { goal: updated } });
    } catch (err) {
        next(err);
    }
};

export const getGoalAnalyticsDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const campusId = req.query.campusId as string | undefined;

        let filter: any = {};
        if (authReq.user?.role === UserRole.HOS) {
            filter = { OR: [{ campus: authReq.user.campusId }, { teacher: { campusId: authReq.user.campusId } }] };
        } else if (campusId) {
            filter = { OR: [{ campus: campusId }, { teacher: { campusId: campusId } }] };
        }

        const allGoals = await prisma.goal.findMany({
            where: filter,
            include: { teacher: { select: { campusId: true, fullName: true, role: true } } }
        });

        const total = allGoals.length;
        const reflected = allGoals.filter(g => g.status === 'SELF_REFLECTION_SUBMITTED' || g.status === 'GOAL_SET' || g.status === 'GOAL_COMPLETED' || g.status === 'PARTIALLY_MET' || g.status === 'NOT_MET').length;
        const set = allGoals.filter(g => ['GOAL_SET', 'GOAL_COMPLETED', 'PARTIALLY_MET', 'NOT_MET'].includes(g.status)).length;
        const completed = allGoals.filter(g => ['GOAL_COMPLETED', 'PARTIALLY_MET', 'NOT_MET'].includes(g.status)).length;

        res.status(200).json({
            status: 'success',
            data: {
                summary: {
                    total,
                    reflectionRate: total > 0 ? (reflected / total) * 100 : 0,
                    settingRate: total > 0 ? (set / total) * 100 : 0,
                    completionRate: total > 0 ? (completed / total) * 100 : 0
                },
                goals: allGoals
            }
        });
    } catch (err) {
        next(err);
    }
};

export const notifyWindowOpen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: UserRole.TEACHER_CORE },
            select: { id: true }
        });

        for (const t of teachers) {
            await createNotification({
                userId: t.id,
                title: 'Goal Window Open',
                message: 'A new goal submission window has been opened.',
                type: 'INFO',
                link: '/teacher/goals'
            });
        }

        res.status(200).json({ status: 'success', message: 'Notifications sent' });
    } catch (err) {
        next(err);
    }
};

export const requestWindowOpen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        const userName = authReq.user?.fullName || 'A user';
        const userRole = authReq.user?.role || 'User';

        if (!userId) return next(new AppError('Unauthorized', 401));

        // Find admins to notify
        const admins = await prisma.user.findMany({
            where: {
                role: { in: [UserRole.SUPER_ADMIN, UserRole.MANAGEMENT] }
            },
            select: { id: true }
        });

        if (admins.length === 0) {
            return next(new AppError('No administrators found to notify', 404));
        }

        const roleDisplay = userRole.charAt(0) + userRole.slice(1).toLowerCase();

        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                title: 'Goal Window Request',
                message: `${userName} (${roleDisplay}) has requested to open the goal windows.`,
                type: 'WARNING',
                link: '/admin/settings' // Assuming settings page has window controls
            });
        }

        res.status(200).json({ status: 'success', message: 'Request sent to administrators' });
    } catch (err) {
        next(err);
    }
};
