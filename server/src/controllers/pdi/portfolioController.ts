import { Request, Response } from "express";
import { prisma } from "../../app";

// db is cast as any so `portfolioAchievement` compiles even before the table is migrated
const db = prisma as any;

export const getPortfolioSummary = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId as string;

    const safeQuery = async (fn: () => Promise<any[]>): Promise<any[]> => {
      try { return await fn(); } catch { return []; }
    };

    const [
      observations,
      growthObservations,
      pdHours,
      moocSubmissions,
      goals
    ] = await Promise.all([
      safeQuery(() => prisma.observation.findMany({ where: { teacherId } })),
      safeQuery(() => prisma.growthObservation.findMany({ where: { teacherId } })),
      safeQuery(() => prisma.pDHour.findMany({ where: { userId: teacherId, status: "APPROVED" } })),
      safeQuery(() => prisma.moocSubmission.findMany({ where: { userId: teacherId } })),
      safeQuery(() => prisma.goal.findMany({ where: { teacherId } })),
    ]);

    const totalObs = [...observations, ...growthObservations];
    const avgObservationScore =
      totalObs.length > 0
        ? totalObs.reduce((acc: number, obs: any) => {
            const score = 'score' in obs ? obs.score : (obs.overallRating || 0);
            return acc + score;
          }, 0) / totalObs.length
        : 0;

    const trainingHoursCompleted = pdHours.reduce((acc: number, pd: any) => acc + pd.hours, 0);
    const selfPacedCourses = moocSubmissions.length;
    
    // Calculate goal progress: average of all goal progress
    const goalProgress = goals.length > 0 
      ? goals.reduce((acc: number, g: any) => acc + g.progress, 0) / goals.length
      : 0;

    res.json({
      avgObservationScore,
      trainingHoursCompleted,
      trainingHoursPending: Math.max(0, 40 - trainingHoursCompleted), // assuming 40 hours target
      selfPacedCourses,
      assessmentsCompleted: 0, // Placeholder
      goalProgress
    });
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    res.status(500).json({ error: "Failed to fetch portfolio summary" });
  }
};

export const getPortfolioTimeline = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId as string;

    // Run each query independently so a missing table doesn't crash the whole endpoint
    const safeQuery = async (fn: () => Promise<any[]>): Promise<any[]> => {
      try { return await fn(); } catch { return []; }
    };

    const [
      observations,
      growthObservations,
      goals,
      trainings,
      achievements,
      moocSubmissions
    ] = await Promise.all([
      safeQuery(() => prisma.observation.findMany({
        where: { teacherId },
        include: { observer: { select: { fullName: true } } }
      })),
      safeQuery(() => prisma.growthObservation.findMany({
        where: { teacherId },
        include: { observer: { select: { fullName: true } } }
      })),
      safeQuery(() => prisma.goal.findMany({ where: { teacherId } })),
      safeQuery(() => prisma.eventAttendance.findMany({
        where: { teacherId },
        include: { event: true }
      })),
      safeQuery(() => (prisma as any).portfolioAchievement?.findMany({ where: { teacherId } }) ?? Promise.resolve([])),
      safeQuery(() => prisma.moocSubmission.findMany({ where: { userId: teacherId } }))
    ]);

    const timeline: any[] = [];

    observations.forEach((o: any) => {
      timeline.push({
        id: o.id,
        type: "Observation",
        title: `Observation in ${o.domain}`,
        date: new Date(o.date).toISOString(),
        score: o.score,
        observerName: o.observer?.fullName || "Observer",
        description: o.notes || ""
      });
    });

    growthObservations.forEach((o: any) => {
      timeline.push({
        id: o.id,
        type: "Growth Observation",
        title: `${o.moduleType} Observation`,
        date: new Date(o.observationDate).toISOString(),
        score: o.overallRating || 0,
        observerName: o.observer?.fullName || "Observer",
        description: o.notes || ""
      });
    });

    goals.forEach((g: any) => {
      timeline.push({
        id: g.id,
        type: "Goal",
        title: g.title,
        date: new Date(g.createdAt).toISOString(),
        score: null,
        description: g.description || `Progress: ${g.progress}%`
      });
    });

    trainings.forEach((t: any) => {
      timeline.push({
        id: t.id,
        type: "Training",
        title: t.event?.title || "Unknown Training",
        date: new Date(t.submittedAt).toISOString(),
        score: null,
        description: t.event?.topic || ""
      });
    });

    achievements.forEach((a: any) => {
      timeline.push({
        id: a.id,
        type: "Achievement",
        title: a.title,
        date: new Date(a.date).toISOString(),
        score: null,
        description: a.description || "",
        tags: a.tags ? a.tags.split(',') : [],
        attachments: a.attachments
      });
    });

    moocSubmissions.forEach((m: any) => {
      timeline.push({
        id: m.id,
        type: "Self-Learning Course",
        title: m.courseName,
        date: new Date(m.submittedAt).toISOString(),
        score: null,
        description: `${m.platform} - ${m.hours} hours`
      });
    });

    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(timeline);
  } catch (error) {
    console.error("Error fetching portfolio timeline:", error);
    res.status(500).json({ error: "Failed to fetch portfolio timeline" });
  }
};

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId as string;
    const achievements = await db.portfolioAchievement.findMany({
      where: { teacherId },
      orderBy: { date: "desc" }
    });
    res.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
};

export const createAchievement = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId as string;
    const { title, description, date, category, tags, attachments } = req.body;

    const parsedDate = date ? new Date(date) : new Date();

    const newAchievement = await db.portfolioAchievement.create({
      data: {
        teacherId,
        title,
        description,
        date: parsedDate,
        category: category || "Achievement",
        tags,
        attachments
      }
    });
    res.json(newAchievement);
  } catch (error) {
    console.error("Error creating achievement:", error);
    res.status(500).json({ error: "Failed to create achievement" });
  }
};

export const updateAchievement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, date, category, tags, attachments } = req.body;

    const parsedDate = date ? new Date(date) : undefined;

    const updated = await db.portfolioAchievement.update({
      where: { id },
      data: {
        title,
        description,
        ...(parsedDate && { date: parsedDate }),
        category,
        tags,
        attachments
      }
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating achievement:", error);
    res.status(500).json({ error: "Failed to update achievement" });
  }
};

export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.portfolioAchievement.delete({ where: { id } });
    res.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    res.status(500).json({ error: "Failed to delete achievement" });
  }
};
