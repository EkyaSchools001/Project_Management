import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PmsService } from '../services/pms.service';

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await PmsService.getProjects(req.user.id, req.user.role);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
    try {
        const project = await PmsService.getProjectById(req.params.id as string, req.user.id, req.user.role);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, departmentId } = req.body;
        // Ideally validate departmendId against user's allowed departments here or in service
        const project = await PmsService.createProject({
            name,
            description,
            departmentId,
            creatorId: req.user.id
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, status } = req.body;
        // Verify user permission if needed
        const project = await PmsService.updateProject(req.params.id as string, { name, description, status });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        // Verify user permission (e.g. only creator or admin)
        await PmsService.deleteProject(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }
        const tasks = await PmsService.getTasks(projectId as string);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {
        const task = await PmsService.getTaskById(req.params.id as string);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, projectId, assigneeId, priority, dueDate } = req.body;
        const task = await PmsService.createTask({
            title,
            description,
            projectId,
            assigneeId,
            priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            creatorId: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status, priority, dueDate, assigneeId } = req.body;
        const task = await PmsService.updateTask(req.params.id as string, {
            title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : undefined, assigneeId
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        await PmsService.deleteTask(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

export const getPmsStats = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await PmsService.getPmsStats(req.user.id, req.user.role);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
