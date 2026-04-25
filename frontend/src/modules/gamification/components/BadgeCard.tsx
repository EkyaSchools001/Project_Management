// @ts-nocheck
import React from 'react';
import { Award, Lock, Check } from 'lucide-react';
import { Card } from '../../../components/ui/card';

const iconMap = {
  'footprints': '👣',
  'book-open': '📖',
  'graduation-cap': '🎓',
  'star': '⭐',
  'trophy': '🏆',
  'hand-heart': '🤝',
  'users': '👥',
  'flame': '🔥',
  'sunrise': '🌅',
  'moon': '🌙',
  'trending-up': '📈',
  'award': '🏅',
  'crown': '👑',
  'medal': '🎖️',
  'shield': '🛡️',
  'zap': '⚡',
  'default': '🏅'
};

const categoryColors = {
  Academic: 'bg-red-500/10 border-red-500/30 text-red-400',
  Behavior: 'bg-red-500/10 border-red-500/30 text-red-400',
  Achievement: 'bg-red-500/10 border-red-500/30 text-red-400',
  Participation: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  Special: 'bg-pink-500/10 border-pink-500/30 text-pink-400'
};

export function BadgeCard({ badge, earned = false, progress = null, onClick }) {
  const icon = iconMap[badge.icon] || iconMap['default'];
  const categoryClass = categoryColors[badge.category] || categoryColors.Achievement;

  return (
    <Card 
      className={`
        relative p-6 rounded-3xl border transition-all duration-500 cursor-pointer group shadow-sm
        ${earned 
          ? 'bg-card border-primary/30 hover:border-primary hover:shadow-xl hover:shadow-primary/5' 
          : 'bg-card border-border hover:border-primary/20 hover:bg-muted'
        }
      `}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-5">
        <div className={`
          relative w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl transition-all duration-500
          ${earned ? 'bg-primary/10 shadow-lg shadow-primary/10 scale-110' : 'bg-muted'}
        `}>
          {icon}
          {earned && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-background shadow-lg">
              <Check size={16} className="text-white" />
            </div>
          )}
          {!earned && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-[2rem] backdrop-blur-[1px]">
              <Lock size={18} className="text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className={`font-black text-sm uppercase tracking-tight ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
            {badge.name}
          </h3>
          <p className={`text-[11px] font-bold leading-tight ${earned ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
            {badge.description}
          </p>
        </div>

        <div className={`
          px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
          ${earned ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground/40'}
        `}>
          {badge.category}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-primary tracking-tighter">+{badge.points}</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth Pts</span>
        </div>

        {progress !== null && !earned && (
          <div className="w-full space-y-2 mt-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden border border-border shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-primary rounded-full transition-all duration-500"
              />
            </div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">
              {progress.toFixed(0)}% to achievement
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default BadgeCard;