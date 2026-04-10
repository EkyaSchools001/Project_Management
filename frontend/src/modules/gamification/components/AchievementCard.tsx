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
        relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer group
        ${earned 
          ? 'bg-gradient-to-br from-[#161B22] to-[#1a1f28] border-[#BAFF00]/30 hover:border-[#BAFF00]/60' 
          : 'bg-[#161B22] border-white/5 hover:border-white/20'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
          ${earned ? 'bg-[#BAFF00]/20' : 'bg-white/5'}
        `}>
          {icon}
          {!earned && <Lock size={16} className="absolute text-white/20" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-bold text-sm truncate ${earned ? 'text-white' : 'text-white/60'}`}>
              {achievement.name}
            </h3>
            {earned && <Check size={16} className="text-[#BAFF00] shrink-0" />}
          </div>
          
          <p className={`text-xs mt-1 ${earned ? 'text-white/60' : 'text-white/40'} line-clamp-2`}>
            {achievement.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5">
              <Star size={12} className="text-[#BAFF00]" />
              <span className="text-xs font-bold text-[#BAFF00]">{achievement.points} pts</span>
            </div>
            
            {!earned && achievement.criteria && (
              <span className="text-[10px] text-white/30">
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