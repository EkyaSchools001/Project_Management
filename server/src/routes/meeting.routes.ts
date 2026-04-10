import { Router } from 'express';
import {
    createInstantMeeting,
    scheduleMeeting,
    listMeetings,
    getMeetingById,
    updateMeeting,
    cancelMeeting,
    joinMeeting,
    leaveMeeting
} from '../controllers/meeting.controller';

const router = Router();

router.post('/', createInstantMeeting);
router.post('/schedule', scheduleMeeting);
router.get('/', listMeetings);
router.get('/:id', getMeetingById);
router.put('/:id', updateMeeting);
router.delete('/:id', cancelMeeting);
router.post('/:id/join', joinMeeting);
router.post('/:id/leave', leaveMeeting);

export default router;
