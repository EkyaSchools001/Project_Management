// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { pushService } from '@pdi/services/push.service';

interface UsePushNotificationsOptions {
  autoSubscribe?: boolean;
  onNotification?: (event: NotificationEvent) => void;
}

interface NotificationEvent {
  title: string;
  body?: string;
  data?: any;
}

export const usePushNotifications = (options: UsePushNotificationsOptions = {}) => {
  const { autoSubscribe = false, onNotification } = options;
  
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupport = () => {
      const supported = pushService.isSupported();
      setIsSupported(supported);
      if (supported) {
        setPermission(pushService.getPermissionStatus());
      }
      setIsLoading(false);
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isSupported || !autoSubscribe) return;

    const checkExistingSubscription = async () => {
      try {
        const existingSub = await pushService.getSubscriptionStatus();
        setSubscription(existingSub);
      } catch (err) {
        console.error('Failed to check existing subscription:', err);
      }
    };

    checkExistingSubscription();
  }, [isSupported, autoSubscribe]);

  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const handlePushSubscription = (event: PushEvent) => {
      event.waitUntil(
        (async () => {
          try {
            const data = await event.data?.json();
            if (data && onNotification) {
              onNotification({
                title: data.title || 'New Notification',
                body: data.body,
                data: data.data,
              });
            }
          } catch (err) {
            console.error('Failed to handle push event:', err);
          }
        })()
      );
    };

    const handleNotificationClick = (event: NotificationEvent) => {
      event.waitUntil(
        (async () => {
          const data = event.notification.data;
          if (data?.url) {
            window.location.href = data.url;
          }
          event.notification.close();
        })()
      );
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });

        registration.addEventListener('push', handlePushSubscription as any);
        
        registration.showNotification = async function(title: string, options?: NotificationOptions) {
          const existingNotification = (self as any).registration?.notifications?.create;
          console.log('Showing notification:', title, options);
        };
      });
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.removeEventListener('push', handlePushSubscription as any);
        });
      }
    };
  }, [isSupported, onNotification]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return false;
    }

    try {
      const newPermission = await pushService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        setError(null);
        return true;
      } else {
        setError('Permission denied');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [isSupported]);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return null;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    setIsLoading(true);
    try {
      const newSubscription = await pushService.subscribe();
      setSubscription(newSubscription);
      setError(null);
      return newSubscription;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, requestPermission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      const success = await pushService.unsubscribe();
      if (success) {
        setSubscription(null);
        setError(null);
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !subscription) {
      setError('Push not subscribed');
      return false;
    }

    try {
      return await pushService.sendTestNotification();
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [isSupported, subscription]);

  const showLocalNotification = useCallback((title: string, options?: any) => {
    if (!isSupported || permission !== 'granted') return;
    pushService.showLocalNotification(title, options);
  }, [isSupported, permission]);

  return {
    permission,
    subscription,
    isSupported,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    showLocalNotification,
  };
};

export default usePushNotifications;