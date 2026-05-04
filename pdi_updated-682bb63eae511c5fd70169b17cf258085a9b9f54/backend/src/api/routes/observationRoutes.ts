import { Router } from 'express';
import { 
    getAllObservations, 
    createObservation, 
    updateObservation, 
    getObservationById,
    getClusters,
    getClusterById,
    createSchedule,
    getSchedules,
    submitStructuredObservation
} from '../controllers/observationController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getAllObservations);
router.get('/clusters', getClusters);
router.get('/clusters/:number', getClusterById);
router.get('/schedules', getSchedules);
router.get('/:id', getObservationById);

router.post('/schedules', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN', 'COORDINATOR'), createSchedule);
router.post('/submit-structured', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN', 'COORDINATOR'), submitStructuredObservation);
router.post('/', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN'), createObservation);
router.patch('/:id', restrictTo('ADMIN', 'LEADER', 'SUPERADMIN', 'TEACHER'), updateObservation);

export default router;
