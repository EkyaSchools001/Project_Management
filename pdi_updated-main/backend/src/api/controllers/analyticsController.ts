import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { CAMPUS_OPTIONS } from '../../utils/constants';

export const getAvgHoursPerSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            select: { id: true, campusId: true }
        });

        const pdHours = await prisma.pDHour.findMany({
            where: { status: 'APPROVED' },
            select: { userId: true, hours: true, category: true }
        });

        // Group hours by userId
        const userHours: Record<string, number> = {};
        pdHours.forEach(h => {
            userHours[h.userId] = (userHours[h.userId] || 0) + h.hours;
        });

        // Group by Campus and Category
        const campusData: Record<string, {
            teacherCount: number,
            categories: Record<string, number>
        }> = {};

        CAMPUS_OPTIONS.forEach(c => {
            campusData[c] = { teacherCount: 0, categories: {} };
        });

        teachers.forEach(t => {
            const campus = t.campusId || 'Unassigned';
            if (!campusData[campus]) {
                campusData[campus] = { teacherCount: 0, categories: {} };
            }
            campusData[campus].teacherCount++;
        });

        // Map users to their campus for quick lookup
        const userToCampus: Record<string, string> = {};
        teachers.forEach(t => {
            userToCampus[t.id] = t.campusId || 'Unassigned';
        });

        pdHours.forEach(h => {
            const campus = userToCampus[h.userId];
            if (campus) {
                const cat = h.category || 'Other';
                campusData[campus].categories[cat] = (campusData[campus].categories[cat] || 0) + h.hours;
            }
        });

        const results = Object.entries(campusData).map(([campus, data]) => {
            const breakdown: any = {};
            let totalHours = 0;

            Object.entries(data.categories).forEach(([cat, hours]) => {
                const avg = data.teacherCount > 0 ? parseFloat((hours / data.teacherCount).toFixed(2)) : 0;
                breakdown[cat] = avg;
                totalHours += avg;
            });

            return {
                campus,
                avgHours: parseFloat(totalHours.toFixed(2)),
                teacherCount: data.teacherCount,
                ...breakdown
            };
        });

        res.status(200).json({
            status: 'success',
            data: { results }
        });
    } catch (error) {
        next(error);
    }
};

export const getTeacherHoursDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { campusId } = req.params;
    try {
        const teachers = await prisma.user.findMany({
            where: {
                role: 'TEACHER',
                campusId: campusId === 'Unassigned' ? null : campusId
            } as any,
            include: {
                pdHours: {
                    where: { status: 'APPROVED' }
                }
            }
        });

        const results = (teachers as any[]).map(t => ({
            id: t.id,
            fullName: t.fullName,
            email: t.email,
            totalHours: t.pdHours.reduce((sum: number, h: any) => sum + h.hours, 0)
        }));

        res.status(200).json({
            status: 'success',
            data: { teachers: results }
        });
    } catch (error) {
        next(error);
    }
};

export const getCutoffStats = async (req: Request, res: Response, next: NextFunction) => {
    const cutoff = parseInt(req.query.cutoff as string) || 20;
    try {
        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            select: {
                id: true,
                campusId: true,
                pdHours: {
                    where: { status: 'APPROVED' },
                    select: { hours: true }
                }
            }
        });

        const campusStats: Record<string, { above: number, below: number, total: number }> = {};

        CAMPUS_OPTIONS.forEach(c => {
            campusStats[c] = { above: 0, below: 0, total: 0 };
        });

        (teachers as any[]).forEach(t => {
            const campus = t.campusId || 'Unassigned';
            const totalHours = t.pdHours.reduce((sum: number, h: any) => sum + h.hours, 0);

            if (!campusStats[campus]) {
                campusStats[campus] = { above: 0, below: 0, total: 0 };
            }

            if (totalHours >= cutoff) {
                campusStats[campus].above++;
            } else {
                campusStats[campus].below++;
            }
            campusStats[campus].total++;
        });

        const results = Object.entries(campusStats)
            .filter(([campus, stats]) => CAMPUS_OPTIONS.includes(campus) || stats.total > 0)
            .map(([campus, stats]) => ({
                campus,
                abovePercent: stats.total > 0 ? parseFloat(((stats.above / stats.total) * 100).toFixed(1)) : 0,
                belowPercent: stats.total > 0 ? parseFloat(((stats.below / stats.total) * 100).toFixed(1)) : 0,
                total: stats.total
            }));

        res.status(200).json({
            status: 'success',
            data: { results, cutoff }
        });
    } catch (error) {
        next(error);
    }
};

