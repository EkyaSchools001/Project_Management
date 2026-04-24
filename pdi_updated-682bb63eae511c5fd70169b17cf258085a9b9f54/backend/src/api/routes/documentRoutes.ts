import { Router } from 'express';
import * as documentController from '../controllers/documentController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// All routes are protected
router.use(protect);

// Teacher routes
router.get('/teacher/acknowledgements', documentController.getTeacherAcknowledgements);
router.post('/acknowledgements/:ackId/view', documentController.markAsViewed);
router.post('/acknowledgements/:ackId/acknowledge', documentController.acknowledgeDocument);

// Admin/Leader routes
router.use(restrictTo('ADMIN', 'LEADER', 'SUPERADMIN'));
router.get('/', documentController.getAllDocuments);
router.post('/upload', documentController.uploadDocument);
router.post('/assign', documentController.assignDocument);
router.delete('/:id', documentController.deleteDocument);

export default router;
