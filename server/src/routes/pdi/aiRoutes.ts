import { Router } from 'express';
import { generateQuestions, chatWithAI } from '../../controllers/pdi/aiController';
import { protect } from '../../middlewares/auth';

const router = Router();

// Allow authenticated users to generate questions
router.post('/generate-questions', protect, generateQuestions);

// Chat with AI assistant
router.post('/chat', protect, chatWithAI);

export default router;
