// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { History, Plus, Minus, Gift, Award, Trophy, Flame, Target } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import gamificationService from '../../../services/gamification.service';

const sourceIcons = {
  badge: <Gift size={14} className="text-purple-400" />,
  achievement: <Award size={14} className="text-yellow-400" />,
  challenge: <Target size={14} className="text-blue-400" />,
  level_up: <Trophy size={14} className="text-green-400" />,
  streak: <Flame size={14} className="text-orange-400" />,
  default: <Plus size={14} className="text-[#BAFF00]" />
};

const sourceLabels = {
  badge: 'Badge Earned',
  achievement: 'Achievement Unlocked',
  challenge: 'Challenge Completed',
  level_up: 'Level Up',
  streak: 'Streak Bonus',
  task: 'Task Completed',
  default: 'Points'
};

export function PointsHistory({ limit = 20, filterable = true }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [sourceFilter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await gamificationService.getPointsHistory(sourceFilter || undefined, limit);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch points history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <History size={20} className="text-white/60" />
          </div>
          <h2 className="text-lg font-bold text-white">Points History</h2>
        </div>
      </div>

      {filterable && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSourceFilter('')}
            className={`
              px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap
              ${!sourceFilter ? 'bg-[#BAFF00] text-black' : 'bg-white/5 text-white/40 hover:text-white'}
            `}
          >
            All
          </button>
          <button
            onClick={() => setSourceFilter('badge')}
            className={`
              px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap
              ${sourceFilter === 'badge' ? 'bg-[#BAFF00] text-black' : 'bg-white/5 text-white/40 hover:text-white'}
            `}
          >
            Badges
          </button>
          <button
            onClick={() => setSourceFilter('achievement')}
            className={`
              px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap
              ${sourceFilter === 'achievement' ? 'bg-[#BAFF00] text-black' : 'bg-white/5 text-white/40 hover:text-white'}
            `}
          >
            Achievements
          </button>
          <button
            onClick={() => setSourceFilter('challenge')}
            className={`
              px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap
              ${sourceFilter === 'challenge' ? 'bg-[#BAFF00] text-black' : 'bg-white/5 text-white/40 hover:text-white'}
            `}
          >
            Challenges
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-white/40 text-sm">
          No points history yet
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {history.map((item) => (
            <div 
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                {sourceIcons[item.source] || sourceIcons.default}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {item.description || sourceLabels[item.source] || sourceLabels.default}
                </p>
                <p className="text-[10px] text-white/40">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <div className={`text-right shrink-0 ${item.points > 0 ? 'text-[#BAFF00]' : 'text-red-400'}`}>
                <p className="font-black text-lg">
                  {item.points > 0 ? '+' : ''}{item.points}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default PointsHistory;