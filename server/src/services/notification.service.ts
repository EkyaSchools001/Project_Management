import { PrismaClient, Notification, NotificationPreference, PushSubscription } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  static async createNotification(userId: string, data: {
    type?: string;
    category?: string;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
  }): Promise<Notification> {
    return await prisma.notification.create({
      data: {
        userId,
        type: data.type as any || 'Info',
        category: data.category as any || 'System',
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata,
      },
    });
  }

  static async getNotifications(userId: string, options: {
    page?: number;
    limit?: number;
    category?: string;
    unreadOnly?: boolean;
  } = {}): Promise<{ data: Notification[]; total: number; unread: number }> {
    const { page = 1, limit = 20, category, unreadOnly } = options;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (category) where.category = category;
    if (unreadOnly) where.read = false;

    const [notifications, total, unread] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return { data: notifications, total, unread };
  }

  static async getNotificationById(id: string, userId: string): Promise<Notification | null> {
    return await prisma.notification.findFirst({
      where: { id, userId },
    });
  }

  static async markAsRead(id: string, userId: string): Promise<Notification> {
    return await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true, readAt: new Date() },
    }).then(async () => {
      return await prisma.notification.findFirstOrThrow({ where: { id, userId } });
    });
  }

  static async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    });
    return { count: result.count };
  }

  static async deleteNotification(id: string, userId: string): Promise<void> {
    await prisma.notification.deleteMany({
      where: { id, userId },
    });
  }

  static async deleteReadNotifications(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.deleteMany({
      where: { userId, read: true },
    });
    return { count: result.count };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: { userId, read: false },
    });
  }

  static async createNotificationBatch(userId: string, notifications: Array<{
    type?: string;
    category?: string;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
  }>): Promise<Notification[]> {
    const data = notifications.map(n => ({
      userId,
      type: n.type as any || 'Info',
      category: n.category as any || 'System',
      title: n.title,
      message: n.message,
      link: n.link,
      metadata: n.metadata,
    }));
    return await prisma.notification.createManyAndReturn({ data });
  }
}

export class NotificationPreferenceService {
  static async getPreferences(userId: string): Promise<NotificationPreference | null> {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });
    
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId },
      });
    }
    
    return prefs;
  }

  static async updatePreferences(userId: string, data: {
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    smsEnabled?: boolean;
    taskNotifications?: boolean;
    projectNotifications?: boolean;
    messageNotifications?: boolean;
    systemNotifications?: boolean;
    alertNotifications?: boolean;
    reminderNotifications?: boolean;
    quietHoursEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    digestFrequency?: string;
  }): Promise<NotificationPreference> {
    return await prisma.notificationPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}

export class PushSubscriptionService {
  static async subscribe(userId: string, data: {
    endpoint: string;
    p256dh: string;
    auth: string;
    userAgent?: string;
  }): Promise<PushSubscription> {
    return await prisma.pushSubscription.upsert({
      where: { endpoint: data.endpoint },
      update: { userId, active: true, userAgent: data.userAgent },
      create: { userId, ...data },
    });
  }

  static async unsubscribe(endpoint: string): Promise<void> {
    await prisma.pushSubscription.update({
      where: { endpoint },
      data: { active: false },
    });
  }

  static async getActiveSubscriptions(userId: string): Promise<PushSubscription[]> {
    return await prisma.pushSubscription.findMany({
      where: { userId, active: true },
    });
  }

  static async getSubscriptionStatus(endpoint: string): Promise<PushSubscription | null> {
    return await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });
  }
}

export class EmailQueueService {
  static async queueEmail(userId: string, data: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }): Promise<any> {
    return await prisma.emailQueue.create({
      data: {
        userId,
        to: data.to,
        subject: data.subject,
        template: data.template,
        data: data.data,
      },
    });
  }

  static async getPendingEmails(limit: number = 50): Promise<any[]> {
    return await prisma.emailQueue.findMany({
      where: { status: 'pending' },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  static async markEmailSent(id: string): Promise<void> {
    await prisma.emailQueue.update({
      where: { id },
      data: { status: 'sent', sentAt: new Date() },
    });
  }

  static async markEmailFailed(id: string, error: string, attempts: number): Promise<void> {
    if (attempts >= 3) {
      await prisma.emailQueue.update({
        where: { id },
        data: { status: 'failed', error, attempts: { increment: 1 } },
      });
    } else {
      await prisma.emailQueue.update({
        where: { id },
        data: { error, attempts: { increment: 1 } },
      });
    }
  }
}

export class PushQueueService {
  static async queuePush(userId: string, data: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
  }): Promise<any> {
    return await prisma.pushQueue.create({
      data: {
        userId,
        title: data.title,
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        data: data.data,
      },
    });
  }

  static async getPendingPushes(limit: number = 50): Promise<any[]> {
    return await prisma.pushQueue.findMany({
      where: { status: 'pending' },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  static async markPushSent(id: string): Promise<void> {
    await prisma.pushQueue.update({
      where: { id },
      data: { status: 'sent', sentAt: new Date() },
    });
  }

  static async markPushFailed(id: string, error: string, attempts: number): Promise<void> {
    if (attempts >= 3) {
      await prisma.pushQueue.update({
        where: { id },
        data: { status: 'failed', error, attempts: { increment: 1 } },
      });
    } else {
      await prisma.pushQueue.update({
        where: { id },
        data: { error, attempts: { increment: 1 } },
      });
    }
  }
}
