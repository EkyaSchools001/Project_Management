import { Request, Response } from 'express';
import aiService from '../services/ai.service';

export const AIController = {
    async prioritizeTasks(req: Request, res: Response) {
        try {
            const { tasks, context } = req.body;
            if (!tasks || !Array.isArray(tasks)) {
                return res.status(400).json({ error: 'Tasks array is required' });
            }
            const prioritized = await aiService.prioritizeTasks(tasks, context);
            res.json({ status: 'success', data: prioritized });
        } catch (error) {
            console.error('Error prioritizing tasks:', error);
            res.status(500).json({ error: 'Failed to prioritize tasks' });
        }
    },

    async analyzeRisk(req: Request, res: Response) {
        try {
            const { project, historicalData } = req.body;
            if (!project) {
                return res.status(400).json({ error: 'Project data is required' });
            }
            const riskAnalysis = await aiService.analyzeProjectRisk(project, historicalData);
            res.json({ status: 'success', data: riskAnalysis });
        } catch (error) {
            console.error('Error analyzing risk:', error);
            res.status(500).json({ error: 'Failed to analyze project risk' });
        }
    },

    async suggestWorkload(req: Request, res: Response) {
        try {
            const { teamMembers, tasks } = req.body;
            if (!teamMembers || !Array.isArray(teamMembers)) {
                return res.status(400).json({ error: 'Team members array is required' });
            }
            const workload = await aiService.suggestWorkloadBalance(teamMembers, tasks || []);
            res.json({ status: 'success', data: workload });
        } catch (error) {
            console.error('Error suggesting workload:', error);
            res.status(500).json({ error: 'Failed to suggest workload balance' });
        }
    },

    async optimizeMeeting(req: Request, res: Response) {
        try {
            const { meetings, constraints } = req.body;
            if (!meetings || !Array.isArray(meetings)) {
                return res.status(400).json({ error: 'Meetings array is required' });
            }
            const schedule = await aiService.optimizeMeetingSchedule(meetings, constraints);
            res.json({ status: 'success', data: schedule });
        } catch (error) {
            console.error('Error optimizing meeting:', error);
            res.status(500).json({ error: 'Failed to optimize meeting schedule' });
        }
    },

    async analyze(req: Request, res: Response) {
        try {
            const { text, type } = req.body;
            if (!text) {
                return res.status(400).json({ error: 'Text is required' });
            }
            if (!type || !['sentiment', 'category', 'summary'].includes(type)) {
                return res.status(400).json({ error: 'Valid analysis type is required (sentiment, category, summary)' });
            }
            const analysis = await aiService.analyzeText(text, type);
            res.json({ status: 'success', data: analysis });
        } catch (error) {
            console.error('Error analyzing text:', error);
            res.status(500).json({ error: 'Failed to analyze text' });
        }
    },

    async chatbot(req: Request, res: Response) {
        try {
            const { message, context } = req.body;
            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }
            const response = await aiService.chatbotResponse(message, context);
            res.json({ status: 'success', data: response });
        } catch (error) {
            console.error('Error in chatbot:', error);
            res.status(500).json({ error: 'Failed to get chatbot response' });
        }
    },

    async getSuggestions(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string || 'default';
            const types = req.query.types ? (req.query.types as string).split(',') : ['task', 'project', 'workload'];
            const suggestions = await aiService.getSuggestions(userId, types);
            res.json({ status: 'success', data: suggestions });
        } catch (error) {
            console.error('Error getting suggestions:', error);
            res.status(500).json({ error: 'Failed to get suggestions' });
        }
    },

    async autoTag(req: Request, res: Response) {
        try {
            const { items } = req.body;
            if (!items || !Array.isArray(items)) {
                return res.status(400).json({ error: 'Items array is required' });
            }
            const tagged = await aiService.autoTagContent(items);
            res.json({ status: 'success', data: tagged });
        } catch (error) {
            console.error('Error auto-tagging:', error);
            res.status(500).json({ error: 'Failed to auto-tag content' });
        }
    },

    async generateProjectPlan(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            if (!name) return res.status(400).json({ error: 'Project name is required' });
            const plan = await aiService.generateProjectPlan(name, description);
            res.json({ status: 'success', data: plan });
        } catch (error) {
            console.error('Error generating project plan:', error);
            res.status(500).json({ error: 'Failed to generate project plan' });
        }
    },

    async generateQuiz(req: Request, res: Response) {
        try {
            const { courseTitle, difficulty } = req.body;
            const quiz = await aiService.generateQuizForCourse(courseTitle, difficulty);
            res.json({ status: 'success', data: quiz });
        } catch (error) {
            console.error('Error generating quiz:', error);
            res.status(500).json({ error: 'Failed to generate quiz' });
        }
    }
};
