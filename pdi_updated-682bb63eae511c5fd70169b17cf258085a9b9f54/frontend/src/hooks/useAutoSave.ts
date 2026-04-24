import { useState, useEffect, useRef } from 'react';

interface AutoSaveProps<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  localStorageKey?: string;
  enabled?: boolean;
}

export const useAutoSave = <T>({
  data,
  onSave,
  debounceMs = 3000,
  localStorageKey,
  enabled = true,
}: AutoSaveProps<T>) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastSavedDataRef = useRef<string>(JSON.stringify(data));
  const dataRef = useRef<T>(data);

  // Update dataRef when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Handle LocalStorage persistence (optional backup)
  useEffect(() => {
    if (enabled && localStorageKey && data) {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }
  }, [data, localStorageKey, enabled]);

  // Debounced auto-save logic
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(async () => {
      const currentDataStr = JSON.stringify(dataRef.current);
      
      // Don't save if data hasn't changed since last save
      if (currentDataStr === lastSavedDataRef.current) return;
      if (!dataRef.current || Object.keys(dataRef.current as any).length === 0) return;

      try {
        setIsSaving(true);
        setError(null);
        await onSave(dataRef.current);
        lastSavedDataRef.current = currentDataStr;
        setLastSaved(new Date());
      } catch (err: any) {
        console.error('Auto-save failed:', err);
        setError(err.message || 'Auto-save failed');
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [data, onSave, debounceMs, enabled]);

  return { lastSaved, isSaving, error };
};
