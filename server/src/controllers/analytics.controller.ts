import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AnalyticsService } from '../services/analytics.service';

export const getSystemSummary = async (req: AuthRequest, res: Response) => {
    try {
        const summary = await AnalyticsService.getSystemSummary();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate summary' });
    }
};

export const getDepartmentDistribution = async (req: AuthRequest, res: Response) => {
    try {
        const distribution = await AnalyticsService.getDepartmentDistribution();
        res.json(distribution);
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate distribution' });
    }
};

export const getRoleDistribution = async (req: AuthRequest, res: Response) => {
    try {
        const roles = await AnalyticsService.getRoleDistribution();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch usage stats' });
    }
}
