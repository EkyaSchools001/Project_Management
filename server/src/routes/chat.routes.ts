import { Router } from 'express';
import {
    addReaction,
    removeReaction,
    createThread,
    getThread,
    uploadMessageFile,
    searchMessages,
    editMessage,
    deleteMessage,
    getTypingStatus,
    sendTypingIndicator
} from '../controllers/chat.controller';

const router = Router();

router.post('/rooms/:id/messages/:msgId/reactions', addReaction);
router.delete('/rooms/:id/messages/:msgId/reactions/:emoji', removeReaction);
router.post('/rooms/:id/messages/:msgId/thread', createThread);
router.get('/rooms/:id/messages/:msgId/thread', getThread);
router.post('/rooms/:id/messages/:msgId/files', uploadMessageFile);
router.get('/rooms/:id/search', searchMessages);
router.put('/rooms/:id/messages/:msgId/edit', editMessage);
router.delete('/rooms/:id/messages/:msgId', deleteMessage);
router.get('/rooms/:id/typing', getTypingStatus);
router.post('/rooms/:id/typing', sendTypingIndicator);

export default router;
