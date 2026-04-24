import { Router } from 'express';
import {
    StartTimer,
    StopTimer,
    GetTimerStatus,
    GetEntries,
    CreateEntry,
    UpdateEntry,
    DeleteEntry,
    ApproveEntry,
    GetReport
} from '../controllers/time.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/start', authenticate, StartTimer);
router.post('/stop', authenticate, StopTimer);
router.get('/timer/status', authenticate, GetTimerStatus);

router.get('/entries', authenticate, GetEntries);
router.post('/entries', authenticate, CreateEntry);
router.put('/entries/:id', authenticate, UpdateEntry);
router.delete('/entries/:id', authenticate, DeleteEntry);
router.post('/entries/:id/approve', authenticate, ApproveEntry);

router.get('/report', authenticate, GetReport);

export default router;
