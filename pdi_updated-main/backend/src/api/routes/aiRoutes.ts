import { Router } from 'express';
import { generateQuestions, chatWithAI, polishObservationText, transcribeAudio } from '../controllers/aiController';
import { getProactiveInsight } from '../controllers/AuraInsightController';
import { protect } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Allow authenticated users to generate questions
router.post('/generate-questions', protect, generateQuestions);

// Chat with AI assistant
router.post('/chat', protect, chatWithAI);

// AI Text improvement
router.post('/polish-text', protect, polishObservationText);

// Proactive Platform Insights
router.get('/proactive-insight', protect, getProactiveInsight);

// Whisper S2T Transcription
router.post('/transcribe', protect, upload.single('file'), transcribeAudio);

export default router;
