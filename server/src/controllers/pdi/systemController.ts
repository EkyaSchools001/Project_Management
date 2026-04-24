import { Request, Response, NextFunction } from 'express';
import { getIO } from '../../socket';

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const io = getIO();

        // Count total connected clients
        const connectionCount = io.engine?.clientsCount || 0;

        const healthData = {
            activeConnections: connectionCount,
            uptimeSeconds: process.uptime(),
            memoryUsage: process.memoryUsage(),
            status: 'operational',
            timestamp: new Date().toISOString()
        };

        res.status(200).json({
            status: 'success',
            data: healthData
        });
    } catch (err) {
        next(err);
    }
};
