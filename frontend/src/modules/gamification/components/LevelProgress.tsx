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
      <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl animate-pulse">
        <div className="h-20 bg-white/5 rounded-xl" />
      </Card>
    );
  }

  if (!progress) return null;

  const { currentLevel, nextLevel, progress: progressPercent, pointsToNextLevel } = progress;

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-[#161B22] border border-white/5 rounded-2xl">
        <div className="w-12 h-12 bg-[#BAFF00]/20 rounded-xl flex items-center justify-center">
          <Star size={24} className="text-[#BAFF00]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-white">Level {currentLevel.level}</span>
            <span className="text-xs text-white/40">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#BAFF00] to-[#7AFF00] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#BAFF00] to-[#7AFF00] rounded-2xl flex items-center justify-center">
            <Star size={32} className="text-black" />
          </div>
          <div>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Current Level</p>
            <h3 className="text-2xl font-black text-white">{currentLevel.name}</h3>
            <p className="text-xs text-[#BAFF00]">Level {currentLevel.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{progressPercent}%</p>
          <p className="text-[10px] text-white/40">to next level</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[#BAFF00] to-[#7AFF00] rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-black/50">
              {currentLevel.minPoints} - {currentLevel.maxPoints} pts
            </span>
          </div>
        </div>

        {nextLevel && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-white/40" />
              <span className="text-sm text-white/60">
                {pointsToNextLevel.toLocaleString()} points to
              </span>
              <span className="text-sm font-bold text-white">{nextLevel.name}</span>
            </div>
            <div className="px-3 py-1 bg-[#BAFF00]/10 rounded-lg">
              <span className="text-xs font-bold text-[#BAFF00]">Level {nextLevel.level}</span>
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="pt-4 border-t border-white/5">
            <p className="text-center text-sm text-[#BAFF00] font-bold">
              Maximum level reached! You are a Grandmaster!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default LevelProgress;