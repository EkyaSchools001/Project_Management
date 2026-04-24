import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [totalUsers, totalTrainingEvents, totalForms, totalCourses] = await Promise.all([
            prisma.user.count(),
            prisma.trainingEvent.count(),
            prisma.formTemplate.count(),
            prisma.course.count()
        ]);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newUsersThisMonth = await prisma.user.count({
            where: { createdAt: { gte: startOfMonth } }
        });

        const newEventsThisMonth = await prisma.trainingEvent.count({
            where: { date: { gte: startOfMonth.toISOString() } }
        });

        const newCoursesThisMonth = await prisma.course.count({
            where: { createdAt: { gte: startOfMonth } }
        });

        res.status(200).json({
            status: 'success',
            data: {
                users: { total: totalUsers, new: newUsersThisMonth },
                training: { total: totalTrainingEvents, thisMonth: newEventsThisMonth },
                forms: { active: totalForms, total: totalForms },
                courses: { total: totalCourses, new: newCoursesThisMonth }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [users, templates, courses, events] = await Promise.all([
            prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, email: true, role: true, createdAt: true } }),
            prisma.formTemplate.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
            prisma.course.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
            prisma.trainingEvent.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, type: true, createdAt: true, createdBy: { select: { email: true } } } })
        ]);

        const activities = [
            ...users.map(u => ({ id: `u-${u.id}`, action: 'User registered', user: u.email, target: `${u.fullName} as ${u.role}`, time: u.createdAt })),
            ...templates.map(t => ({ id: `t-${t.id}`, action: 'Form template created', user: 'admin@school.edu', target: t.name, time: t.createdAt })),
            ...courses.map(c => ({ id: `c-${c.id}`, action: 'Course added', user: 'admin@school.edu', target: c.title, time: c.createdAt })),
            ...events.map(e => ({ id: `e-${e.id}`, action: 'Training event scheduled', user: e.createdBy?.email || 'admin@school.edu', target: e.title, time: e.createdAt }))
        ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()).slice(0, 10);

        res.status(200).json({ status: 'success', data: activities });
    } catch (error) {
        next(error);
    }
};

export const getAdminPendingActions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [recentUsers, pendingObservations, recentEnrollments, recentRSVPs] = await Promise.all([
            prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
            prisma.observation.findMany({ where: { status: 'SUBMITTED' }, take: 5, orderBy: { createdAt: 'desc' }, include: { teacher: { select: { fullName: true } } } }),
            prisma.courseEnrollment.findMany({ take: 5, orderBy: { enrolledAt: 'desc' }, include: { user: { select: { fullName: true } }, course: { select: { title: true } } } }),
            prisma.registration.findMany({ take: 5, orderBy: { registrationDate: 'desc' }, include: { user: { select: { fullName: true } }, event: { select: { title: true, date: true } } } })
        ]);

        const pendingFormsCount = await prisma.observation.count({ where: { status: 'SUBMITTED' } });

        res.status(200).json({
            status: 'success',
            data: {
                registrations: recentUsers,
                forms: {
                    count: pendingFormsCount,
                    previews: pendingObservations.map(o => ({ 
                        title: o.domain, 
                        author: o.teacher?.fullName || 'Deleted Teacher', 
                        status: 'Waiting' 
                    }))
                },
                enrollments: recentEnrollments.map(e => ({ 
                    user: e.user?.fullName || 'Deleted User', 
                    course: e.course?.title || 'Deleted Course', 
                    date: e.enrolledAt 
                })),
                rsvps: recentRSVPs.map(r => ({ 
                    event: r.event?.title || 'Deleted Event', 
                    user: r.user?.fullName || 'Deleted User', 
                    status: 'Going' 
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getCoordinatorStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { campusId, multi_campus } = (req as any).user;
        const selectedCampus = req.query.campusId as string;

        // Determine filtering logic
        let whereClause: any = {};
        if (selectedCampus && selectedCampus !== 'all') {
            whereClause = { campusId: selectedCampus };
        } else if (!multi_campus && campusId) {
            whereClause = { campusId: campusId };
        }

        const [totalTeachers, trainingEvents] = await Promise.all([
            prisma.user.count({ where: { ...whereClause, role: 'TEACHER' } }),
            prisma.trainingEvent.count({ where: whereClause })
        ]);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const obsThisMonth = await prisma.observation.count({
            where: {
                ...whereClause,
                createdAt: { gte: startOfMonth }
            }
        });

        // Goal status for Pie Chart
        const goalStats = await prisma.goal.groupBy({
            by: ['status'],
            where: whereClause,
            _count: {
                id: true
            }
        });

        const goals = {
            pending: goalStats.find(s => s.status === 'PENDING')?._count.id || 0,
            submitted: goalStats.find(s => s.status === 'SUBMITTED' || s.status === 'IN_PROGRESS')?._count.id || 0,
            reviewed: goalStats.find(s => s.status === 'APPROVED' || s.status === 'COMPLETED')?._count.id || 0
        };

        res.status(200).json({
            status: 'success',
            data: {
                teachers: { total: totalTeachers },
                observations: { thisMonth: obsThisMonth },
                training: { totalEvents: trainingEvents },
                goals: goals,
                pdiPoints: 1250, // Mock for now as per dashboard designs
                assessments: 24  // Mock for now
            }
        });
    } catch (error) {
        next(error);
    }
};
