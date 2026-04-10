// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/authContext';
import gamificationService from '../../../services/gamification.service';
import { useToast } from '../../../hooks/use-toast';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await gamificationService.getUserStats(user.id);
      if (stats && data.totalPoints > stats.totalPoints) {
        const pointsEarned = data.totalPoints - stats.totalPoints;
        toast.success(`+${pointsEarned} points earned!`, { duration: 4000 });
      }
      setStats(data);
      setLastFetch(new Date());
    } catch (error) {
      console.error('Failed to fetch gamification stats:', error);
    }
  }, [user?.id, stats]);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  const value = {
    stats,
    refreshStats,
    isLoading: !stats && lastFetch === null
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    return { stats: null, refreshStats: () => {}, isLoading: true };
  }
  return context;
}

export default GamificationProvider;