import { Router } from 'express';
import { getSystemSummary, getDepartmentDistribution, getRoleDistribution } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', authorize('analytics:view'), getSystemSummary);
router.get('/distribution', authorize('analytics:view'), getDepartmentDistribution);
router.get('/roles', authorize('analytics:view'), getRoleDistribution);

export default router;
