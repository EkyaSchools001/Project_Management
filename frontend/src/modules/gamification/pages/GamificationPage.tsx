// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Award, Target, Flame, Zap, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import BadgeCard from '../components/BadgeCard';
import AchievementCard from '../components/AchievementCard';
import Leaderboard from '../components/Leaderboard';
import LevelProgress from '../components/LevelProgress';
import ChallengeCard from '../components/ChallengeCard';
import gamificationService from '../../../services/gamification.service';
import { useAuth } from '../../auth/authContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function GamificationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, allBadges, earned, allAchievements, earnedAch, activeChallenges] = await Promise.all([
        gamificationService.getUserStats(user?.id),
        gamificationService.getBadges(),
        gamificationService.getEarnedBadges(user?.id),
        gamificationService.getAchievements(),
        gamificationService.getEarnedAchievements(user?.id),
        gamificationService.getActiveChallenges()
      ]);

      setStats(statsData);
      setBadges(allBadges);
      setEarnedBadges(earned);
      setAchievements(allAchievements);
      setEarnedAchievements(earnedAch);
      setChallenges(activeChallenges);
    } catch (error) {
      console.error('Failed to fetch gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await gamificationService.joinChallenge(challengeId);
      await fetchData();
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const earnedBadgeIds = earnedBadges.map(eb => eb.badgeId);
  const earnedAchievementIds = earnedAchievements.map(ea => ea.achievementId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-4 lg:p-8"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Gamification</h1>
          <p className="text-white/40 text-sm mt-1">Track your progress and earn rewards</p>
        </div>
        {stats && (
          <div className="flex items-center gap-6 px-6 py-3 bg-[#161B22] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-[#BAFF00]" />
              <div>
                <p className="text-xs text-white/40">Total Points</p>
                <p className="text-xl font-black text-white">{stats.totalPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-orange-400" />
              <div>
                <p className="text-xs text-white/40">Streak</p>
                <p className="text-xl font-black text-white">{stats.streak} days</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
          <LevelProgress />

          <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-purple-400" />
                </div>
                Badges
              </h2>
              <span className="text-xs text-white/40">{earnedBadges.length}/{badges.length} earned</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={earnedBadgeIds.includes(badge.id)}
                />
              ))}
            </div>
          </Card>

          <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-yellow-400" />
                </div>
                Achievements
              </h2>
              <span className="text-xs text-white/40">{earnedAchievements.length}/{achievements.length} unlocked</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  earned={earnedAchievementIds.includes(achievement.id)}
                />
              ))}
            </div>
          </Card>

          {challenges.length > 0 && (
            <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-blue-400" />
                  </div>
                  Active Challenges
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoinChallenge}
                  />
                ))}
              </div>
            </Card>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Leaderboard limit={5} onViewAll={() => navigate('/gamification/leaderboard')} />
          
          <Card className="bg-[#161B22] border-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Total Points</span>
                <span className="font-black text-[#BAFF00]">{stats?.totalPoints?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Current Level</span>
                <span className="font-black text-white">{stats?.level || 1}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Badges Earned</span>
                <span className="font-black text-white">{earnedBadges.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Achievements</span>
                <span className="font-black text-white">{earnedAchievements.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Weekly Points</span>
                <span className="font-black text-white">{stats?.weeklyPoints || 0}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}