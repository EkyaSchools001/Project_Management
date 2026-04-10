// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, Flame, Award, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import gamificationService from '../../../services/gamification.service';

export default function GamificationWidget() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await gamificationService.getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border p-6 rounded-2xl animate-pulse">
        <div className="h-40 bg-muted rounded-xl" />
      </Card>
    );
  }

  return (
    <Card 
      className="bg-card border-border p-6 rounded-2xl hover:border-primary/20 transition-all cursor-pointer shadow-sm"
      onClick={() => navigate('/gamification')}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Award size={20} className="text-primary" />
          </div>
          Your Progress
        </h3>
        <ChevronRight size={20} className="text-muted-foreground/40" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/30 rounded-xl text-center">
          <Zap size={24} className="mx-auto text-primary mb-2" />
          <p className="text-2xl font-black text-foreground">{stats?.totalPoints?.toLocaleString() || 0}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Points</p>
        </div>

        <div className="p-4 bg-muted/30 rounded-xl text-center">
          <Star size={24} className="mx-auto text-purple-500 mb-2" />
          <p className="text-2xl font-black text-foreground">{stats?.level || 1}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Level</p>
        </div>

        <div className="p-4 bg-muted/30 rounded-xl text-center">
          <Flame size={24} className="mx-auto text-orange-500 mb-2" />
          <p className="text-2xl font-black text-foreground">{stats?.streak || 0}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Weekly Progress</span>
          <span className="text-primary font-bold">+{stats?.weeklyPoints || 0} pts</span>
        </div>
      </div>
    </Card>
  );
}