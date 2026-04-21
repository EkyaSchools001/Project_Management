import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  MessageSquare, 
  FolderKanban, 
  ListTodo, 
  Bell,
  Trash2 
} from 'lucide-react';
import { Button } from '@pdi/components/ui/button';
import { cn } from '@pdi/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}) => {
  const getIcon = () => {
    switch (notification.category) {
      case 'Task':
        return <ListTodo className="w-5 h-5" />;
      case 'Project':
        return <FolderKanban className="w-5 h-5" />;
      case 'Message':
        return <MessageSquare className="w-5 h-5" />;
      case 'Alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'System':
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return 'text-green-500 bg-green-500/10';
      case 'WARNING':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'ERROR':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-blue-500 bg-backgroundackgroundlue-500/10';
    }
  };

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-4 hover:bg-white/5 cursor-pointer transition-all relative',
        !notification.read && 'bg-white/5'
      )}
      onClick={handleClick}
    >
      <div className={cn('p-2 rounded-lg shrink-0', getTypeColor())}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            'font-medium truncate',
            !notification.read ? 'text-foreground' : 'text-foreground/70'
          )}>
            {notification.title}
          </p>
          {notification.type !== 'INFO' && (
            <span className={cn('shrink-0', getTypeColor())}>
              {getTypeIcon()}
            </span>
          )}
        </div>

        <p className="text-sm text-foreground/50 line-clamp-2 mt-1">
          {notification.message}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-foreground/30">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
          {!notification.read && (
            <span className="w-2 h-2 bg-[#BAFF00] rounded-full" />
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default NotificationItem;