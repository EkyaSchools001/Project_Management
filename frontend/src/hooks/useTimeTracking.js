import { useState, useEffect, useCallback, useRef } from 'react';
import timeService from '../services/time.service';

export function useTimeTracking() {
    const [activeTimer, setActiveTimer] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef(null);

    const loadActiveTimer = useCallback(async () => {
        try {
            const timer = await timeService.getActiveTimer();
            setActiveTimer(timer);
            if (timer) {
                const startTime = new Date(timer.startTime).getTime();
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }
        } catch (err) {
            console.error('Failed to load active timer:', err);
        }
    }, []);

    const loadEntries = useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            const result = await timeService.getTimeEntries(filters);
            setEntries(result.data || []);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const startTimer = useCallback(async (taskId, description = '') => {
        setLoading(true);
        try {
            const timer = await timeService.startTimer(taskId, description);
            setActiveTimer(timer);
            const startTime = new Date(timer.startTime).getTime();
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
            return timer;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const stopTimer = useCallback(async () => {
        if (!activeTimer) return null;
        
        setLoading(true);
        try {
            const entry = await timeService.stopTimer(activeTimer.id);
            setActiveTimer(null);
            setElapsed(0);
            return entry;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [activeTimer]);

    useEffect(() => {
        loadActiveTimer();
    }, [loadActiveTimer]);

    useEffect(() => {
        if (activeTimer) {
            intervalRef.current = setInterval(() => {
                const startTime = new Date(activeTimer.startTime).getTime();
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setElapsed(0);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeTimer]);

    const createEntry = useCallback(async (data) => {
        setLoading(true);
        try {
            const entry = await timeService.createManualEntry(data);
            return entry;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateEntry = useCallback(async (id, data) => {
        try {
            const entry = await timeService.updateEntry(id, data);
            setEntries(prev => prev.map(e => e.id === id ? entry : e));
            return entry;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteEntry = useCallback(async (id) => {
        try {
            await timeService.deleteEntry(id);
            setEntries(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const getReport = useCallback(async (userId, filters = {}) => {
        try {
            return await timeService.getTimeReport(userId, filters);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const formatElapsed = useCallback((seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        activeTimer,
        entries,
        loading,
        error,
        elapsed,
        startTimer,
        stopTimer,
        createEntry,
        updateEntry,
        deleteEntry,
        loadEntries,
        loadActiveTimer,
        getReport,
        formatElapsed,
        formatDuration: timeService.formatDuration.bind(timeService)
    };
}

export default useTimeTracking;