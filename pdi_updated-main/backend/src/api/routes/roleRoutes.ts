import { Router } from 'express';
import * as roleController from '../controllers/roleController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// Roles - only SuperAdmin can manage
router.get('/', protect, roleController.getRoles);
router.post('/', protect, restrictTo('SUPERADMIN'), roleController.createRole);
router.put('/:id', protect, restrictTo('SUPERADMIN'), roleController.updateRole);
router.delete('/:id', protect, restrictTo('SUPERADMIN'), roleController.deleteRole);

// Dashboard Templates
router.get('/templates/list', protect, roleController.getTemplates);
router.post('/templates', protect, restrictTo('SUPERADMIN'), roleController.createTemplate);
router.put('/templates/:id', protect, restrictTo('SUPERADMIN'), roleController.updateTemplate);
router.delete('/templates/:id', protect, restrictTo('SUPERADMIN'), roleController.deleteTemplate);

// Apply template to create dashboard
router.post('/templates/:id/apply', protect, restrictTo('SUPERADMIN'), roleController.applyTemplate);

export default router;
