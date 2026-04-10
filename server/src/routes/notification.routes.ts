import { Router, Request, Response, NextFunction } from 'express';
import {
    NotificationService,
    NotificationPreferenceService,
    PushSubscriptionService
} from '../services/notification.service';
import { sendPushNotification, getVapidPublicKey } from '../services/push.service';
import { getCurrentUserId } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const category = req.query.category as string;
        const unreadOnly = req.query.unreadOnly === 'true';

        const result = await NotificationService.getNotifications(userId, {
            page,
            limit,
            category,
            unreadOnly
        });

        res.json({
            success: true,
            data: result.data,
            total: result.total,
            unread: result.unread,
            page,
            limit
        });
    } catch (error) {
        next(error);
    }
});

router.get('/unread-count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const count = await NotificationService.getUnreadCount(userId);
        res.json({ success: true, count });
    } catch (error) {
        next(error);
    }
});

router.get('/preferences', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const preferences = await NotificationPreferenceService.getPreferences(userId);
        res.json({ success: true, data: preferences });
    } catch (error) {
        next(error);
    }
});

router.put('/preferences', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const preferences = await NotificationPreferenceService.updatePreferences(userId, req.body);
        res.json({ success: true, data: preferences });
    } catch (error) {
        next(error);
    }
});

router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const notification = await NotificationService.markAsRead(req.params.id, userId);
        res.json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
});

router.put('/read-all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const result = await NotificationService.markAllAsRead(userId);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        await NotificationService.deleteNotification(req.params.id, userId);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

router.delete('/read', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const result = await NotificationService.deleteReadNotifications(userId);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
});

router.get('/vapid-public-key', (_req: Request, res: Response) => {
    const publicKey = getVapidPublicKey();
    if (!publicKey) {
        return res.status(503).json({ error: 'Push notifications not configured' });
    }
    res.json({ publicKey });
});

router.post('/push/subscribe', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const { endpoint, keys, userAgent } = req.body;

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return res.status(400).json({ error: 'Invalid subscription data' });
        }

        await PushSubscriptionService.subscribe(userId, {
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
            userAgent
        });

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

router.post('/push/unsubscribe', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { endpoint } = req.body;
        if (!endpoint) {
            return res.status(400).json({ error: 'Endpoint required' });
        }

        await PushSubscriptionService.unsubscribe(endpoint);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

router.post('/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getCurrentUserId(req);
        const subscriptions = await PushSubscriptionService.getActiveSubscriptions(userId);

        if (subscriptions.length === 0) {
            return res.status(400).json({ error: 'No push subscriptions found' });
        }

        for (const sub of subscriptions) {
            await sendPushNotification(sub.endpoint, {
                title: 'Test Notification',
                body: 'This is a test notification from SchoolOS!',
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }

        res.json({ success: true, message: 'Test notification sent' });
    } catch (error) {
        next(error);
    }
});

export default router;