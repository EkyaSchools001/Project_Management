import React from 'react';
import { Trophy, Lock, Check, Star } from 'lucide-react';
import { Card } from '../../../components/ui/card';

const iconMap = {
  'trending-up': '📈',
  'award': '🏅',
  'crown': '👑',
  'medal': '🎖️',
  'shield': '🛡️',
  'zap': '⚡',
  'flame': '🔥',
  'star': '⭐',
  'default': '🏆'
};

export function AchievementCard({ achievement, earned = false, onClick }) {
  const icon = iconMap[achievement.icon] || iconMap['default'];

  return (
    <Card 
      className={`
        relative p-5 rounded-[1.5rem] border transition-all duration-500 cursor-pointer group shadow-sm
        ${earned 
          ? 'bg-card border-primary/30 hover:border-primary hover:shadow-lg' 
          : 'bg-card border-border hover:border-primary/20 hover:bg-muted'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all duration-500
          ${earned ? 'bg-primary/10 shadow-inner' : 'bg-muted'}
        `}>
          {icon}
          {!earned && <Lock size={16} className="absolute text-muted-foreground/20" />}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-black text-sm uppercase tracking-tight truncate ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
              {achievement.name}
            </h3>
            {earned && <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-sm"><Check size={12} className="text-white" /></div>}
          </div>
          
          <p className={`text-[11px] font-bold mt-1 ${earned ? 'text-muted-foreground' : 'text-muted-foreground/40'} line-clamp-2`}>
            {achievement.description}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
              <Star size={12} className="text-primary fill-primary/20" />
              <span className="text-[10px] font-black text-primary tracking-widest">{achievement.points} PTS</span>
            </div>
            
            {!earned && achievement.criteria && (
              <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                {JSON.parse(achievement.criteria).type === 'level' && `Reach level ${JSON.parse(achievement.criteria).value}`}
                {JSON.parse(achievement.criteria).type === 'badges' && `Earn ${JSON.parse(achievement.criteria).value} badges`}
                {JSON.parse(achievement.criteria).type === 'points' && `Earn ${JSON.parse(achievement.criteria).value} points`}
                {JSON.parse(achievement.criteria).type === 'streak' && `${JSON.parse(achievement.criteria).value} day streak`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AchievementCard;