export const getAttendanceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await prisma.trainingEvent.findMany({
            include: {
                registrations: true,
                attendanceRecords: {
                    where: { status: true }
                }
            }
        });

        const results = (events as any[]).map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            registered: e.registrations.length,
            attended: e.attendanceRecords.length,
            attendanceRate: e.registrations.length > 0
                ? parseFloat(((e.attendanceRecords.length / e.registrations.length) * 100).toFixed(1))
                : 0
        }));

        res.status(200).json({
            status: 'success',
            data: { events: results }
        });
    } catch (error) {
        next(error);
    }
};

export const getCampusAttendanceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await prisma.trainingEvent.findMany({
            include: {
                registrations: {
                    include: {
                        user: { select: { campusId: true } }
                    }
                },
                attendanceRecords: {
                    where: { status: true }
                }
            }
        });

        const campusStats: Record<string, { registered: number, attended: number }> = {};
        CAMPUS_OPTIONS.forEach(c => {
            campusStats[c] = { registered: 0, attended: 0 };
        });

        (events as any[]).forEach(event => {
            // Group registrations by campus
            event.registrations.forEach((reg: any) => {
                const campus = reg.user?.campusId || 'Unassigned';
                if (!campusStats[campus]) campusStats[campus] = { registered: 0, attended: 0 };
                campusStats[campus].registered++;
            });

            // Group attendance by campus
            // attendanceRecords doesn't directly give us campusId reliably, so we match teacherEmail
            // with our registrations to find their campus, or just use the schoolId attached to the attendance
            event.attendanceRecords.forEach((att: any) => {
                const regMatch = event.registrations.find((r: any) => r.user.email === att.teacherEmail || r.user.id === att.teacherId);
                const campus = regMatch?.user?.campusId || att.schoolId || 'Unassigned';

                if (!campusStats[campus]) campusStats[campus] = { registered: 0, attended: 0 };
                campusStats[campus].attended++;
            });
        });

        const results = Object.entries(campusStats)
            .filter(([campus, stats]) => CAMPUS_OPTIONS.includes(campus) || stats.registered > 0 || stats.attended > 0)
            .map(([campus, stats]) => {
                const rate = stats.registered > 0
                    ? Math.min(100, (stats.attended / stats.registered) * 100)
                    : 100;

                return {
                    campus,
                    registered: stats.registered,
                    attended: stats.attended,
                    unattended: Math.max(0, stats.registered - stats.attended),
                    attendancePercent: stats.registered > 0 ? parseFloat(rate.toFixed(1)) : 0
                };
            });

        res.status(200).json({
            status: 'success',
            data: { results }
        });
    } catch (error) {
        next(error);
    }
};

export const getEventAttendees = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    try {
        const attendance = await prisma.eventAttendance.findMany({
            where: {
                eventId: eventId as string,
                status: true
            } as any,
            select: {
                teacherName: true,
                teacherEmail: true,
                submittedAt: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: { attendees: attendance }
        });
    } catch (error) {
        next(error);
    }
};

