import api from '@pdi/lib/api';

interface Notification {
  id: string;
  userId: string;
  type: string;
  category: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  taskNotifications: boolean;
  projectNotifications: boolean;
  messageNotifications: boolean;
  systemNotifications: boolean;
  alertNotifications: boolean;
  reminderNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: string;
}

interface GetNotificationsParams {
  page?: number;
  limit?: number;
  category?: string;
  unreadOnly?: boolean;
}

export const notificationService = {
  async getNotifications(params: GetNotificationsParams = {}): Promise<{ data: Notification[]; total: number; unread: number }> {
    try {
      const response = await api.get('/notifications', { params });
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        unread: response.data.unread || 0,
      };
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { data: [], total: 0, unread: 0 };
    }
  },

  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get notification:', error);
      return null;
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    try {
      await api.put(`/notifications/${id}/read`);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      await api.put('/notifications/read-all');
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  },

  async deleteNotification(id: string): Promise<boolean> {
    try {
      await api.delete(`/notifications/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  },

  async deleteReadNotifications(): Promise<{ count: number }> {
    try {
      const response = await api.delete('/notifications/read');
      return response.data;
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
      return { count: 0 };
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  },

  async getPreferences(): Promise<NotificationPreferences | null> {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return null;
    }
  },

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      await api.put('/notifications/preferences', preferences);
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  },

  async sendTestNotification(): Promise<boolean> {
    try {
      const response = await api.post('/notifications/test');
      return response.data.success;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  },

  async subscribeToPush(): Promise<boolean> {
    try {
      const response = await api.post('/notifications/push/subscribe');
      return response.data.success;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return false;
    }
  },

  async unsubscribeFromPush(): Promise<boolean> {
    try {
      const response = await api.post('/notifications/push/unsubscribe');
      return response.data.success;
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      return false;
    }
  },

  async getVapidPublicKey(): Promise<string> {
    try {
      const response = await api.get('/notifications/vapid-public-key');
      return response.data.publicKey || '';
    } catch (error) {
      console.error('Failed to get VAPID public key:', error);
      return '';
    }
  },
};

export default notificationService;