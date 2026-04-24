import { Router } from 'express';
import { getPdHistory, createPdEntry, triggerPdSnapshot } from '../controllers/pdController';
import { protect } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getPdHistory);
router.post('/', createPdEntry);
router.post('/snapshot', triggerPdSnapshot);

export default router;
