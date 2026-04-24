import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/prioritize', authenticate, AIController.prioritizeTasks);
router.post('/risk-assessment', authenticate, AIController.analyzeRisk);
router.post('/workload-balance', authenticate, AIController.suggestWorkload);
router.post('/meeting-schedule', authenticate, AIController.optimizeMeeting);
router.post('/analyze', authenticate, AIController.analyze);
router.post('/chatbot', authenticate, AIController.chatbot);
router.get('/suggestions', authenticate, AIController.getSuggestions);
router.post('/auto-tag', authenticate, AIController.autoTag);
router.post('/generate-plan', authenticate, AIController.generateProjectPlan);
router.post('/generate-quiz', authenticate, AIController.generateQuiz);

export default router;
