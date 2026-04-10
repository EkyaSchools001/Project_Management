// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/authContext';
import gamificationService from '../../../services/gamification.service';

const periodOptions = [
  { value: 'Daily', label: 'Today' },
  { value: 'Weekly', label: 'This Week' },
  { value: 'Monthly', label: 'This Month' },
  { value: 'AllTime', label: 'All Time' }
];

const rankConfig = {
  1: { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  2: { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-300/10', border: 'border-gray-300/30' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30' }
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('Weekly');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await gamificationService.getLeaderboard(period, 100);
      setEntries(data);
      
      if (user?.id) {
        const userEntry = data.find(e => e.userId === user.id);
        setCurrentUserRank(userEntry?.rank || null);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedEntries = entries.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(entries.length / pageSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-4 lg:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Leaderboard</h1>
          <p className="text-white/40 text-sm mt-1">See how you rank against others</p>
        </div>
        
        {currentUserRank && (
          <div className="flex items-center gap-3 px-6 py-3 bg-[#BAFF00]/10 border border-[#BAFF00]/30 rounded-2xl">
            <Trophy size={24} className="text-[#BAFF00]" />
            <div>
              <p className="text-xs text-[#BAFF00] font-bold uppercase tracking-widest">Your Rank</p>
              <p className="text-2xl font-black text-white">#{currentUserRank}</p>
            </div>
          </div>
        )}
      </div>

      <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-white/5 rounded-lg p-1">
            {periodOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setPeriod(opt.value); setPage(1); }}
                className={`
                  px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all
                  ${period === opt.value ? 'bg-[#BAFF00] text-black' : 'text-white/40 hover:text-white'}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <p className="text-xs text-white/40">
            {entries.length} participants
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            No leaderboard data available
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedEntries.map((entry) => {
                const config = rankConfig[entry.rank];
                const isCurrentUser = entry.userId === user?.id;
                
                return (
                  <div 
                    key={entry.userId}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl transition-all
                      ${isCurrentUser ? 'bg-[#BAFF00]/10 border border-[#BAFF00]/30' : 'bg-white/5 hover:bg-white/10'}
                    `}
                  >
                    <div className="w-12 flex justify-center">
                      {config ? (
                        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center border ${config.border}`}>
                          <config.icon size={20} className={config.color} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center">
                          <span className="font-black text-lg text-white/40">#{entry.rank}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                      {entry.userName?.charAt(0).toUpperCase() || '?'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-lg truncate ${isCurrentUser ? 'text-[#BAFF00]' : 'text-white'}`}>
                        {entry.userName}
                      </p>
                      <p className="text-xs text-white/40">Level {entry.level}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-[#BAFF00]">
                        {entry.score.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-white/40">points</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-white/60">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
}