import { Router } from 'express';
import { gamificationController } from '../controllers/gamification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Badges — specific paths BEFORE /:id wildcard
router.get('/badges', gamificationController.getBadges);
router.get('/badges/earned', gamificationController.getEarnedBadges);
router.get('/badges/unearned', gamificationController.getUnearnedBadges);
router.post('/badges/award', gamificationController.awardBadge);
router.post('/badges', gamificationController.createBadge);
router.get('/badges/:id', gamificationController.getBadgeById);
router.patch('/badges/:id', gamificationController.updateBadge);
router.delete('/badges/:id', gamificationController.deleteBadge);

// Achievements — specific paths BEFORE /:id wildcard
router.get('/achievements', gamificationController.getAchievements);
router.get('/achievements/earned', gamificationController.getEarnedAchievements);
router.post('/achievements/award', gamificationController.awardAchievement);
router.post('/achievements', gamificationController.createAchievement);
router.get('/achievements/:id', gamificationController.getAchievementById);
router.patch('/achievements/:id', gamificationController.updateAchievement);
router.delete('/achievements/:id', gamificationController.deleteAchievement);

router.get('/stats', gamificationController.getUserStats);
router.get('/progress', gamificationController.getProgress);

router.get('/leaderboard', gamificationController.getLeaderboard);

router.get('/points-history', gamificationController.getPointsHistory);

router.get('/levels', gamificationController.getLevels);
router.post('/levels', gamificationController.createLevel);
router.patch('/levels/:id', gamificationController.updateLevel);

// Challenges — specific paths BEFORE wildcard verbs
router.get('/challenges', gamificationController.getActiveChallenges);
router.get('/challenges/user', gamificationController.getUserChallenges);
router.post('/challenges/join', gamificationController.joinChallenge);
router.patch('/challenges/progress', gamificationController.updateChallengeProgress);
router.post('/challenges/complete', gamificationController.completeChallenge);

router.post('/seed', gamificationController.seedData);

export default router;
