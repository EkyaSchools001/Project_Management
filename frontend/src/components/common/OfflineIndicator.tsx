import { useEffect, useState } from 'react';
import { WifiOff, CloudOff, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/usePWA';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOfflineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSynced, setShowSynced] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setIsSyncing(true);
      
      const syncEvent = new CustomEvent('app-sync-request');
      window.dispatchEvent(syncEvent);
      
      setTimeout(() => {
        setIsSyncing(false);
        setShowSynced(true);
        setTimeout(() => setShowSynced(false), 3000);
      }, 2000);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !wasOffline && !showSynced) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className={`
        flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300
        ${isOnline 
          ? showSynced 
            ? 'bg-red-500 text-foreground' 
            : 'bg-red-500 text-foreground'
          : 'bg-amber-500 text-amber-950'
        }
      `}>
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>You&apos;re offline. Some features may be unavailable.</span>
          </>
        ) : isSyncing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Syncing data...</span>
          </>
        ) : showSynced ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Back online! All data synced.</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            <span>Reconnecting...</span>
          </>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;