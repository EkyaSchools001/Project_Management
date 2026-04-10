// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Bell, Trash2, BellOff } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@pdi/components/ui/popover";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";
import { ScrollArea } from "@pdi/components/ui/scroll-area";
import { notificationService } from '@pdi/services/notificationService';
import { getSocket } from '@pdi/lib/socket';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@pdi/lib/utils';
import { toast } from 'sonner';

import { useAuth } from '@pdi/hooks/useAuth';
import { NotificationItem } from './NotificationItem';

interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: string;
    category: string;
    read: boolean;
    link?: string;
    createdAt: string;
}

export const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        const socket = getSocket();
        socket.emit('join_room', `user:${user.id}`);
        console.log(`NotificationBell: Joining room user:${user.id}`);

        socket.on('notification:new', (newNotification: NotificationData) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.info(`${newNotification.title}: ${newNotification.message.substring(0, 50)}${newNotification.message.length > 50 ? '...' : ''}`, {
                action: {
                    label: 'View',
                    onClick: () => {}
                }
            });
        });

        return () => {
            socket.off('notification:new');
            socket.emit('leave_room', `user:${user.id}`);
        };
    }, [user?.id]);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications({ limit: 20 });
            setNotifications(data.data);
            setUnreadCount(data.unread);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            const deletedNotification = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (deletedNotification && !deletedNotification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/5">
                    <Bell className="w-5 h-5 text-gray-500" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[1.2rem] flex justify-center items-center h-4 bg-red-500 border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4 mt-2" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] h-7 px-2 font-bold text-primary capitalize tracking-wider hover:bg-primary/5"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                <BellOff className="w-6 h-6 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">All caught up!</p>
                                <p className="text-xs text-gray-400 mt-1">No notifications to show right now.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t text-center">
                    <Button variant="ghost" className="w-full text-[10px] font-bold text-gray-500 capitalize tracking-widest h-8">
                        View All History
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
