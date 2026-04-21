import React, { useState, useEffect } from 'react';
import { Loader2, Filter, Bell } from 'lucide-react';
import { Button } from '@pdi/components/ui/button';
import { ScrollArea } from '@pdi/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@pdi/components/ui/tabs';
import { NotificationItem } from './NotificationItem';
import { notificationService } from '@pdi/services/notificationService';
import { cn } from '@pdi/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationListProps {
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async (reset = false) => {
    setLoading(true);
    try {
      const params: any = { page: reset ? 1 : page, limit: 20 };
      if (filter !== 'all') {
        params.category = filter;
      }
      
      const result = await notificationService.getNotifications(params);
      const newNotifications = result.data || [];
      
      if (reset) {
        setNotifications(newNotifications);
        setPage(1);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
      
      setHasMore(newNotifications.length === 20);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#8b5cf6] text-black text-xs px-2 py-0.5 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="w-full justify-start gap-1 bg-transparent h-auto p-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-black"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="Task" 
              className="data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-black"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="Project" 
              className="data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-black"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="Message" 
              className="data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-black"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="System" 
              className="data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-black"
            >
              System
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <ScrollArea className="flex-1">
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#8b5cf6]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-foreground/30" />
            </div>
            <p className="text-foreground/60">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClick={onNotificationClick}
              />
            ))}
            
            {hasMore && (
              <div className="p-4 text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationList;