import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/', checkPermission('User Mgmt', 'view'), getAllUsers);
router.get('/:id', checkPermission('User Mgmt', 'view'), getUserById);

export default router;
