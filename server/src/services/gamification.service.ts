import { PrismaClient, BadgeCategory, LeaderboardPeriod } from '@prisma/client';

const prisma = new PrismaClient();

export class GamificationService {
  async getAllBadges() {
    return prisma.badge.findMany({
      orderBy: { category: 'asc' }
    });
  }

  async getBadgeById(id: string) {
    return prisma.badge.findUnique({ where: { id } });
  }

  async getBadgesByCategory(category: BadgeCategory) {
    return prisma.badge.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
  }

  async createBadge(data: {
    name: string;
    description: string;
    icon: string;
    criteria: string;
    category: BadgeCategory;
    points: number;
  }) {
    return prisma.badge.create({ data });
  }

  async updateBadge(id: string, data: Partial<{
    name: string;
    description: string;
    icon: string;
    criteria: string;
    category: BadgeCategory;
    points: number;
  }>) {
    return prisma.badge.update({ where: { id }, data });
  }

  async deleteBadge(id: string) {
    return prisma.badge.delete({ where: { id } });
  }

  async awardBadge(userId: string, badgeId: string) {
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } }
    });
    if (existing) return existing;

    const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) throw new Error('Badge not found');

    const userBadge = await prisma.userBadge.create({
        data: { userId, badgeId }
      });
      await this.addPoints(userId, badge.points, 'badge', badgeId, `Earned badge: ${badge.name}`);

    await this.checkAchievements(userId);
    await this.updateLevel(userId);

    return userBadge;
  }

  async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' }
    });
  }

  async getUnearnedBadges(userId: string) {
    const earnedBadgeIds = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true }
    });
    const earnedIds = earnedBadgeIds.map(ub => ub.badgeId);

    return prisma.badge.findMany({
      where: { id: { notIn: earnedIds } }
    });
  }

  async getAllAchievements() {
    return prisma.achievement.findMany({
      orderBy: { points: 'desc' }
    });
  }

  async getAchievementById(id: string) {
    return prisma.achievement.findUnique({ where: { id } });
  }

  async createAchievement(data: {
    name: string;
    description: string;
    icon: string;
    points: number;
    criteria: string;
  }) {
    return prisma.achievement.create({ data });
  }

  async updateAchievement(id: string, data: Partial<{
    name: string;
    description: string;
    icon: string;
    points: number;
    criteria: string;
  }>) {
    return prisma.achievement.update({ where: { id }, data });
  }

  async deleteAchievement(id: string) {
    return prisma.achievement.delete({ where: { id } });
  }

  async awardAchievement(userId: string, achievementId: string) {
    const existing = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId } }
    });
    if (existing) return existing;

    const achievement = await prisma.achievement.findUnique({ where: { id: achievementId } });
    if (!achievement) throw new Error('Achievement not found');

    const userAchievement = await prisma.userAchievement.create({
        data: { userId, achievementId }
      });
      await this.addPoints(userId, achievement.points, 'achievement', achievementId, `Earned achievement: ${achievement.name}`);

    await this.updateLevel(userId);

    return userAchievement;
  }

  async getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' }
    });
  }

  async checkAchievements(userId: string) {
    const userStats = await this.getUserStats(userId);
    if (!userStats) return [];

    const achievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    });
    const earnedIds = userAchievements.map(ua => ua.achievementId);

    const newlyEarned = [];
    for (const achievement of achievements) {
      if (earnedIds.includes(achievement.id)) continue;

      try {
        const criteria = JSON.parse(achievement.criteria);
        let earned = false;

        if (criteria.type === 'points' && userStats.totalPoints >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'badges' && userStats.earnedBadges >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'streak' && userStats.streak >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'level' && userStats.level >= criteria.value) {
          earned = true;
        }

        if (earned) {
          await this.awardAchievement(userId, achievement.id);
          newlyEarned.push(achievement);
        }
      } catch {
        continue;
      }
    }

    return newlyEarned;
  }

  async addPoints(userId: string, points: number, source: string, sourceId?: string, description?: string) {
    const [pointsHistory, stats] = await prisma.$transaction([
      prisma.pointsHistory.create({
        data: { userId, points, source, sourceId, description }
      }),
      prisma.userGamificationStats.upsert({
        where: { userId },
        create: { userId },
        update: {}
      })
    ]);

    await prisma.userGamificationStats.update({
      where: { userId },
      data: {
        totalPoints: { increment: points },
        weeklyPoints: { increment: points },
        monthlyPoints: { increment: points },
        lastActivity: new Date()
      }
    });

    await this.updateLeaderboard(userId);
    await this.updateStreak(userId);

    return pointsHistory;
  }

  async getUserStats(userId: string) {
    const stats = await prisma.userGamificationStats.findUnique({
      where: { userId }
    });

    if (!stats) return null;

    const earnedBadges = await prisma.userBadge.count({ where: { userId } });
    const earnedAchievements = await prisma.userAchievement.count({ where: { userId } });

    return { ...stats, earnedBadges, earnedAchievements };
  }

  async getOrCreateUserStats(userId: string) {
    return prisma.userGamificationStats.upsert({
      where: { userId },
      create: { userId },
      update: {}
    });
  }

  async getProgressToNextLevel(userId: string) {
    const stats = await this.getUserStats(userId);
    if (!stats) return null;

    const currentLevel = await prisma.gamificationLevel.findFirst({
      where: { minPoints: { lte: stats.totalPoints }, maxPoints: { gte: stats.totalPoints } }
    });

    const nextLevel = await prisma.gamificationLevel.findFirst({
      where: { level: currentLevel ? currentLevel.level + 1 : 2 }
    });

    if (!nextLevel) {
      return {
        currentLevel: currentLevel || { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 0, perks: null },
        nextLevel: null,
        progress: 100,
        pointsToNextLevel: 0
      };
    }

    const currentMax = currentLevel?.maxPoints || 0;
    const currentMin = currentLevel?.minPoints || 0;
    const pointsInLevel = stats.totalPoints - currentMin;
    const pointsNeeded = currentMax - currentMin;
    const progress = Math.min(100, Math.round((pointsInLevel / pointsNeeded) * 100));

    return {
      currentLevel: currentLevel || { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 0, perks: null },
      nextLevel,
      progress,
      pointsToNextLevel: Math.max(0, nextLevel.minPoints - stats.totalPoints)
    };
  }

  async updateLevel(userId: string) {
    const stats = await this.getUserStats(userId);
    if (!stats) return null;

    const newLevel = await prisma.gamificationLevel.findFirst({
      where: { minPoints: { lte: stats.totalPoints }, maxPoints: { gte: stats.totalPoints } }
    });

    if (newLevel && newLevel.level !== stats.level) {
      await prisma.userGamificationStats.update({
        where: { userId },
        data: { level: newLevel.level }
      });

      await this.addPoints(userId, newLevel.level * 100, 'level_up', null, `Reached level ${newLevel.level}: ${newLevel.name}`);
    }

    return newLevel;
  }

  async updateStreak(userId: string) {
    const stats = await prisma.userGamificationStats.findUnique({ where: { userId } });
    if (!stats) return;

    const lastActivity = new Date(stats.lastActivity);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = stats.streak;
    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      newStreak += 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    await prisma.userGamificationStats.update({
      where: { userId },
      data: { streak: newStreak }
    });
  }

  async getLeaderboard(period: LeaderboardPeriod = LeaderboardPeriod.Weekly, limit = 50) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case LeaderboardPeriod.Daily:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case LeaderboardPeriod.Weekly:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case LeaderboardPeriod.Monthly:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case LeaderboardPeriod.AllTime:
      default:
        startDate = new Date(0);
    }

    const users = await prisma.userGamificationStats.findMany({
      where: { updatedAt: { gte: startDate } },
      orderBy: [
        { totalPoints: 'desc' },
        { lastActivity: 'asc' }
      ],
      take: limit,
      include: { user: { select: { id: true, name: true } } }
    });

    return users.map((stats, index) => ({
      rank: index + 1,
      userId: stats.userId,
      userName: stats.user.name,
      score: period === LeaderboardPeriod.AllTime ? stats.totalPoints : (period === LeaderboardPeriod.Monthly ? stats.monthlyPoints : stats.weeklyPoints),
      totalPoints: stats.totalPoints,
      level: stats.level
    }));
  }

  async updateLeaderboard(userId: string, period: LeaderboardPeriod = LeaderboardPeriod.Weekly) {
    const stats = await this.getUserStats(userId);
    if (!stats) return;

    const score = period === LeaderboardPeriod.AllTime 
      ? stats.totalPoints 
      : period === LeaderboardPeriod.Monthly 
        ? stats.monthlyPoints 
        : stats.weeklyPoints;

    const allEntries = await prisma.leaderboard.findMany({
      where: { period },
      orderBy: { score: 'desc' }
    });

    const currentRank = allEntries.findIndex(e => e.userId === userId) + 1;
    let newRank = currentRank;

    for (let i = 0; i < allEntries.length; i++) {
      if (allEntries[i].userId !== userId && allEntries[i].score < score) {
        newRank = i + 1;
        break;
      }
    }

    if (!currentRank) {
      newRank = allEntries.length + 1;
    }

    await prisma.leaderboard.upsert({
      where: { userId_period: { userId, period } },
      create: { userId, score, rank: newRank, period },
      update: { score, rank: newRank }
    });

    return { rank: newRank, score };
  }

  async getPointsHistory(userId: string, source?: string, limit = 50) {
    return prisma.pointsHistory.findMany({
      where: { userId, ...(source ? { source } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getAllLevels() {
    return prisma.gamificationLevel.findMany({
      orderBy: { level: 'asc' }
    });
  }

  async getLevelById(id: string) {
    return prisma.gamificationLevel.findUnique({ where: { id } });
  }

  async createLevel(data: {
    level: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    perks?: string;
  }) {
    return prisma.gamificationLevel.create({ data });
  }

  async updateLevelConfig(id: string, data: Partial<{
    name: string;
    minPoints: number;
    maxPoints: number;
    perks: string;
  }>) {
    return prisma.gamificationLevel.update({ where: { id }, data });
  }

  async getActiveChallenges() {
    const now = new Date();
    return prisma.challenge.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: { endDate: 'asc' }
    });
  }

  async getChallengeById(id: string) {
    return prisma.challenge.findUnique({ where: { id } });
  }

  async createChallenge(data: {
    name: string;
    description: string;
    icon: string;
    startDate: Date;
    endDate: Date;
    points: number;
    criteria: string;
    maxParticipants?: number;
  }) {
    return prisma.challenge.create({ data });
  }

  async joinChallenge(userId: string, challengeId: string) {
    const existing = await prisma.challengeParticipant.findUnique({
      where: { userId_challengeId: { userId, challengeId } }
    });
    if (existing) return existing;

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error('Challenge not found');

    if (challenge.maxParticipants && challenge.participantCount >= challenge.maxParticipants) {
      throw new Error('Challenge is full');
    }

    const [participant] = await prisma.$transaction([
      prisma.challengeParticipant.create({
        data: { userId, challengeId }
      }),
      prisma.challenge.update({
        where: { id: challengeId },
        data: { participantCount: { increment: 1 } }
      })
    ]);

    return participant;
  }

  async getUserChallenges(userId: string) {
    return prisma.challengeParticipant.findMany({
      where: { userId },
      include: { challenge: true },
      orderBy: { joinedAt: 'desc' }
    });
  }

  async updateChallengeProgress(userId: string, challengeId: string, progress: number) {
    return prisma.challengeParticipant.update({
      where: { userId_challengeId: { userId, challengeId } },
      data: { progress: Math.min(100, progress) }
    });
  }

  async completeChallenge(userId: string, challengeId: string) {
    const participant = await prisma.challengeParticipant.findUnique({
      where: { userId_challengeId: { userId, challengeId } }
    });
    if (!participant || participant.completed) return participant;

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error('Challenge not found');

    await prisma.challengeParticipant.update({
        where: { userId_challengeId: { userId, challengeId } },
        data: { completed: true, progress: 100 }
      });
      await this.addPoints(userId, challenge.points, 'challenge', challengeId, `Completed challenge: ${challenge.name}`);

    await this.checkAchievements(userId);
    await this.updateLevel(userId);

    return true;
  }

  async seedDefaultData() {
    const existingBadges = await prisma.badge.count();
    if (existingBadges === 0) {
      await prisma.badge.createMany({
        data: [
          { name: 'First Steps', description: 'Complete your first task', icon: 'footprints', criteria: JSON.stringify({ type: 'tasks', value: 1 }), category: BadgeCategory.Academic, points: 10 },
          { name: 'Quick Learner', description: 'Complete 5 tasks', icon: 'book-open', criteria: JSON.stringify({ type: 'tasks', value: 5 }), category: BadgeCategory.Academic, points: 25 },
          { name: 'Scholar', description: 'Complete 10 tasks', icon: 'graduation-cap', criteria: JSON.stringify({ type: 'tasks', value: 10 }), category: BadgeCategory.Academic, points: 50 },
          { name: 'Star Student', description: 'Earn 100 points', icon: 'star', criteria: JSON.stringify({ type: 'points', value: 100 }), category: BadgeCategory.Achievement, points: 75 },
          { name: 'Superstar', description: 'Earn 500 points', icon: 'trophy', criteria: JSON.stringify({ type: 'points', value: 500 }), category: BadgeCategory.Achievement, points: 150 },
          { name: 'Helpful Hand', description: 'Help another user', icon: 'hand-heart', criteria: JSON.stringify({ type: 'help', value: 1 }), category: BadgeCategory.Behavior, points: 20 },
          { name: 'Team Player', description: 'Participate in 5 tasks', icon: 'users', criteria: JSON.stringify({ type: 'participation', value: 5 }), category: BadgeCategory.Participation, points: 30 },
          { name: 'Consistency King', description: '7 day streak', icon: 'flame', criteria: JSON.stringify({ type: 'streak', value: 7 }), category: BadgeCategory.Special, points: 100 },
          { name: 'Early Bird', description: 'Complete a task before 8am', icon: 'sunrise', criteria: JSON.stringify({ type: 'time', value: 'early' }), category: BadgeCategory.Special, points: 15 },
          { name: 'Night Owl', description: 'Complete a task after 10pm', icon: 'moon', criteria: JSON.stringify({ type: 'time', value: 'late' }), category: BadgeCategory.Special, points: 15 },
        ]
      });
    }

    const existingAchievements = await prisma.achievement.count();
    if (existingAchievements === 0) {
      await prisma.achievement.createMany({
        data: [
          { name: 'Rising Star', description: 'Reach level 5', icon: 'trending-up', points: 100, criteria: JSON.stringify({ type: 'level', value: 5 }) },
          { name: 'Expert', description: 'Reach level 10', icon: 'award', points: 250, criteria: JSON.stringify({ type: 'level', value: 10 }) },
          { name: 'Master', description: 'Reach level 20', icon: 'crown', points: 500, criteria: JSON.stringify({ type: 'level', value: 20 }) },
          { name: 'Collector', description: 'Earn 5 badges', icon: 'medal', points: 75, criteria: JSON.stringify({ type: 'badges', value: 5 }) },
          { name: 'Badge Hunter', description: 'Earn 10 badges', icon: 'shield', points: 150, criteria: JSON.stringify({ type: 'badges', value: 10 }) },
          { name: 'Point Master', description: 'Earn 1000 points', icon: 'zap', points: 200, criteria: JSON.stringify({ type: 'points', value: 1000 }) },
          { name: 'Unstoppable', description: '30 day streak', icon: 'flame', points: 300, criteria: JSON.stringify({ type: 'streak', value: 30 }) },
        ]
      });
    }

    const existingLevels = await prisma.gamificationLevel.count();
    if (existingLevels === 0) {
      await prisma.gamificationLevel.createMany({
        data: [
          { level: 1, name: 'Novice', minPoints: 0, maxPoints: 100, perks: JSON.stringify(['Basic badges']) },
          { level: 2, name: 'Learner', minPoints: 101, maxPoints: 300, perks: JSON.stringify(['Access to learner badges', 'Priority support']) },
          { level: 3, name: 'Achiever', minPoints: 301, maxPoints: 600, perks: JSON.stringify(['Achievement badges', 'Profile customization']) },
          { level: 4, name: 'Expert', minPoints: 601, maxPoints: 1000, perks: JSON.stringify(['Expert badges', 'Leaderboard visibility']) },
          { level: 5, name: 'Master', minPoints: 1001, maxPoints: 2000, perks: JSON.stringify(['Master badges', 'Exclusive challenges']) },
          { level: 6, name: 'Champion', minPoints: 2001, maxPoints: 5000, perks: JSON.stringify(['Champion badges', 'Feature requests']) },
          { level: 7, name: 'Legend', minPoints: 5001, maxPoints: 10000, perks: JSON.stringify(['Legend badges', 'Beta features']) },
          { level: 8, name: 'Elite', minPoints: 10001, maxPoints: 25000, perks: JSON.stringify(['Elite badges', 'Direct feedback']) },
          { level: 9, name: 'Ultimate', minPoints: 25001, maxPoints: 50000, perks: JSON.stringify(['Ultimate badges', 'Advisory role']) },
          { level: 10, name: 'Grandmaster', minPoints: 50001, maxPoints: 999999999, perks: JSON.stringify(['Grandmaster badges', 'Community leadership']) },
        ]
      });
    }
  }
}

export const gamificationService = new GamificationService();