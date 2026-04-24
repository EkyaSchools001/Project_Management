import { Router } from 'express';
import { getGoalWindows, updateGoalWindow } from '../../controllers/pdi/goalWindowController';
import { protect, restrictTo } from '../../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getGoalWindows);
router.patch('/:phase', restrictTo('SUPERADMIN', 'ADMIN'), updateGoalWindow);

export default router;