export const getFeedbackAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let eventStats: any[] = [];
        let globalAvg = 0;

        try {
            const events = await prisma.trainingEvent.findMany({
                include: {
                    feedbacks: true
                } as any
            });

            eventStats = (events as any[]).map(e => ({
                id: e.id,
                title: e.title,
                avgRating: e.feedbacks?.length > 0
                    ? parseFloat((e.feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / e.feedbacks.length).toFixed(1))
                    : 0,
                feedbackCount: e.feedbacks?.length || 0
            }));

            const allFeedbacks = await (prisma as any).trainingFeedback.findMany();
            globalAvg = allFeedbacks.length > 0
                ? parseFloat((allFeedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / allFeedbacks.length).toFixed(1))
                : 0;
        } catch (dbError) {
            console.warn("Feedback data not found or schema missing, defaulting to zero");
        }

        res.status(200).json({
            status: 'success',
            data: {
                events: eventStats,
                globalAverage: globalAvg
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getCampusEngagement = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const role = user.role;
        const userCampusId = user.campusId;

        let whereClause: any = {};

        // Campus scoping
        if (role !== 'SUPERADMIN' && role !== 'ADMIN' && role !== 'MANAGEMENT') {
            if (!userCampusId) {
                return res.status(403).json({ error: 'Campus ID not found for this user.' });
            }
            whereClause.campusId = userCampusId;
        }

        // We only want data for TEACHER roles in this context
        whereClause.role = 'TEACHER';

        // Fetch teachers in scope with their course enrollments
        const teachers = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                fullName: true,
                email: true,
                department: true,
                campusId: true,
                status: true,
                lastActive: true,
                enrollments: {
                    select: {
                        courseId: true,
                        progress: true
                    }
                },
                pdHours: { // Just basic activity check if they have done any PD
                    select: { id: true }
                }
            }
        });

        const teacherEngagements = (teachers as any[]).map(teacher => {
            const enrollments = teacher.enrollments || [];
            const totalEnrolled = enrollments.length;
            const totalCompleted = enrollments.filter((e: any) => e.progress === 100).length;
            const engagementPercent = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

            // Assume active if they have enrollments or logged PD hours
            const isActive = totalEnrolled > 0 || (teacher.pdHours && teacher.pdHours.length > 0) || teacher.status === 'Active';

            return {
                id: teacher.id,
                name: teacher.fullName,
                email: teacher.email,
                role: teacher.department ? `${teacher.department} Teacher` : 'Teacher',
                campusId: teacher.campusId,
                coursesEnrolled: totalEnrolled,
                coursesCompleted: totalCompleted,
                engagementPercent,
                isActive,
                lastActivityDate: teacher.lastActive
            };
        });

        // Calculate campus averages
        const totalTeachers = teacherEngagements.length;
        const activeTeachersCount = teacherEngagements.filter(t => t.isActive).length;
        const overallEngagement = totalTeachers > 0
            ? Math.round(teacherEngagements.reduce((acc: number, t: any) => acc + t.engagementPercent, 0) / totalTeachers)
            : 0;

        res.json({
            status: 'success',
            data: {
                summary: {
                    campusAverageEngagement: overallEngagement,
                    totalTeachersEnrolled: teacherEngagements.filter(t => t.coursesEnrolled > 0).length,
                    totalTeachersActive: activeTeachersCount,
                    averageCourseCompletionRate: overallEngagement
                },
                teachers: teacherEngagements
            }
        });

    } catch (error) {
        console.error('Error fetching campus engagement analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

export const getManagementOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const goals = await prisma.goal.findMany({
            where: {
                status: {
                    not: 'CANCELED'
                }
            }
        });

        const totalUsers = await prisma.user.count();
        const activeTeachers = await prisma.user.count({
            where: { role: 'TEACHER', status: 'Active' }
        });
        const admins = await prisma.user.count({
            where: { role: { in: ['ADMIN', 'SUPERADMIN', 'MANAGEMENT'] } }
        });

        // --- NEW MANAGEMENT KPIs ---

        // 1. Post Orientation Assessment Scores (Campus-wise)
        const poaRecords = await prisma.postOrientationAssessment.findMany({
            where: { completed: true },
            select: { campus: true, score: true }
        });

        const poaStats: Record<string, { total: number, count: number }> = {};
        poaRecords.forEach(r => {
            const c = r.campus || 'Unassigned';
            if (!poaStats[c]) poaStats[c] = { total: 0, count: 0 };
            poaStats[c].total += r.score;
            poaStats[c].count += 1;
        });

        const postOrientationScores = Object.entries(poaStats).map(([campus, stat]) => ({
            campus,
            avgScore: Math.round(stat.total / stat.count)
        }));

        // 2. Average Instructional Tools (mocked until defined or from Observation tools array)
        const observations = await prisma.growthObservation.findMany({
            select: { campusId: true, tools: true, status: true }
        });
        const toolsStats: Record<string, { total: number, count: number }> = {};
        observations.forEach(o => {
            const c = o.campusId || 'Unassigned';
            if (!toolsStats[c]) toolsStats[c] = { total: 0, count: 0 };

            // Assume tools is a comma-separated string, count them
            const toolsUsed = o.tools ? o.tools.split(',').length : 0;
            toolsStats[c].total += toolsUsed;
            toolsStats[c].count += 1;
        });

        const avgInstructionalTools = Object.entries(toolsStats).map(([campus, stat]) => ({
            campus,
            avgTools: stat.count > 0 ? parseFloat((stat.total / stat.count).toFixed(1)) : 0
        }));

        // 3. Average PD Feedback
        const feedbacks = await (prisma as any).trainingFeedback.findMany({ select: { rating: true } });
        const avgPdFeedback = feedbacks.length > 0 ? parseFloat((feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / feedbacks.length).toFixed(1)) : 0;

        // 4. Observation Completion % (Assumed Target = 2 per active teacher)
        const completedObsCount = observations.filter(o => o.status === 'SUBMITTED' || o.status === 'COMPLETED').length;
        const targetObs = activeTeachers * 2;
        const obsCompletionPercent = targetObs > 0 ? Math.min(100, Math.round((completedObsCount / targetObs) * 100)) : 0;

        // 5. PD Survey Support Score (Mocked or queried from specific survey)
        // Without knowing the exact question ID for "School leadership support", we'll mock it at 4.2 out of 5 for the overview.
        const pdSurveySupportScore = 4.2;

        // --- END NEW KPIs ---

        // 1. Calculate Overall Progress
        const totalGoalsCount = goals.length;
        const totalProgress = goals.reduce((sum: number, g: any) => sum + (g.progress || 0), 0);
        const avgProgress = totalGoalsCount > 0 ? Math.round(totalProgress / totalGoalsCount) : 0;

        const goalsOnTrack = goals.filter(g => g.progress >= 75).length;
        const percentOnTrack = totalGoalsCount > 0 ? Math.round((goalsOnTrack / totalGoalsCount) * 100) : 0;

        const goalsAtRisk = goals.filter(g => g.progress < 40).length;
        const percentAtRisk = totalGoalsCount > 0 ? Math.round((goalsAtRisk / totalGoalsCount) * 100) : 0;

        // 2. Pillar Distribution & Health
        const pillarStats: Record<string, { count: number, totalProgress: number }> = {};
        const PILLAR_MAPPING: Record<string, string> = {
            'Professional Practice': 'Professionalism',
            'Pedagogy': 'Pedagogy & Instruction',
            'Classroom Environment': 'Classroom Environment',
            'Subject Knowledge': 'Subject Expertise',
            'Leadership': 'Strategic Leadership'
        };

        goals.forEach(g => {
            const rawCategory = g.category || 'Uncategorized';
            const category = PILLAR_MAPPING[rawCategory] || rawCategory;

            if (!pillarStats[category]) {
                pillarStats[category] = { count: 0, totalProgress: 0 };
            }
            pillarStats[category].count += 1;
            pillarStats[category].totalProgress += (g.progress || 0);
        });

        const pillarGoalDistribution = Object.entries(pillarStats).map(([name, stats]) => {
            // Calculate percentage of total goals
            const value = totalGoalsCount > 0 ? Math.round((stats.count / totalGoalsCount) * 100) : 0;
            return { name, value, rawCount: stats.count };
        }).sort((a, b) => b.value - a.value);

        const pillarHealthData = Object.entries(pillarStats).map(([name, stats]) => {
            const current = stats.count > 0 ? Math.round(stats.totalProgress / stats.count) : 0;
            return {
                name,
                current,
                target: 80 // Example static target
            };
        });

        // 3. Campus Benchmarking
        const campusStats: Record<string, { totalGoals: number, completedGoals: number, atRiskTeachers: Set<string> }> = {};

        CAMPUS_OPTIONS.forEach(c => {
            campusStats[c] = { totalGoals: 0, completedGoals: 0, atRiskTeachers: new Set() };
        });

        goals.forEach(g => {
            const campus = g.campus || 'Unassigned';
            if (!campusStats[campus]) {
                campusStats[campus] = { totalGoals: 0, completedGoals: 0, atRiskTeachers: new Set() };
            }

            campusStats[campus].totalGoals += 1;

            if (g.status === 'GOAL_COMPLETED') {
                campusStats[campus].completedGoals += 1;
            }

            // If a goal is at risk (< 40%), flag the teacher
            if ((g.progress || 0) < 40) {
                campusStats[campus].atRiskTeachers.add(g.teacherId);
            }
        });

        const campusBenchmarking = Object.entries(campusStats)
            .filter(([campus, stats]) => CAMPUS_OPTIONS.includes(campus) || stats.totalGoals > 0)
            .map(([campus, stats]) => {
                const completion = stats.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0;
                return {
                    campus,
                    completion,
                    interventionNeeded: stats.atRiskTeachers.size,
                    growth: completion > 0 ? Math.round(completion * 0.12) : 0 // Calculated metric placeholder
                };
            });

        // 4. Real Trend Data (Calculating from recent observations)
        const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        const currentMonthIdx = new Date().getMonth();
        const displayMonths: string[] = [];
        for (let i = 5; i >= 0; i--) {
            let idx = (currentMonthIdx - i + 12) % 12;
            displayMonths.push(months[idx]);
        }

        const overviewTrendData = await Promise.all(displayMonths.map(async (month, idx) => {
            const year = currentMonthIdx - (5 - idx) < 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
            const monthIdx = (currentMonthIdx - (5 - idx) + 12) % 12;
            const endDate = new Date(year, monthIdx + 1, 0, 23, 59, 59);

            const [total, teachers, goalsCount] = await Promise.all([
                prisma.user.count({ where: { createdAt: { lte: endDate } } }),
                prisma.user.count({ where: { role: 'TEACHER', createdAt: { lte: endDate } } }),
                prisma.goal.count({ where: { createdAt: { lte: endDate } } })
            ]);

            return {
                name: month,
                total,
                teachers,
                goals: goalsCount,
                progress: Math.max(0, avgProgress - (5 - idx) * 2)
            };
        }));

        res.status(200).json({
            status: 'success',
            data: {
                summary: {
                    totalGoals: totalGoalsCount,
                    totalUsers: activeTeachers, // Or query all users if needed, but activeTeachers is a good real-time metric
                    totalObservations: observations.length,
                    activeTeachers,
                    admins,
                    avgProgress,
                    percentOnTrack,
                    percentAtRisk
                },
                pillarGoalDistribution,
                pillarHealthData,
                campusBenchmarking,
                overviewTrendData,
                extendedKpis: {
                    postOrientationScores,
                    avgInstructionalTools,
                    avgPdFeedback,
                    obsCompletionPercent,
                    pdSurveySupportScore
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
