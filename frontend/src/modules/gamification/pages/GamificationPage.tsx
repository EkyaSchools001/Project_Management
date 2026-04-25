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
        <div className="w-8 h-8 border-3 border-[#ef4444] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-4 lg:p-8 bg-background min-h-screen"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Teacher Achievements</h1>
          <p className="text-muted-foreground text-sm font-bold mt-1">Track your professional growth and milestones</p>
        </div>
        {stats && (
          <div className="flex items-center gap-6 px-6 py-3 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Points</p>
                <p className="text-xl font-black text-foreground">{stats.totalPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-border" />
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-warning" />
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Growth Streak</p>
                <p className="text-xl font-black text-foreground">{stats.streak} days</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
          <LevelProgress />

          <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <Award size={20} className="text-primary" />
                </div>
                Development Badges
              </h2>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{earnedBadges.length}/{badges.length} earned</span>
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

          <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center border border-warning/20">
                  <Star size={20} className="text-warning" />
                </div>
                Milestones
              </h2>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{earnedAchievements.length}/{achievements.length} unlocked</span>
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
            <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Target size={20} className="text-primary" />
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
          
          <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-tight">Growth Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Points</span>
                <span className="font-black text-primary text-lg">{stats?.totalPoints?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Current Level</span>
                <span className="font-black text-foreground text-lg">{stats?.level || 1}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Badges Earned</span>
                <span className="font-black text-foreground text-lg">{earnedBadges.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Milestones</span>
                <span className="font-black text-foreground text-lg">{earnedAchievements.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Weekly Growth</span>
                <span className="font-black text-foreground text-lg">{stats?.weeklyPoints || 0}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}