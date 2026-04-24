import { Router } from 'express';
import * as lacController from '../../controllers/pdi/lacController';
import { protect } from '../../middlewares/auth';

const router = Router();

router.get('/tasks', protect, lacController.getTasks);
router.get('/my-tasks', protect, lacController.getMyTasks);
router.get('/campuses', protect, lacController.getCampuses);
router.get('/teachers', protect, lacController.getTeachers);
router.get('/subjects', protect, lacController.getSubjects);
router.get('/dashboard-summary', protect, lacController.getDashboardSummary);

router.post('/assign-task', protect, lacController.assignTask);
router.patch('/task/:id', protect, lacController.updateTaskStatus);

export default router;
