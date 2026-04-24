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
        relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer
        ${isActive ? 'bg-[#161B22] border-[#ef4444]/20 hover:border-[#ef4444]/40' : 'bg-[#161B22] border-white/5'}
      `}
      onClick={onViewDetails}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0
          ${isActive ? 'bg-[#ef4444]/20' : 'bg-white/5'}
        `}>
          {icon}
          {!isActive && <div className="absolute inset-0 bg-backgroundlack/60 rounded-xl flex items-center justify-center"><Clock size={20} className="text-foreground/40" /></div>}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground">{challenge.name}</h3>
            {isCompleted && <Check size={18} className="text-[#ef4444] shrink-0" />}
          </div>
          
          <p className="text-xs text-foreground/50 mt-1 line-clamp-2">
            {challenge.description}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-foreground/40">
              <Users size={12} />
              <span className="text-[10px]">{challenge.participantCount}/{challenge.maxParticipants || '∞'}</span>
            </div>
            <div className="flex items-center gap-1 text-[#ef4444]">
              <Gift size={12} />
              <span className="text-xs font-bold">{challenge.points} pts</span>
            </div>
            {isActive && (
              <div className="flex items-center gap-1 text-foreground/40">
                <Clock size={12} />
                <span className="text-[10px]">{daysLeft}d left</span>
              </div>
            )}
          </div>

          {isJoined && (
            <div className="mt-4 space-y-2">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-[#ef4444]' : 'bg-[#ef4444]/50'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-foreground/40 text-right">{progress.toFixed(0)}% complete</p>
            </div>
          )}

          {!isJoined && isActive && (
            <Button 
              onClick={(e) => { e.stopPropagation(); handleJoin(); }}
              disabled={joining}
              className="mt-4 bg-[#ef4444] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#a6e600]"
            >
              {joining ? 'Joining...' : 'Join Challenge'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ChallengeCard;