import { Request, Response } from 'express';
import { gamificationService } from '../services/gamification.service';
import { LeaderboardPeriod, BadgeCategory } from '@prisma/client';

export class GamificationController {
  async getBadges(req: Request, res: Response) {
    try {
      const category = req.query.category as BadgeCategory | undefined;
      const badges = category 
        ? await gamificationService.getBadgesByCategory(category)
        : await gamificationService.getAllBadges();
      res.json({ status: 'success', data: badges });
    } catch (error) {
      console.error('Error fetching badges:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch badges' });
    }
  }

  async getBadgeById(req: Request, res: Response) {
    try {
      const badge = await gamificationService.getBadgeById(req.params.id);
      if (!badge) {
        return res.status(404).json({ status: 'error', message: 'Badge not found' });
      }
      res.json({ status: 'success', data: badge });
    } catch (error) {
      console.error('Error fetching badge:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch badge' });
    }
  }

  async createBadge(req: Request, res: Response) {
    try {
      const badge = await gamificationService.createBadge(req.body);
      res.status(201).json({ status: 'success', data: badge });
    } catch (error) {
      console.error('Error creating badge:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create badge' });
    }
  }

  async updateBadge(req: Request, res: Response) {
    try {
      const badge = await gamificationService.updateBadge(req.params.id, req.body);
      res.json({ status: 'success', data: badge });
    } catch (error) {
      console.error('Error updating badge:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update badge' });
    }
  }

  async deleteBadge(req: Request, res: Response) {
    try {
      await gamificationService.deleteBadge(req.params.id);
      res.json({ status: 'success', message: 'Badge deleted successfully' });
    } catch (error) {
      console.error('Error deleting badge:', error);
      res.status(500).json({ status: 'error', message: 'Failed to delete badge' });
    }
  }

  async awardBadge(req: Request, res: Response) {
    try {
      const { userId, badgeId } = req.body;
      const userBadge = await gamificationService.awardBadge(userId, badgeId);
      res.json({ status: 'success', data: userBadge });
    } catch (error) {
      console.error('Error awarding badge:', error);
      res.status(500).json({ status: 'error', message: 'Failed to award badge' });
    }
  }

  async getEarnedBadges(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const badges = await gamificationService.getUserBadges(userId as string);
      res.json({ status: 'success', data: badges });
    } catch (error) {
      console.error('Error fetching earned badges:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch earned badges' });
    }
  }

  async getUnearnedBadges(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const badges = await gamificationService.getUnearnedBadges(userId as string);
      res.json({ status: 'success', data: badges });
    } catch (error) {
      console.error('Error fetching unearned badges:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch unearned badges' });
    }
  }

  async getAchievements(req: Request, res: Response) {
    try {
      const achievements = await gamificationService.getAllAchievements();
      res.json({ status: 'success', data: achievements });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch achievements' });
    }
  }

  async getAchievementById(req: Request, res: Response) {
    try {
      const achievement = await gamificationService.getAchievementById(req.params.id);
      if (!achievement) {
        return res.status(404).json({ status: 'error', message: 'Achievement not found' });
      }
      res.json({ status: 'success', data: achievement });
    } catch (error) {
      console.error('Error fetching achievement:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch achievement' });
    }
  }

  async createAchievement(req: Request, res: Response) {
    try {
      const achievement = await gamificationService.createAchievement(req.body);
      res.status(201).json({ status: 'success', data: achievement });
    } catch (error) {
      console.error('Error creating achievement:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create achievement' });
    }
  }

  async updateAchievement(req: Request, res: Response) {
    try {
      const achievement = await gamificationService.updateAchievement(req.params.id, req.body);
      res.json({ status: 'success', data: achievement });
    } catch (error) {
      console.error('Error updating achievement:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update achievement' });
    }
  }

  async deleteAchievement(req: Request, res: Response) {
    try {
      await gamificationService.deleteAchievement(req.params.id);
      res.json({ status: 'success', message: 'Achievement deleted successfully' });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      res.status(500).json({ status: 'error', message: 'Failed to delete achievement' });
    }
  }

  async awardAchievement(req: Request, res: Response) {
    try {
      const { userId, achievementId } = req.body;
      const userAchievement = await gamificationService.awardAchievement(userId, achievementId);
      res.json({ status: 'success', data: userAchievement });
    } catch (error) {
      console.error('Error awarding achievement:', error);
      res.status(500).json({ status: 'error', message: 'Failed to award achievement' });
    }
  }

  async getEarnedAchievements(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const achievements = await gamificationService.getUserAchievements(userId as string);
      res.json({ status: 'success', data: achievements });
    } catch (error) {
      console.error('Error fetching earned achievements:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch earned achievements' });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const stats = await gamificationService.getOrCreateUserStats(userId as string);
      res.json({ status: 'success', data: stats });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch user stats' });
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const progress = await gamificationService.getProgressToNextLevel(userId as string);
      res.json({ status: 'success', data: progress });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch progress' });
    }
  }

  async getLeaderboard(req: Request, res: Response) {
    try {
      const period = (req.query.period as LeaderboardPeriod) || LeaderboardPeriod.Weekly;
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await gamificationService.getLeaderboard(period, limit);
      res.json({ status: 'success', data: leaderboard });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch leaderboard' });
    }
  }

  async getPointsHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const source = req.query.source as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await gamificationService.getPointsHistory(userId as string, source, limit);
      res.json({ status: 'success', data: history });
    } catch (error) {
      console.error('Error fetching points history:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch points history' });
    }
  }

  async getLevels(req: Request, res: Response) {
    try {
      const levels = await gamificationService.getAllLevels();
      res.json({ status: 'success', data: levels });
    } catch (error) {
      console.error('Error fetching levels:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch levels' });
    }
  }

  async createLevel(req: Request, res: Response) {
    try {
      const level = await gamificationService.createLevel(req.body);
      res.status(201).json({ status: 'success', data: level });
    } catch (error) {
      console.error('Error creating level:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create level' });
    }
  }

  async updateLevel(req: Request, res: Response) {
    try {
      const level = await gamificationService.updateLevelConfig(req.params.id, req.body);
      res.json({ status: 'success', data: level });
    } catch (error) {
      console.error('Error updating level:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update level' });
    }
  }

  async getActiveChallenges(req: Request, res: Response) {
    try {
      const challenges = await gamificationService.getActiveChallenges();
      res.json({ status: 'success', data: challenges });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch challenges' });
    }
  }

  async getUserChallenges(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const challenges = await gamificationService.getUserChallenges(userId as string);
      res.json({ status: 'success', data: challenges });
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch user challenges' });
    }
  }

  async joinChallenge(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { challengeId } = req.body;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const participant = await gamificationService.joinChallenge(userId, challengeId);
      res.json({ status: 'success', data: participant });
    } catch (error: any) {
      console.error('Error joining challenge:', error);
      res.status(500).json({ status: 'error', message: error.message || 'Failed to join challenge' });
    }
  }

  async updateChallengeProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { challengeId, progress } = req.body;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const result = await gamificationService.updateChallengeProgress(userId, challengeId, progress);
      res.json({ status: 'success', data: result });
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update challenge progress' });
    }
  }

  async completeChallenge(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { challengeId } = req.body;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }
      const result = await gamificationService.completeChallenge(userId, challengeId);
      res.json({ status: 'success', data: result });
    } catch (error: any) {
      console.error('Error completing challenge:', error);
      res.status(500).json({ status: 'error', message: error.message || 'Failed to complete challenge' });
    }
  }

  async seedData(req: Request, res: Response) {
    try {
      await gamificationService.seedDefaultData();
      res.json({ status: 'success', message: 'Default gamification data seeded successfully' });
    } catch (error) {
      console.error('Error seeding data:', error);
      res.status(500).json({ status: 'error', message: 'Failed to seed data' });
    }
  }
}

export const gamificationController = new GamificationController();