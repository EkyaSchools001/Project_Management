import { Router } from 'express';
import {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getPmsStats
} from '../controllers/pms.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

// Project Routes
router.get('/projects', checkPermission('Timetable', 'view'), getProjects);
router.post('/projects', checkPermission('Timetable', 'create'), createProject);
router.get('/projects/:id', checkPermission('Timetable', 'view'), getProjectById);
router.patch('/projects/:id', checkPermission('Timetable', 'edit'), updateProject);
router.delete('/projects/:id', checkPermission('Timetable', 'delete'), deleteProject);

// Task Routes
router.get('/tasks', checkPermission('Timetable', 'view'), getTasks);
router.post('/tasks', checkPermission('Timetable', 'create'), createTask);
router.get('/tasks/:id', checkPermission('Timetable', 'view'), getTaskById);
router.patch('/tasks/:id', checkPermission('Timetable', 'edit'), updateTask);
router.delete('/tasks/:id', checkPermission('Timetable', 'delete'), deleteTask);

// Stats
router.get('/stats', checkPermission('Timetable', 'view'), getPmsStats);

export default router;
