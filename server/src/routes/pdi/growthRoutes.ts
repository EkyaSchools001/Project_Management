import { Router } from 'express';
import { getGrowthAnalytics, validateGrowthAccess } from '../../controllers/pdi/growthController';
import * as growthObservationController from '../../controllers/pdi/growthObservationController';
import { protect, restrictTo } from '../../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/analytics', restrictTo('ADMIN', 'SUPERADMIN', 'SCHOOL_LEADER', 'MANAGEMENT'), getGrowthAnalytics);
router.get('/validate-access/:teacherId', validateGrowthAccess);

// Unified Growth Observations
router.post('/observations', restrictTo('ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER'), growthObservationController.createGrowthObservation);
router.get('/observations', growthObservationController.getGrowthObservations);
router.get('/observations/:id', growthObservationController.getGrowthObservationById);
router.patch('/observations/:id', restrictTo('TEACHER', 'ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER'), growthObservationController.updateGrowthObservation);
export default router;
