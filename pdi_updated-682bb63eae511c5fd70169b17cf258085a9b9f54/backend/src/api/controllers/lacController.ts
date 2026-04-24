import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';

const getTargetCampusUuid = async (idOrName: string | undefined) => {
    if (!idOrName) return undefined;
    const campus = await prisma.lacCampus.findFirst({
        where: {
            OR: [
                { id: idOrName },
                { name: idOrName }
            ]
        }
    });
    return campus?.id;
};

export const getLacTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subject, week, status, campusId, teacherId } = req.query;
        const user = (req as any).user;

        let targetCampusId = campusId as string;
        if (!['SUPERADMIN', 'MANAGEMENT', 'ADMIN', 'TESTER'].includes(user.role)) {
            targetCampusId = user.campusId;
        }

        const campusUuid = await getTargetCampusUuid(targetCampusId);

        const tasks = await prisma.lacTask.findMany({
            where: {
                ...(campusUuid && { campusId: campusUuid }),
                ...(subject && { subjectId: subject as string }),
                ...(week && { week: parseInt(week as string) }),
            },
            include: {
                subject: true,
                statuses: {
                    where: {
                        ...(campusUuid && { campusId: campusUuid }),
                        ...(status && { status: status as string }),
                        ...(teacherId && { teacherId: teacherId as string })
                    },
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                fullName: true,
                                campusId: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

export const updateLacTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, published, scoreEntered, evidence, teacherId, campusId } = req.body;

        const campusUuid = await getTargetCampusUuid(campusId as string);

        if (!campusUuid) {
            throw new AppError('Invalid campus specified', 400);
        }

        const taskStatus = await prisma.lacTaskStatus.upsert({
            where: {
                taskId_campusId_teacherId: {
                    taskId: id as string,
                    campusId: campusUuid,
                    teacherId: teacherId as string
                }
            },
            update: {
                ...(status && { status }),
                ...(published !== undefined && { published }),
                ...(scoreEntered !== undefined && { scoreEntered }),
                ...(evidence !== undefined && { evidence }),
            },
            create: {
                taskId: id as string,
                campusId: campusUuid,
                teacherId: teacherId as string,
                status: status || 'Pending',
                published: published || false,
                scoreEntered: scoreEntered || false,
                evidence: evidence || false,
            }
        });

        res.status(200).json({
            status: 'success',
            data: taskStatus
        });
    } catch (error) {
        next(error);
    }
};

export const getLacDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { campusId } = req.query;
        const user = (req as any).user;

        const isTeacher = user.role === 'TEACHER';
        let targetCampusId = campusId as string;
        if (!['SUPERADMIN', 'MANAGEMENT', 'ADMIN', 'TESTER'].includes(user.role)) {
            targetCampusId = user.campusId;
        }

        const campusUuid = await getTargetCampusUuid(targetCampusId);
        const baseFilter: any = {
            ...(campusUuid && { campusId: campusUuid }),
            ...(isTeacher && { teacherId: user.id })
        };

        // If it's a teacher, total tasks are only those assigned to them
        const totalTasks = isTeacher
            ? await prisma.lacTaskStatus.count({ where: baseFilter })
            : await prisma.lacTask.count({ where: campusUuid ? { campusId: campusUuid } : {} });

        const statusCounts = await prisma.lacTaskStatus.groupBy({
            by: ['status'],
            where: baseFilter,
            _count: true
        });

        const gradedTasks = await prisma.lacTaskStatus.count({
            where: { ...baseFilter, scoreEntered: true }
        });

        const teacherCount = isTeacher ? 1 : (await prisma.lacTaskStatus.findMany({
            where: baseFilter,
            select: { teacherId: true },
            distinct: ['teacherId']
        })).length;

        // Per-subject breakdown
        const subjects = await prisma.lacSubject.findMany({
            include: {
                tasks: {
                    include: {
                        statuses: {
                            where: baseFilter,
                            include: {
                                teacher: { select: { id: true, fullName: true } }
                            }
                        }
                    }
                }
            }
        });

        const subjectBreakdown = subjects.map((subject: any) => {
            const allStatuses = subject.tasks.flatMap((t: any) => t.statuses);
            const totalSubjectTasks = isTeacher ? allStatuses.length : subject.tasks.length;
            const completedCount = allStatuses.filter((s: any) => s.status === 'Complete').length;
            const percentage = totalSubjectTasks > 0
                ? Math.round((completedCount / totalSubjectTasks) * 100)
                : 0;

            const teacherNames = allStatuses.map((s: any) => s.teacher?.fullName).filter(Boolean);
            const teacherName = teacherNames.length > 0
                ? teacherNames.reduce((a: string, b: string, _: any, arr: string[]) =>
                    arr.filter((v: string) => v === a).length >= arr.filter((v: string) => v === b).length ? a : b,
                    teacherNames[0]
                )
                : (isTeacher ? user.fullName : 'Unassigned');

            return {
                subjectId: subject.id,
                subjectName: subject.name,
                teacherName,
                completedTasks: completedCount,
                totalTasks: totalSubjectTasks,
                percentage
            };
        }).filter((s: any) => s.totalTasks > 0);

        // Per-campus breakdown (only for admins/superadmin)
        let campusBreakdown: any[] = [];
        if (['SUPERADMIN', 'MANAGEMENT', 'ADMIN', 'TESTER'].includes(user.role)) {
            const campuses = await prisma.lacCampus.findMany();
            campusBreakdown = await Promise.all(campuses.map(async (campus: any) => {
                const statuses = await prisma.lacTaskStatus.findMany({
                    where: { campusId: campus.id },
                    select: { status: true, teacherId: true }
                });
                const totalCampusTasks = statuses.length;
                const completedCampusTasks = statuses.filter((s: any) => s.status === 'Complete').length;
                const uniqueTeachers = new Set(statuses.map((s: any) => s.teacherId)).size;
                const percentage = totalCampusTasks > 0
                    ? Math.round((completedCampusTasks / totalCampusTasks) * 100)
                    : 0;
                return {
                    campusId: campus.id,
                    campusName: campus.name,
                    completedTasks: completedCampusTasks,
                    totalTasks: totalCampusTasks,
                    teacherCount: uniqueTeachers,
                    percentage
                };
            }));
            campusBreakdown = campusBreakdown.filter((c: any) => c.totalTasks > 0);
        }

        res.status(200).json({
            status: 'success',
            data: {
                totalTasks,
                statusCounts,
                gradedTasks,
                teacherCount,
                subjectBreakdown,
                campusBreakdown
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getMyLacTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { subject, week, status } = req.query;

        const myTasks = await prisma.lacTaskStatus.findMany({
            where: {
                teacherId: userId,
                ...(status && { status: status as string }),
                task: {
                    ...(subject && { subjectId: subject as string }),
                    ...(week && { week: parseInt(week as string) }),
                }
            },
            include: {
                task: {
                    include: { subject: true }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: myTasks
        });
    } catch (error) {
        next(error);
    }
};

export const getLacSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjects = await prisma.lacSubject.findMany();
        res.status(200).json({
            status: 'success',
            data: subjects
        });
    } catch (error) {
        next(error);
    }
};

export const getLacCampuses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const campuses = await prisma.lacCampus.findMany();
        res.status(200).json({
            status: 'success',
            data: campuses
        });
    } catch (error) {
        next(error);
    }
};

