import { useState, useEffect } from 'react';
import { NetInfo, NetInfoState } from '@react-native-community/netinfo';

interface OfflineState {
  isOffline: boolean;
  isReconnecting: boolean;
}

export function useOffline() {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOffline: false,
    isReconnecting: false,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setOfflineState({
        isOffline: !state.isConnected,
        isReconnecting: state.isConnected === false,
      });
    });

    return () => unsubscribe();
  }, []);

  return offlineState;
}

export function useOfflineSync<T>(data: T[], syncFn: () => Promise<void>) {
  const { isOffline } = useOffline();
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    if (!isOffline && pendingSync) {
      syncFn().then(() => setPendingSync(false));
    }
  }, [isOffline]);

  const queueSync = () => {
    setPendingSync(true);
  };

  return { queueSync, pendingSync };
}