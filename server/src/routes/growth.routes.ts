import { Router } from 'express';
import { getMetrics, createMetric, getTeamMetrics } from '../controllers/growth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/metrics', getMetrics);
router.post('/metrics', createMetric);
router.get('/team', getTeamMetrics);

export default router;
