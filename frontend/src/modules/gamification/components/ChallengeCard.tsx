// @ts-nocheck
import React, { useState } from 'react';
import { Target, Users, Clock, Gift, Check, Play } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const iconMap = {
  'target': '🎯',
  'star': '⭐',
  'flame': '🔥',
  'trophy': '🏆',
  'rocket': '🚀',
  'default': '🎯'
};

export function ChallengeCard({ challenge, userProgress = null, onJoin, onViewDetails }) {
  const [joining, setJoining] = useState(false);

  const icon = iconMap[challenge.icon] || iconMap['default'];
  
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const now = new Date();
  const isActive = now >= startDate && now <= endDate;
  const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  const isJoined = userProgress !== null;
  const progress = userProgress?.progress || 0;
  const isCompleted = userProgress?.completed || false;

  const handleJoin = async () => {
    if (!onJoin) return;
    setJoining(true);
    try {
      await onJoin(challenge.id);
    } catch (error) {
      console.error('Failed to join challenge:', error);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card 
      className={`
        relative p-6 rounded-3xl border transition-all duration-500 cursor-pointer shadow-sm group
        ${isActive 
          ? 'bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg' 
          : 'bg-card border-border opacity-70'
        }
      `}
      onClick={onViewDetails}
    >
      <div className="flex items-start gap-5">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-all duration-500 relative
          ${isActive ? 'bg-primary/10 shadow-inner' : 'bg-muted'}
        `}>
          {icon}
          {!isActive && (
            <div className="absolute inset-0 bg-background/60 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
              <Clock size={24} className="text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-foreground uppercase tracking-tight truncate">{challenge.name}</h3>
            {isCompleted && (
              <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-sm">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
          
          <p className="text-[11px] font-bold text-muted-foreground mt-1 line-clamp-2 leading-tight">
            {challenge.description}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users size={12} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">{challenge.participantCount}/{challenge.maxParticipants || '∞'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
              <Gift size={12} className="text-primary" />
              <span className="text-[10px] font-black text-primary tracking-widest">{challenge.points} PTS</span>
            </div>
            {isActive && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock size={12} className="text-warning" />
                <span className="text-[10px] font-black uppercase tracking-widest">{daysLeft}D Left</span>
              </div>
            )}
          </div>

          {isJoined && (
            <div className="mt-6 space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden border border-border shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-success' : 'bg-primary'}`}
                />
              </div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">{progress.toFixed(0)}% Complete</p>
            </div>
          )}

          {!isJoined && isActive && (
            <Button 
              onClick={(e) => { e.stopPropagation(); handleJoin(); }}
              disabled={joining}
              className="mt-5 w-full bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 rounded-xl h-10 shadow-lg shadow-primary/20"
            >
              {joining ? 'Processing...' : 'Participate Now'}
              {!joining && <Play size={12} className="ml-2 fill-white" />}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ChallengeCard;