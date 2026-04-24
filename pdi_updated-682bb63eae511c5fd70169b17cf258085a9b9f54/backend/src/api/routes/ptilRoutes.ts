import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { createPTILRecord, getPTILRecords, updatePTILRecord, getPTILAnalytics, createPublicPTILRecord } from '../controllers/ptilController';

const router = Router();

// Public route - does NOT require authentication
router.post('/public/submit', createPublicPTILRecord);

// Apply authentication to all OTHER PTIL routes
router.use(protect);

router.get('/analytics', getPTILAnalytics);
router.route('/')
    .post(createPTILRecord)
    .get(getPTILRecords);
    
router.route('/:id')
    .patch(updatePTILRecord);

export default router;
