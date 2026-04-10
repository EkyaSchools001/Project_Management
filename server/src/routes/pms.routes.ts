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

const router = Router();

router.use(authenticate);

// Project Routes
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id', getProjectById);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Task Routes
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.get('/tasks/:id', getTaskById);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// Stats
router.get('/stats', getPmsStats);

export default router;
