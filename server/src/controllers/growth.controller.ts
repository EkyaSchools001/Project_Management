import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { GrowthService } from '../services/growth.service';

export const getMetrics = async (req: AuthRequest, res: Response) => {
    try {
        const targetUserId = req.query.userId as string;
        const metrics = await GrowthService.getMetrics(req.user.id, req.user.role, targetUserId);
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};

export const createMetric = async (req: AuthRequest, res: Response) => {
    try {
        const { metricType, value } = req.body;
        const metric = await GrowthService.createMetric(req.user.id, { metricType, value });
        res.status(201).json(metric);
    } catch (error) {
        res.status(500).json({ error: 'Failed to record metric' });
    }
};

// New endpoint for team
export const getTeamMetrics = async (req: AuthRequest, res: Response) => {
    try {
        // Only managers or above should access
        if (req.user.role === 'Guest' || req.user.role === 'TeacherStaff') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const metrics = await GrowthService.getTeamMetrics(req.user.id);
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch team metrics' });
    }
};
