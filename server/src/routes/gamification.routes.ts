import { Router } from 'express';
import { gamificationController } from '../controllers/gamification.controller';

const router = Router();

router.get('/badges', gamificationController.getBadges);
router.get('/badges/:id', gamificationController.getBadgeById);
router.post('/badges', gamificationController.createBadge);
router.patch('/badges/:id', gamificationController.updateBadge);
router.delete('/badges/:id', gamificationController.deleteBadge);
router.post('/badges/award', gamificationController.awardBadge);
router.get('/badges/earned', gamificationController.getEarnedBadges);
router.get('/badges/unearned', gamificationController.getUnearnedBadges);

router.get('/achievements', gamificationController.getAchievements);
router.get('/achievements/:id', gamificationController.getAchievementById);
router.post('/achievements', gamificationController.createAchievement);
router.patch('/achievements/:id', gamificationController.updateAchievement);
router.delete('/achievements/:id', gamificationController.deleteAchievement);
router.post('/achievements/award', gamificationController.awardAchievement);
router.get('/achievements/earned', gamificationController.getEarnedAchievements);

router.get('/stats', gamificationController.getUserStats);
router.get('/progress', gamificationController.getProgress);

router.get('/leaderboard', gamificationController.getLeaderboard);

router.get('/points-history', gamificationController.getPointsHistory);

router.get('/levels', gamificationController.getLevels);
router.post('/levels', gamificationController.createLevel);
router.patch('/levels/:id', gamificationController.updateLevel);

router.get('/challenges', gamificationController.getActiveChallenges);
router.get('/challenges/user', gamificationController.getUserChallenges);
router.post('/challenges/join', gamificationController.joinChallenge);
router.patch('/challenges/progress', gamificationController.updateChallengeProgress);
router.post('/challenges/complete', gamificationController.completeChallenge);

router.post('/seed', gamificationController.seedData);

export default router;