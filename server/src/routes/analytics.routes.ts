import { Router } from 'express';
import { getSystemSummary, getDepartmentDistribution, getRoleDistribution } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/summary', checkPermission('Management BI', 'view'), getSystemSummary);
router.get('/distribution', checkPermission('Management BI', 'view'), getDepartmentDistribution);
router.get('/roles', checkPermission('Management BI', 'view'), getRoleDistribution);

export default router;
