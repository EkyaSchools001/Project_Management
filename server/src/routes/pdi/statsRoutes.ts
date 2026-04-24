import { Router } from 'express';
import { getAdminStats, getAdminRecentActivity, getAdminPendingActions } from '../../controllers/pdi/statsController';
import { protect, restrictTo } from '../../middlewares/auth';

const router = Router();

router.get('/admin', protect, restrictTo('ADMIN', 'SUPERADMIN'), getAdminStats);
router.get('/admin/recent-activity', protect, restrictTo('ADMIN', 'SUPERADMIN'), getAdminRecentActivity);
router.get('/admin/pending-actions', protect, restrictTo('ADMIN', 'SUPERADMIN'), getAdminPendingActions);

export default router;