export const assignLacTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId, teacherId, campusId } = req.body;
        const user = (req as any).user;

        if (!taskId || !teacherId || !campusId) {
            throw new AppError('taskId, teacherId, and campusId are required', 400);
        }

        // Resolve campus UUID
        const campusUuid = await getTargetCampusUuid(campusId);
        if (!campusUuid) throw new AppError('Invalid campus specified', 400);

        // Ensure school-scoped users can only assign tasks within their campus
        if (['COORDINATOR', 'SCHOOL_LEADER', 'LEADER'].includes(user.role)) {
            const userCampusUuid = await getTargetCampusUuid(user.campusId);
            if (campusUuid !== userCampusUuid) {
                throw new AppError('You can only assign tasks within your campus', 403);
            }
        }

        // Ensure teacher belongs to the campus
        const teacher = await prisma.user.findFirst({
            where: { id: teacherId, role: 'TEACHER' }
        });
        if (!teacher) throw new AppError('Teacher not found', 404);

        // Upsert: assign (or re-activate) the task for this teacher
        const taskStatus = await prisma.lacTaskStatus.upsert({
            where: {
                taskId_teacherId_campusId: {
                    taskId,
                    teacherId,
                    campusId: campusUuid
                }
            },
            update: {
                status: 'Pending'
            },
            create: {
                taskId,
                teacherId,
                campusId: campusUuid,
                status: 'Pending',
                published: true,
                scoreEntered: false,
                evidence: false
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Task assigned successfully',
            data: taskStatus
        });
    } catch (error) {
        next(error);
    }
};


export const getLacTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { campusId } = req.query;
        const user = (req as any).user;

        const isSuperUser = ['SUPERADMIN', 'MANAGEMENT', 'ADMIN'].includes(user.role);
        const isSchoolScoped = ['COORDINATOR', 'SCHOOL_LEADER', 'LEADER'].includes(user.role);

        const campuses = await prisma.lacCampus.findMany();

        // Determine which campusId to scope to
        let targetCampusId: string | undefined;
        let campusNameFilter: string | undefined;

        if (isSuperUser) {
            targetCampusId = campusId ? (campusId as string) : undefined;
        } else if (isSchoolScoped) {
            targetCampusId = user.campusId;
        }

        if (targetCampusId) {
            const selectedCampus = campuses.find(c => c.id === targetCampusId || c.name === targetCampusId);
            if (selectedCampus) {
                campusNameFilter = selectedCampus.name;
            } else {
                campusNameFilter = targetCampusId;
            }
        }

        const teachers = await prisma.user.findMany({
            where: {
                role: 'TEACHER',
                ...(campusNameFilter && { campusId: campusNameFilter }),
            },
            include: {
                lacStatuses: {
                    include: { task: { include: { subject: true } } }
                }
            },
            orderBy: { fullName: 'asc' }
        });

        const formatted = teachers.map((t: any) => {
            const totalTasks = t.lacStatuses.length;
            const completedTasks = t.lacStatuses.filter((s: any) => s.status === 'Complete').length;
            const inProgressTasks = t.lacStatuses.filter((s: any) => s.status === 'In Progress').length;
            const subjects = Array.from(new Set(
                t.lacStatuses.map((s: any) => s.task?.subject?.name).filter(Boolean)
            ));

            const campusObj = campuses.find(c => c.name === t.campusId);

            return {
                teacherId: t.id,
                name: t.fullName,
                email: t.email,
                campusId: t.campusId,
                campus: campusObj ? campusObj.name : (t.campusId || 'Unassigned'),
                subject: subjects.join(', ') || 'No LAC Tasks',
                totalTasks,
                completedTasks,
                inProgressTasks,
                completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
            };
        });

        res.status(200).json({
            status: 'success',
            data: formatted
        });
    } catch (error) {
        next(error);
    }
};
