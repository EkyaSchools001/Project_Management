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
    <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Trophy size={20} className="text-primary" />
          </div>
          <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Leaderboard</h2>
        </div>
        
        {showPeriodSelector && (
          <div className="flex bg-muted p-1 rounded-xl border border-border shadow-inner">
            {periodOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`
                  px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all
                  ${period === opt.value ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}
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
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-bold text-sm">
          No records found for this period
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div 
              key={entry.userId}
              className={`
                flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer group
                ${entry.isCurrentUser ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted border border-transparent'}
              `}
            >
              <div className="w-8 flex justify-center">
                {getRankDisplay(entry.rank)}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                {entry.userName?.charAt(0).toUpperCase() || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-foreground truncate">
                  {entry.userName}
                </p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Level {entry.level}</p>
              </div>

              <div className="text-right">
                <p className="font-black text-lg text-primary tracking-tighter">
                  {entry.score.toLocaleString()}
                </p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-all border-t border-border"
        >
          View Full Leaderboard
          <ChevronRight size={14} />
        </button>
      )}
    </Card>
  );
}

export default Leaderboard;