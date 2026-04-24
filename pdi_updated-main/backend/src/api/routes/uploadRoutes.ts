import { Router } from 'express';
import { uploadMiddleware, uploadFile } from '../controllers/uploadController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// Protect all upload routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPERADMIN', 'LEADER'));

router.post('/', uploadMiddleware, uploadFile);

export default router;
