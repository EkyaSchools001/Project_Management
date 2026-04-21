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
  Academic: 'bg-violet-500/10 border-blue-500/30 text-blue-400',
  Behavior: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
  Achievement: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  Participation: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  Special: 'bg-pink-500/10 border-pink-500/30 text-pink-400'
};

export function BadgeCard({ badge, earned = false, progress = null, onClick }) {
  const icon = iconMap[badge.icon] || iconMap['default'];
  const categoryClass = categoryColors[badge.category] || categoryColors.Achievement;

  return (
    <Card 
      className={`
        relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer group
        ${earned 
          ? 'bg-[#161B22] border-[#8b5cf6]/30 hover:border-[#8b5cf6]/60 hover:shadow-[0_0_30px_rgba(186,255,0,0.1)]' 
          : 'bg-[#161B22] border-white/5 hover:border-white/20 hover:bg-white/5'
        }
      `}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`
          relative w-16 h-16 rounded-full flex items-center justify-center text-3xl
          ${earned ? 'bg-[#8b5cf6]/20 shadow-[0_0_20px_rgba(186,255,0,0.2)]' : 'bg-white/5'}
        `}>
          {icon}
          {earned && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center">
              <Check size={14} className="text-black" />
            </div>
          )}
          {!earned && (
            <div className="absolute inset-0 flex items-center justify-center bg-backgroundlack/40 rounded-full">
              <Lock size={16} className="text-foreground/40" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className={`font-bold text-sm ${earned ? 'text-foreground' : 'text-foreground/60'}`}>
            {badge.name}
          </h3>
          <p className={`text-xs ${earned ? 'text-foreground/60' : 'text-foreground/40'}`}>
            {badge.description}
          </p>
        </div>

        <div className={`
          px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
          ${categoryClass}
        `}>
          {badge.category}
        </div>

        <div className="flex items-center gap-2 text-[#8b5cf6]">
          <span className="text-xs font-bold">+{badge.points}</span>
          <span className="text-[10px] text-foreground/40">points</span>
        </div>

        {progress !== null && !earned && (
          <div className="w-full space-y-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8b5cf6] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <p className="text-[10px] text-foreground/40 text-center">
              {progress.toFixed(0)}% complete
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default BadgeCard;