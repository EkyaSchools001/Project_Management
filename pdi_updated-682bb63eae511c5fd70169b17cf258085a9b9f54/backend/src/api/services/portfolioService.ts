import prisma from "../../infrastructure/database/prisma";

export interface PortfolioEvent {
    id: string;
    type: string;
    title: string;
    date: Date;
    score: number | null;
    status?: string;
    observerName?: string;
    description: string;
    tags?: string[];
    attachments?: string;
    visibility?: string;
}

export interface PortfolioSummary {
    avgObservationScore: number;
    trainingHoursCompleted: number;
    trainingHoursPending: number;
    selfPacedCourses: number;
    assessmentsCompleted: number;
    goalProgress: number;
}

export const fetchPortfolioSummary = async (teacherId: string): Promise<PortfolioSummary> => {
    // Run all queries with safe fallback
    const safeQuery = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
        try { return await fn(); } catch { return fallback; }
    };

    const [
        observations,
        growthObs,
        pdHours,
        moocs,
        goals,
        assessments
    ] = await Promise.all([
        safeQuery(() => prisma.observation.findMany({ where: { teacherId } }), []),
        safeQuery(() => prisma.growthObservation.findMany({ where: { teacherId } }), []),
        safeQuery(() => prisma.pDHour.findMany({ where: { userId: teacherId, status: "APPROVED" } }), []),
        safeQuery(() => prisma.moocSubmission.findMany({ where: { userId: teacherId } }), []),
        safeQuery(() => prisma.goal.findMany({ where: { teacherId } }), []),
        safeQuery(() => prisma.assessmentAttempt.findMany({ 
            where: { userId: teacherId, status: "COMPLETED" } 
        }), [])
    ]);

    // Perform calculations
    const allObs = [...observations, ...growthObs];
    const avgScore = allObs.length > 0 
        ? allObs.reduce((acc, o: any) => acc + (o.score !== undefined ? o.score : (o.overallRating || 0)), 0) / allObs.length 
        : 0;

    const pdCompleted = pdHours.reduce((acc, pd) => acc + pd.hours, 0);
    const goalAvg = goals.length > 0 
        ? goals.reduce((acc, g) => acc + g.progress, 0) / goals.length 
        : 0;

    return {
        avgObservationScore: Number(avgScore.toFixed(2)),
        trainingHoursCompleted: pdCompleted,
        trainingHoursPending: Math.max(0, 40 - pdCompleted),
        selfPacedCourses: moocs.length,
        assessmentsCompleted: assessments.length,
        goalProgress: Number(goalAvg.toFixed(2))
    };
};

export const fetchPortfolioTimeline = async (teacherId: string): Promise<PortfolioEvent[]> => {
    const safeQuery = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
        try { return await fn(); } catch { return fallback; }
    };

    const [
        observations,
        growthObs,
        goals,
        trainings,
        achievements,
        moocs,
        assessments
    ] = await Promise.all([
        safeQuery(() => prisma.observation.findMany({
            where: { teacherId },
            include: { observer: { select: { fullName: true } } }
        }), []),
        safeQuery(() => prisma.growthObservation.findMany({
            where: { teacherId },
            include: { observer: { select: { fullName: true } } }
        }), []),
        safeQuery(() => prisma.goal.findMany({ where: { teacherId } }), []),
        safeQuery(() => prisma.eventAttendance.findMany({
            where: { teacherId },
            include: { event: true }
        }), []),
        safeQuery(() => (prisma as any).portfolioAchievement?.findMany({ where: { teacherId } }) ?? Promise.resolve([]), []),
        safeQuery(() => prisma.moocSubmission.findMany({ where: { userId: teacherId } }), []),
        safeQuery(() => prisma.assessmentAttempt.findMany({
            where: { userId: teacherId },
            include: { assessment: { select: { title: true } } }
        }), [])
    ]);

    const timeline: PortfolioEvent[] = [];

    // Observations
    observations.forEach((o: any) => {
        timeline.push({
            id: o.id,
            type: "Observation",
            title: `Observation - ${o.domain}`,
            date: new Date(o.date),
            score: o.score,
            observerName: o.observer?.fullName,
            description: o.notes || ""
        });
    });

    // Growth Observations
    growthObs.forEach((o: any) => {
        timeline.push({
            id: o.id,
            type: "Growth Observation",
            title: `${o.moduleType} Observation`,
            date: new Date(o.observationDate),
            score: o.overallRating,
            observerName: o.observer?.fullName,
            description: o.notes || ""
        });
    });

    // Goals
    goals.forEach((g) => {
        timeline.push({
            id: g.id,
            type: "Goal",
            title: g.title,
            date: new Date(g.createdAt),
            score: g.progress,
            description: g.description || `Target Progress: ${g.progress}%`
        });
    });

    // Trainings
    trainings.forEach((t: any) => {
        timeline.push({
            id: t.id,
            type: "Training",
            title: t.event?.title || "Professional Training",
            date: new Date(t.submittedAt),
            score: null,
            status: t.status ? "Attended" : "Registered",
            description: t.event?.topic || ""
        });
    });

    // Achievements
    achievements.forEach((a: any) => {
        timeline.push({
            id: a.id,
            type: "Achievement",
            title: a.title,
            date: new Date(a.date),
            score: null,
            description: a.description || "",
            tags: a.tags ? a.tags.split(',') : [],
            attachments: a.attachments,
            visibility: a.visibility || "PRIVATE"
        });
    });

    // MOOCs
    moocs.forEach((m) => {
        timeline.push({
            id: m.id,
            type: "Self-Paced Course",
            title: m.courseName,
            date: new Date(m.submittedAt),
            score: m.effectivenessRating,
            status: m.status,
            description: `${m.platform} - ${m.hours} hours`
        });
    });

    // Assessments
    assessments.forEach((a: any) => {
        timeline.push({
            id: a.id,
            type: "Assessment",
            title: a.assessment?.title || "System Assessment",
            date: new Date(a.createdAt),
            score: a.score,
            status: a.status,
            description: `Attempt ${a.attemptNumber}`
        });
    });

    // Sort descending
    return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
};
