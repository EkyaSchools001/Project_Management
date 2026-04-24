import { Request, Response } from 'express';
import prisma from '../../infrastructure/database/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getProactiveInsight = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ status: 'fail', message: 'Unauthorized' });
            return;
        }

        const userRole = req.user?.role || 'TEACHER';

        // 1. Check for unread announcements
        const unreadAnnouncements = await prisma.announcement.count({
            where: {
                targetRoles: { contains: userRole },
                acknowledgements: {
                    none: { userId }
                }
            }
        });

        // 2. Check for pending OKRs/Goals (last updated > 7 days ago)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const pendingGoals = await prisma.goal.count({
            where: {
                teacherId: userId,
                status: 'IN_PROGRESS',
                updatedAt: { lt: sevenDaysAgo }
            }
        });

        // 3. Construct a concise insight summary
        let insight = "";
        if (unreadAnnouncements > 0) {
            insight += `You have ${unreadAnnouncements} unread announcement${unreadAnnouncements > 1 ? 's' : ''}. `;
        }
        if (pendingGoals > 0) {
            insight += `It's been a week since you updated your ${pendingGoals} active goal${pendingGoals > 1 ? 's' : ''}. `;
        }

        const greeting = insight || "You're all caught up for today!";

        res.status(200).json({
            status: 'success',
            data: {
                insight,
                greeting,
                metadata: {
                    unreadAnnouncements,
                    pendingGoals
                }
            }
        });
    } catch (error: any) {
        console.error("❌ PROACTIVE INSIGHT ERROR:", error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch proactive insights' });
    }
};
