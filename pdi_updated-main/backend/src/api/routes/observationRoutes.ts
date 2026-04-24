import { Router } from 'express';
import { getAllObservations, createObservation, updateObservation, getObservationById } from '../controllers/observationController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect); // Protect all observation routes

router.get('/', getAllObservations);
router.get('/:id', getObservationById);

router.post('/', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN'), createObservation);
router.patch('/:id', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN', 'TEACHER'), updateObservation);

export default router;
