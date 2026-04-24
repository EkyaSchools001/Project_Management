import { Request, Response, NextFunction } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AppError } from '../../infrastructure/utils/AppError';

import { CAMPUS_OPTIONS } from '../../utils/constants';

export const getGrowthAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // --- Teacher counts by academic type ---
        const [coreCount, nonCoreCount, totalTeachers] = await Promise.all([
            prisma.user.count({ where: { academics: 'CORE', role: 'TEACHER' } }),
            prisma.user.count({ where: { academics: 'NON_CORE', role: 'TEACHER' } }),
            prisma.user.count({ where: { role: 'TEACHER' } }),
        ]);

        // --- All teachers with campus & academic info ---
        const allTeachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            select: { id: true, fullName: true, campusId: true, academics: true, email: true },
        });

        // --- All growth observations ---
        const allObservations = await prisma.growthObservation.findMany({
            where: { status: 'SUBMITTED' },
            select: {
                teacherId: true,
                observerId: true,
                campusId: true,
                overallRating: true,
                moduleType: true,
                observationDate: true,
                tools: true,
                formPayload: true,
                observer: { select: { id: true, fullName: true } },
            },
        });

        // --- Campus metrics aggregation ---
        const campusMap = new Map<string, {
            observations: typeof allObservations;
            teachers: typeof allTeachers;
        }>();

        // Initialize with all valid campuses from system config
        for (const campus of CAMPUS_OPTIONS) {
            campusMap.set(campus, { observations: [], teachers: [] });
        }

        // Group teachers by campus
        for (const teacher of allTeachers) {
            const campusKey = teacher.campusId || 'Unknown';
            if (!campusMap.has(campusKey)) {
                campusMap.set(campusKey, { observations: [], teachers: [] });
            }
            campusMap.get(campusKey)!.teachers.push(teacher);
        }

        // Group observations by campus
        for (const obs of allObservations) {
            const campusKey = obs.campusId || 'Unknown';
            if (!campusMap.has(campusKey)) {
                campusMap.set(campusKey, { observations: [], teachers: [] });
            }
            campusMap.get(campusKey)!.observations.push(obs);
        }

        const campusMetrics = Array.from(campusMap.entries()).map(([campusId, { observations, teachers }]) => {
            const avgScore = observations.length > 0
                ? Math.round((observations.reduce((s, o) => s + (o.overallRating || 0), 0) / observations.length) * 10) / 10
                : 0;
            const avgObsPerTeacher = teachers.length > 0
                ? Math.round((observations.length / teachers.length) * 10) / 10
                : 0;
            const targetCompletion = teachers.length > 0
                ? Math.round(Math.min((observations.length / (teachers.length * 4)) * 100, 100))
                : 0;

            // Teacher details breakdown
            const teacherObsMap = new Map<string, number[]>();
            for (const obs of observations) {
                if (!teacherObsMap.has(obs.teacherId)) teacherObsMap.set(obs.teacherId, []);
                teacherObsMap.get(obs.teacherId)!.push(obs.overallRating || 0);
            }

            const teacherDetails = teachers.map(t => {
                const scores = teacherObsMap.get(t.id) || [];
                return {
                    id: t.id,
                    name: t.fullName,
                    email: t.email,
                    academics: t.academics || 'CORE',
                    observationCount: scores.length,
                    avgScore: scores.length > 0
                        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
                        : 0,
                };
            });

            const coreTeachers = teacherDetails.filter(t => t.academics === 'CORE');
            const nonCoreTeachers = teacherDetails.filter(t => t.academics === 'NON_CORE');

            return {
                campusId,
                avgScore,
                avgObsPerTeacher,
                targetCompletion,
                observationCount: observations.length,
                totalTeachers: teachers.length,
                coreCount: coreTeachers.length,
                nonCoreCount: nonCoreTeachers.length,
                teacherDetails,
                coreTeachers,
                nonCoreTeachers,
            };
        });

        // --- Tool usage from observations ---
        const toolUsageCounts = { instructional: 0, la: 0, cultural: 0 };
        for (const obs of allObservations) {
            try {
                const d = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload || '{}') : obs.formPayload || {};
                
                const instrCount = Array.isArray(d.instructionalTools) ? d.instructionalTools.length : 0;
                const laCount = (Array.isArray(d.learningAreaTools) ? d.learningAreaTools.length : 0) || (Array.isArray(d.learningTools) ? d.learningTools.length : 0);
                const cultCount = (Array.isArray(d.cultureTools) ? d.cultureTools.length : 0) || (Array.isArray(d.culturalTools) ? d.culturalTools.length : 0);

                if (instrCount > 0 || laCount > 0 || cultCount > 0) {
                    toolUsageCounts.instructional += instrCount;
                    toolUsageCounts.la += laCount;
                    toolUsageCounts.cultural += cultCount;
                } else if (obs.tools) {
                    // Fallback to legacy tools
                    const tryArr = (v: any) => {
                        if (Array.isArray(v)) return v;
                        if (typeof v === 'string') {
                            try {
                                const parsed = JSON.parse(v);
                                return Array.isArray(parsed) ? parsed : [];
                            } catch {
                                return v.split(',').filter(Boolean);
                            }
                        }
                        return [];
                    };
                    const toolArr = tryArr(obs.tools);
                    toolUsageCounts.instructional += toolArr.length;
                }
            } catch (e) {
                console.error("Error parsing observation for tools:", e);
            }
        }
        const toolTotal = toolUsageCounts.instructional + toolUsageCounts.la + toolUsageCounts.cultural;
        const toolUsage = {
            ...toolUsageCounts,
            total: toolTotal,
            percentages: toolTotal > 0 ? {
                instructional: Math.round((toolUsageCounts.instructional / toolTotal) * 100),
                la: Math.round((toolUsageCounts.la / toolTotal) * 100),
                cultural: Math.round((toolUsageCounts.cultural / toolTotal) * 100),
            } : { instructional: 0, la: 0, cultural: 0 },
        };

        // --- Growth trends (last 6 months grouped) ---
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendMap = new Map<string, { core: number; nonCore: number }>();
        for (const obs of allObservations) {
            const d = new Date(obs.observationDate);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (!trendMap.has(key)) trendMap.set(key, { core: 0, nonCore: 0 });
            // We can't directly get academics from obs, so use teacher lookup
            const teacher = allTeachers.find(t => t.id === obs.teacherId);
            if (teacher?.academics === 'NON_CORE') trendMap.get(key)!.nonCore++;
            else trendMap.get(key)!.core++;
        }
        const growthTrends = Array.from(trendMap.entries())
            .slice(-6)
            .map(([month, data]) => ({ month: month.split(' ')[0], ...data }));

        // --- Observer metrics ---
        const observerMap = new Map<string, { name: string; scores: number[]; campuses: Set<string> }>();
        for (const obs of allObservations) {
            if (!observerMap.has(obs.observerId)) {
                observerMap.set(obs.observerId, { 
                    name: obs.observer?.fullName || 'Deleted Observer', 
                    scores: [], 
                    campuses: new Set() 
                });
            }
            const entry = observerMap.get(obs.observerId)!;
            entry.scores.push(obs.overallRating || 0);
            if (obs.campusId) entry.campuses.add(obs.campusId);
        }
        const observerMetrics = Array.from(observerMap.entries()).map(([id, d]) => ({
            id,
            name: d.name,
            observationCount: d.scores.length,
            avgScore: d.scores.length > 0
                ? Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 10) / 10
                : 0,
            targetCompletion: Math.min(Math.round((d.scores.length / 20) * 100), 100),
        }));

        // --- Observation completion rate ---
        const targetObsPerTeacher = 4;
        const expectedTotal = totalTeachers * targetObsPerTeacher;
        const observationCompletionRate = expectedTotal > 0
            ? Math.round(Math.min((allObservations.length / expectedTotal) * 100, 100))
            : 0;

        const analytics = {
            totalCore: coreCount,
            totalNonCore: nonCoreCount,
            totalTeachers,
            observationCompletionRate,
            campusMetrics,
            growthTrends: growthTrends.length > 0 ? growthTrends : [
                { month: 'Jan', core: 0, nonCore: 0 },
                { month: 'Feb', core: 0, nonCore: 0 },
                { month: 'Mar', core: 0, nonCore: 0 },
            ],
            toolUsage,
            observerMetrics,
            // Flat lists for the "All Teachers" / "Core" / "Non-Core" tables
            allTeachersList: allTeachers.map(t => {
                const obsForTeacher = allObservations.filter(o => o.teacherId === t.id);
                return {
                    id: t.id,
                    name: t.fullName,
                    email: t.email,
                    campusId: t.campusId || 'Unknown',
                    academics: t.academics || 'CORE',
                    observationCount: obsForTeacher.length,
                    avgScore: obsForTeacher.length > 0
                        ? Math.round((obsForTeacher.reduce((s, o) => s + (o.overallRating || 0), 0) / obsForTeacher.length) * 10) / 10
                        : 0,
                };
            }),
        };

        res.status(200).json({ status: 'success', data: { analytics } });
    } catch (err) {
        next(err);
    }
};

export const validateGrowthAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { teacherId } = req.params;
        const loggedInUser = (req as any).user;

        if (!loggedInUser) {
            return next(new AppError('Not authenticated', 401));
        }

        // if Teacher: can only access their own growth type
        if (loggedInUser.role === 'TEACHER') {
            const academicType = req.query.academicType as string;
            if (loggedInUser.academics !== academicType) {
                return next(new AppError('Unauthorized access to this growth module', 403));
            }
        }

        // if Leader: can only access teachers in their campus
        if ((loggedInUser.role === 'LEADER' || loggedInUser.role === 'SCHOOL_LEADER') && teacherId) {
            const teacher = await prisma.user.findUnique({
                where: { id: String(teacherId) }
            });
            if (!teacher || teacher.campusId !== loggedInUser.campusId) {
                return next(new AppError('Unauthorized access: Teacher not in your campus', 403));
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'Access validated'
        });
    } catch (err) {
        next(err);
    }
};
