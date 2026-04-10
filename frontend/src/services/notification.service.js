import api from './api.client';

let notificationPermission = 'default';
let pushSubscription = null;

export const notificationService = {
    async getNotifications(params = {}) {
        try {
            const response = await api.get('/notifications', { params });
            return {
                data: response.data.data || response.data,
                unread: response.data.unread,
                total: response.data.total
            };
        } catch (error) {
            console.warn('API unavailable, using local storage');
            await new Promise(resolve => setTimeout(resolve, 200));
            const stored = localStorage.getItem('school_notifications');
            let notifications = stored ? JSON.parse(stored) : this.getMockNotifications();
            
            if (params.read !== undefined) {
                notifications = notifications.filter(n => n.read === params.read);
            }
            
            if (params.type) {
                notifications = notifications.filter(n => n.type === params.type);
            }
            
            const page = params.page || 1;
            const limit = params.limit || 20;
            const start = (page - 1) * limit;
            
            return {
                data: notifications.slice(start, start + limit),
                unread: notifications.filter(n => !n.read).length,
                total: notifications.length
            };
        }
    },

    getMockNotifications() {
        return [
            { id: 'n1', type: 'task', title: 'New Task Assigned', message: 'You have been assigned to "Curriculum Review"', read: false, createdAt: new Date().toISOString() },
            { id: 'n2', type: 'project', title: 'Project Updated', message: 'Digital Lab Infrastructure has been completed', read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 'n3', type: 'system', title: 'System Update', message: 'Scheduled maintenance completed successfully', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
            { id: 'n4', type: 'message', title: 'New Message', message: 'You have a new message from Avni', read: true, createdAt: new Date(Date.now() - 259200000).toISOString() }
        ];
    },

    async markAsRead(id) {
        try {
            return await api.patch(`/notifications/${id}/read`);
        } catch (error) {
            const stored = localStorage.getItem('school_notifications');
            let notifications = stored ? JSON.parse(stored) : this.getMockNotifications();
            notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
            localStorage.setItem('school_notifications', JSON.stringify(notifications));
            return { success: true };
        }
    },

    async markAllAsRead() {
        try {
            return await api.post('/notifications/read-all');
        } catch (error) {
            const stored = localStorage.getItem('school_notifications');
            let notifications = stored ? JSON.parse(stored) : this.getMockNotifications();
            notifications = notifications.map(n => ({ ...n, read: true }));
            localStorage.setItem('school_notifications', JSON.stringify(notifications));
            return { success: true };
        }
    },

    async deleteNotification(id) {
        try {
            return await api.delete(`/notifications/${id}`);
        } catch (error) {
            const stored = localStorage.getItem('school_notifications');
            let notifications = stored ? JSON.parse(stored) : this.getMockNotifications();
            notifications = notifications.filter(n => n.id !== id);
            localStorage.setItem('school_notifications', JSON.stringify(notifications));
            return { success: true };
        }
    },

    async deleteAllRead() {
        try {
            return await api.delete('/notifications/read');
        } catch (error) {
            const stored = localStorage.getItem('school_notifications');
            let notifications = stored ? JSON.parse(stored) : this.getMockNotifications();
            notifications = notifications.filter(n => !n.read);
            localStorage.setItem('school_notifications', JSON.stringify(notifications));
            return { success: true, deleted: notifications.length };
        }
    },

    async getUnreadCount() {
        try {
            const response = await api.get('/notifications/unread-count');
            return response.data.count;
        } catch (error) {
            const stored = localStorage.getItem('school_notifications');
            const notifications = stored ? JSON.parse(stored) : this.getMockNotifications();
            return notifications.filter(n => !n.read).length;
        }
    },

    async subscribeToPush() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.warn('Push notifications not supported');
            return null;
        }

        try {
            notificationPermission = await Notification.requestPermission();
            
            if (notificationPermission !== 'granted') {
                return null;
            }

            const registration = await navigator.serviceWorker.ready;
            
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                pushSubscription = existingSubscription;
                return existingSubscription;
            }

            const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                console.warn('VAPID public key not configured');
                return null;
            }

            pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            await api.post('/notifications/push/subscribe', pushSubscription);
            
            return pushSubscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    },

    async unsubscribeFromPush() {
        if (!pushSubscription) return;

        try {
            await pushSubscription.unsubscribe();
            await api.post('/notifications/push/unsubscribe');
            pushSubscription = null;
        } catch (error) {
            console.error('Failed to unsubscribe from push:', error);
        }
    },

    async getPushSubscription() {
        if (!('serviceWorker' in navigator)) return null;
        
        try {
            const registration = await navigator.serviceWorker.ready;
            return await registration.pushManager.getSubscription();
        } catch (error) {
            return null;
        }
    },

    showLocalNotification(title, options = {}) {
        if (notificationPermission !== 'granted') return;

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    ...options
                });
            });
        } else {
            new Notification(title, options);
        }
    },

    async updateNotificationPreferences(preferences) {
        try {
            return await api.put('/notifications/preferences', preferences);
        } catch (error) {
            localStorage.setItem('notification_preferences', JSON.stringify(preferences));
            return { success: true, ...preferences };
        }
    },

    async getNotificationPreferences() {
        try {
            const response = await api.get('/notifications/preferences');
            return response.data;
        } catch (error) {
            const stored = localStorage.getItem('notification_preferences');
            return stored ? JSON.parse(stored) : {
                email: true,
                push: true,
                sms: false,
                types: {
                    task: true,
                    project: true,
                    message: true,
                    system: false
                }
            };
        }
    },

    async sendTestNotification() {
        try {
            return await api.post('/notifications/test');
        } catch (error) {
            this.showLocalNotification('Test Notification', {
                body: 'This is a test notification from SchoolOS',
                tag: 'test'
            });
            return { success: true };
        }
    },

    async getNotificationSettings() {
        try {
            return await api.get('/notifications/settings');
        } catch (error) {
            return {
                sound: true,
                vibration: true,
                doNotDisturb: {
                    enabled: false,
                    start: '22:00',
                    end: '07:00'
                },
                quietHours: {
                    enabled: false,
                    hours: {}
                }
            };
        }
    },

    async updateNotificationSettings(settings) {
        try {
            return await api.put('/notifications/settings', settings);
        } catch (error) {
            return { success: true, ...settings };
        }
    }
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default notificationService;
