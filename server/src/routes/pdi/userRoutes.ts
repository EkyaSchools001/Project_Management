import { Router } from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, getUnverifiedUsers, verifyUser, denyUser } from '../../controllers/pdi/userController';
import { protect, restrictTo } from '../../middlewares/auth';

const router = Router();

router.use(protect);
// Allow everyone (Authenticated) to view users for directory/search
router.get('/', getAllUsers);
router.get('/:id', getUser);

// Restrict modification routes
router.use(restrictTo('ADMIN', 'SUPERADMIN', 'LEADER', 'MANAGEMENT'));

router.post('/', createUser);
router.get('/unverified/list', getUnverifiedUsers);
router.patch('/:id/verify', verifyUser);
router.delete('/:id/deny', denyUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
