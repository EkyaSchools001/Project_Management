// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Avatar } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import gamificationService from '../../../services/gamification.service';

const periodOptions = [
  { value: 'Daily', label: 'Today' },
  { value: 'Weekly', label: 'This Week' },
  { value: 'Monthly', label: 'This Month' },
  { value: 'AllTime', label: 'All Time' }
];

const rankIcons = {
  1: <Crown size={18} className="text-yellow-400" />,
  2: <Medal size={18} className="text-gray-300" />,
  3: <Medal size={18} className="text-amber-600" />
};

export function Leaderboard({ limit = 10, showPeriodSelector = true, onViewAll }) {
  const [period, setPeriod] = useState('Weekly');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await gamificationService.getLeaderboard(period, limit);
      setEntries(data.slice(0, limit));
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank) => {
    if (rankIcons[rank]) return rankIcons[rank];
    return <span className="font-bold text-foreground/60">#{rank}</span>;
  };

  return (
    <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center">
            <Trophy size={20} className="text-[#8b5cf6]" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Leaderboard</h2>
        </div>
        
        {showPeriodSelector && (
          <div className="flex bg-white/5 rounded-lg p-1">
            {periodOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`
                  px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all
                  ${period === opt.value ? 'bg-[#8b5cf6] text-black' : 'text-foreground/40 hover:text-foreground'}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-foreground/40 text-sm">
          No leaderboard data available
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div 
              key={entry.userId}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group
                ${entry.isCurrentUser ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/30' : 'hover:bg-white/5'}
              `}
            >
              <div className="w-8 flex justify-center">
                {getRankDisplay(entry.rank)}
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-foreground font-bold text-sm">
                {entry.userName?.charAt(0).toUpperCase() || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">
                  {entry.userName}
                </p>
                <p className="text-[10px] text-foreground/40">Level {entry.level}</p>
              </div>

              <div className="text-right">
                <p className="font-black text-lg text-[#8b5cf6]">
                  {entry.score.toLocaleString()}
                </p>
                <p className="text-[10px] text-foreground/40">points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-xs font-bold text-foreground/60 hover:text-[#8b5cf6] transition-colors"
        >
          View Full Leaderboard
          <ChevronRight size={14} />
        </button>
      )}
    </Card>
  );
}

export default Leaderboard;