// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

export const useSession = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.getSessions();
            setSessions(data.sessions || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    }, []);

    const revokeSession = useCallback(async (sessionId) => {
        try {
            await authService.revokeSession(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            return true;
        } catch (err) {
            setError(err.message || 'Failed to revoke session');
            return false;
        }
    }, []);

    const logoutAllSessions = useCallback(async () => {
        setLoading(true);
        try {
            await authService.logoutAll();
            setSessions([]);
            return true;
        } catch (err) {
            setError(err.message || 'Failed to logout from all sessions');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return {
        sessions,
        loading,
        error,
        fetchSessions,
        revokeSession,
        logoutAllSessions,
        currentSession: sessions.find(s => s.isCurrent) || null,
        activeSessions: sessions.filter(s => !s.isExpired)
    };
};

export default useSession;
