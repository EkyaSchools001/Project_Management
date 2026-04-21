import webpush from 'web-push';
import { PushSubscriptionService, PushQueueService } from './notification.service';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@schoolos.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export const generateVapidKeys = () => {
    return webpush.generateVAPIDKeys();
};

export const getVapidPublicKey = () => {
    return VAPID_PUBLIC_KEY;
};

export interface PushPayload {
    title: string;
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    actions?: Array<{ action: string; title: string }>;
    requireInteraction?: boolean;
}

export const sendPushNotification = async (
    endpoint: string,
    payload: PushPayload
): Promise<boolean> => {
    try {
        if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
            console.warn('[Push Service] VAPID keys not configured, skipping push notification');
            return false;
        }

        const subscription = {
            endpoint,
            keys: {
                p256dh: '',
                auth: ''
            }
        };

        await webpush.sendNotification(
            subscription as any,
            JSON.stringify(payload)
        );
        return true;
    } catch (error: any) {
        console.error('[Push Service] Failed to send push notification:', error.message);
        
        if (error.statusCode === 410) {
            await PushSubscriptionService.unsubscribe(endpoint);
        }
        return false;
    }
};

export const broadcastPushNotification = async (
    userId: string,
    payload: PushPayload
): Promise<{ success: number; failed: number }> => {
    const subscriptions = await PushSubscriptionService.getActiveSubscriptions(userId);
    
    let success = 0;
    let failed = 0;

    for (const sub of subscriptions) {
        const result = await sendPushNotification(sub.endpoint, payload);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }

    return { success, failed };
};

export const processPushQueue = async (): Promise<void> => {
    const pendingPushes = await PushQueueService.getPendingPushes(50);

    for (const push of pendingPushes) {
        try {
            const subscriptions = await PushSubscriptionService.getActiveSubscriptions(push.userId);
            
            if (subscriptions.length === 0) {
                await PushQueueService.markPushFailed(push.id, 'No active subscriptions', push.attempts);
                continue;
            }

            for (const sub of subscriptions) {
                await sendPushNotification(sub.endpoint, {
                    title: push.title,
                    body: push.body,
                    icon: push.icon,
                    badge: push.badge,
                    data: push.data,
                });
            }

            await PushQueueService.markPushSent(push.id);
        } catch (error: any) {
            await PushQueueService.markPushFailed(push.id, error.message, push.attempts);
        }
    }
};

export const parsePushSubscription = (subscription: any) => {
    const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
            p256dh: subscription.keys?.p256dh || subscription.p256dh,
            auth: subscription.keys?.auth || subscription.auth
        }
    };
    return pushSubscription;
};