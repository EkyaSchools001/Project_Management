import { Request, Response } from 'express';
import timeService from '../services/time.service';

export const StartTimer = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { taskId, description } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: 'Task ID is required' });
        }

        const timer = await timeService.startTimer(userId, taskId, description);
        res.json({ success: true, data: timer });
    } catch (error: any) {
        console.error('StartTimer error:', error);
        res.status(500).json({ error: error.message || 'Failed to start timer' });
    }
};

export const StopTimer = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { timerId } = req.body;
        const entry = await timeService.stopTimer(userId, timerId);
        res.json({ success: true, data: entry });
    } catch (error: any) {
        console.error('StopTimer error:', error);
        res.status(500).json({ error: error.message || 'Failed to stop timer' });
    }
};

export const GetTimerStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const timer = await timeService.getActiveTimer(userId);
        res.json({ data: timer });
    } catch (error: any) {
        console.error('GetTimerStatus error:', error);
        res.status(500).json({ error: 'Failed to get timer status' });
    }
};

export const GetEntries = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const filters = {
            userId: req.query.userId as string || userId,
            taskId: req.query.taskId as string,
            projectId: req.query.projectId as string,
            startDate: req.query.startDate as string,
            endDate: req.query.endDate as string,
            status: req.query.status as string,
            billable: req.query.billable === 'true' ? true : req.query.billable === 'false' ? false : undefined,
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 50
        };

        const result = await timeService.getEntries(filters);
        res.json(result);
    } catch (error: any) {
        console.error('GetEntries error:', error);
        res.status(500).json({ error: 'Failed to get entries' });
    }
};

export const CreateEntry = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { taskId, description, startTime, endTime, duration, billable } = req.body;
        
        if (!taskId) {
            return res.status(400).json({ error: 'Task ID is required' });
        }

        if (!startTime) {
            return res.status(400).json({ error: 'Start time is required' });
        }

        const entry = await timeService.createEntry({
            taskId,
            userId,
            description,
            startTime,
            endTime,
            duration,
            billable
        });

        res.json({ success: true, data: entry });
    } catch (error: any) {
        console.error('CreateEntry error:', error);
        res.status(500).json({ error: error.message || 'Failed to create entry' });
    }
};

export const UpdateEntry = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const { description, startTime, endTime, duration, billable } = req.body;

        const entry = await timeService.updateEntry(id, {
            description,
            startTime,
            endTime,
            duration,
            billable
        });

        res.json({ success: true, data: entry });
    } catch (error: any) {
        console.error('UpdateEntry error:', error);
        res.status(500).json({ error: error.message || 'Failed to update entry' });
    }
};

export const DeleteEntry = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        await timeService.deleteEntry(id);
        res.json({ success: true });
    } catch (error: any) {
        console.error('DeleteEntry error:', error);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
};

export const ApproveEntry = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const id = req.params.i as string;
        const entry = await timeService.approveEntry(id, userId);
        res.json({ success: true, data: entry });
    } catch (error: any) {
        console.error('ApproveEntry error:', error);
        res.status(500).json({ error: 'Failed to approve entry' });
    }
};

export const GetReport = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const targetUserId = req.query.userId as string || userId;
        
        const filters = {
            startDate: req.query.startDate as string,
            endDate: req.query.endDate as string,
            projectId: req.query.projectId as string,
            taskId: req.query.taskId as string
        };

        const report = await timeService.getReport(targetUserId, filters);
        res.json({ data: report });
    } catch (error: any) {
        console.error('GetReport error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};
