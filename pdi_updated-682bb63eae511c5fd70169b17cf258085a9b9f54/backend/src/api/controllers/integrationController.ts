import { Request, Response } from 'express';
import prisma from '../../infrastructure/database/prisma';

export const globalSearch = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
            return res.json({ teachers: [], observations: [], goals: [] });
        }

        const [teachers, observations, goals] = await Promise.all([
            prisma.user.findMany({
                where: {
                    OR: [
                        { fullName: { contains: query } },
                        { email: { contains: query } }
                    ]
                },
                select: { id: true, fullName: true, email: true, role: true, campusId: true },
                take: 5
            }),
            prisma.observation.findMany({
                where: {
                    OR: [
                        { domain: { contains: query } },
                        { notes: { contains: query } }
                    ]
                },
                select: { id: true, domain: true, date: true, teacherId: true, score: true },
                take: 5
            }),
            prisma.goal.findMany({
                where: {
                    title: { contains: query }
                },
                select: { id: true, title: true, status: true, progress: true, teacherId: true },
                take: 5
            })
        ]);

        res.json({ teachers, observations, goals });
    } catch (error) {
        console.error("Global search error:", error);
        res.status(500).json({ error: "Search failed" });
    }
};

export const getMetadata = async (req: Request, res: Response) => {
    try {
        const metadata = {
            roles: ["TEACHER", "LEADER", "ADMIN", "SUPERADMIN"],
            observationDomains: [
                "Planning and Preparation",
                "Classroom Environment",
                "Instruction",
                "Professional Responsibilities"
            ],
            goalCategories: ["Academic", "Professional", "Personal", "School-Aligned"],
            campuses: [
                "CMR PU ITPL", 
                "CMR PU BTM", 
                "CMR PU HRBR", 
                "EKYA ITPL", 
                "EKYA BTM",
                "EKYA JP NAGAR",
                "EKYA NICE ROAD"
            ],
            moduleTypes: ["Portfolio", "Observation", "Growth", "Professional Development", "Assessment"]
        };
        
        res.json(metadata);
    } catch (error) {
        console.error("Metadata error:", error);
        res.status(500).json({ error: "Failed to fetch metadata" });
    }
};
