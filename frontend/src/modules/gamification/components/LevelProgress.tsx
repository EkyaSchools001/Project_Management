// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Star, Zap, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import gamificationService from '../../../services/gamification.service';

export function LevelProgress({ compact = false }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await gamificationService.getProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border p-6 rounded-2xl animate-pulse shadow-sm">
        <div className="h-20 bg-muted rounded-xl" />
      </Card>
    );
  }

  if (!progress) return null;

  const { currentLevel, nextLevel, progress: progressPercent, pointsToNextLevel } = progress;

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Star size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-black text-foreground">Level {currentLevel.level}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border p-8 rounded-3xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Star size={36} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Current Achievement Tier</p>
            <h3 className="text-3xl font-black text-foreground tracking-tight">{currentLevel.name}</h3>
            <p className="text-xs font-bold text-primary mt-1">Level {currentLevel.level} Educator</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-foreground tracking-tighter">{progressPercent}%</p>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Completion</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-6 bg-muted rounded-full overflow-hidden relative border border-border shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary via-rose-500 to-primary/80 rounded-full relative"
            style={{
              width: `${progressPercent}%`,
              transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
              {currentLevel.minPoints} / {currentLevel.maxPoints} pts
            </span>
          </div>
        </div>

        {nextLevel && (
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">
                <span className="text-primary">{pointsToNextLevel.toLocaleString()}</span> points remaining to reach
                <span className="text-foreground ml-1">{nextLevel.name}</span>
              </span>
            </div>
            <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Target: Level {nextLevel.level}</span>
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="pt-6 border-t border-border">
            <div className="bg-success/10 p-4 rounded-2xl border border-success/20">
              <p className="text-center text-sm text-success font-black uppercase tracking-widest">
                Elite Status: Maximum Professional Level Achieved!
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default LevelProgress;