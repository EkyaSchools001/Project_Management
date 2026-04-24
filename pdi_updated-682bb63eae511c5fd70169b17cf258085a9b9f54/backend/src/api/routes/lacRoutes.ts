import { Router } from 'express';
import * as lacController from '../controllers/lacController';
import { protect, restrictTo } from '../middlewares/auth';
import { restrictToCampus, restrictToOwner } from '../middlewares/rbacMiddleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Apply strict owner and campus checks globally to prevent data leakage
router.use(restrictToCampus());
router.use(restrictToOwner());

// Admins & Coordinators only: View all tasks
router.get('/tasks', restrictTo('COORDINATOR', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPERADMIN', 'TESTER'), lacController.getLacTasks);

// Teachers & Admins & Coordinators: Dashboard summary (Controller handles specific filtering)
router.get('/dashboard-summary', lacController.getLacDashboardSummary);

// Teachers only: View personal tasks
router.get('/my-tasks', restrictTo('TEACHER'), lacController.getMyLacTasks);

// General lookups (Controller filters subjects if needed, campuses are global)
router.get('/subjects', lacController.getLacSubjects);
router.get('/campuses', lacController.getLacCampuses);

// Admins & Coordinators only: View teacher directory
router.get('/teachers', restrictTo('COORDINATOR', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPERADMIN', 'TESTER'), lacController.getLacTeachers);

// Admins & Coordinators only: Update task status
router.patch('/task/:id', restrictTo('COORDINATOR', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPERADMIN', 'TESTER'), lacController.updateLacTaskStatus);

// Coordinators & Leaders: Assign a task to a specific teacher
router.post('/assign-task', restrictTo('COORDINATOR', 'LEADER', 'SCHOOL_LEADER', 'ADMIN', 'MANAGEMENT', 'SUPERADMIN'), lacController.assignLacTask);

export default router;
