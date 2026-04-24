import { Router } from 'express';
import {
    getAllGoals,
    createGoal,
    updateGoal,
    notifyWindowOpen,
    submitSelfReflection,
    initiateSelfReflection,
    submitGoalSetting,
    submitGoalCompletion,
    getGoalAnalyticsDashboard,
    requestWindowOpen
} from '../controllers/goalController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getAllGoals);
router.get('/analytics', getGoalAnalyticsDashboard);
router.post('/', createGoal);
router.post('/notify-window-open', notifyWindowOpen);
router.post('/request-window-open', restrictTo('TEACHER', 'LEADER', 'COORDINATOR'), requestWindowOpen);

router.post('/initiate-self-reflection', restrictTo('TEACHER', 'COORDINATOR'), initiateSelfReflection);
router.post('/:id/self-reflection', restrictTo('TEACHER', 'COORDINATOR'), submitSelfReflection);
router.post('/:id/goal-setting', restrictTo('SUPERADMIN', 'ADMIN', 'LEADER', 'COORDINATOR'), submitGoalSetting);
router.post('/:id/goal-completion', restrictTo('SUPERADMIN', 'ADMIN', 'LEADER', 'COORDINATOR'), submitGoalCompletion);

router.patch('/:id', updateGoal);

export default router;
