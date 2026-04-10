import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
    uploadFile,
    uploadFiles,
    uploadProfilePicture,
    uploadTaskAttachment,
    uploadProjectAttachment,
    listFiles,
    getFile,
    downloadFile,
    deleteFile,
    getMyFiles,
} from '../controllers/file.controller';

const router = Router();

router.post('/upload', authenticate, uploadFile);
router.post('/upload-multiple', authenticate, uploadFiles);
router.get('/', authenticate, listFiles);
router.get('/my-files', authenticate, getMyFiles);
router.get('/:id', authenticate, getFile);
router.get('/:id/download', authenticate, downloadFile);
router.delete('/:id', authenticate, deleteFile);
router.post('/profile-pic', authenticate, uploadProfilePicture);
router.post('/tasks/:taskId/attachment', authenticate, uploadTaskAttachment);
router.post('/projects/:projectId/attachment', authenticate, uploadProjectAttachment);

export default router;
