import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuthRequest } from '../../middlewares/auth';

export const generateQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { prompt, count = 5 } = req.body;

        if (!prompt) {
            res.status(400).json({ status: 'fail', message: 'Prompt is required' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            res.status(500).json({ status: 'error', message: 'AI API key not configured on server' });
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are an expert educator and instructional designer. 
Generate exactly ${count} assessment questions based on the following topic or context: "${prompt}".

The questions must be returned as a valid JSON array of objects. Do not include markdown code block formatting like \`\`\`json. Just return the raw JSON array.

Each question object MUST conform strictly to this structure:
{
  "prompt": "The question text",
  "type": "MCQ", // Use "MCQ" for single choice, "MULTI_SELECT" for multiple correct answers, or "TEXT" for short answer
  "options": ["Option A", "Option B", "Option C", "Option D"], // Provide 4 options for MCQ/MULTI_SELECT. For TEXT, provide an empty array [].
  "correctAnswer": "Option A", // For MCQ, exactly match the correct option string. For MULTI_SELECT, return a JSON stringified array of correct options like '["Option A", "Option C"]'. For TEXT, provide example key points expected.
  "points": 1 // Default to 1 point
}

Ensure the output is ONLY the JSON array, so it can be parsed directly by JSON.parse().`;

        const result = await model.generateContent(systemPrompt);
        let text = result.response.text();

        // Clean up markdown block if the model included it despite instructions
        if (text.startsWith('```json')) {
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (text.startsWith('```')) {
            text = text.replace(/```/g, '').trim();
        }

        let questions;
        try {
            questions = JSON.parse(text);

            // Validate and sanitize the generated questions
            if (!Array.isArray(questions)) {
                throw new Error("AI did not return an array");
            }

            questions = questions.map(q => {
                // Ensure options are strings
                let options = q.options || ["", "", "", ""];
                if (!Array.isArray(options)) options = ["", "", "", ""];

                // Ensure answer is string
                let correctAnswer = q.correctAnswer || "";
                if (typeof correctAnswer !== 'string') {
                    if (q.type === 'MULTI_SELECT' && Array.isArray(correctAnswer)) {
                        correctAnswer = JSON.stringify(correctAnswer);
                    } else {
                        correctAnswer = String(correctAnswer);
                    }
                }

                return {
                    prompt: q.prompt || "Question formulation failed",
                    type: ['MCQ', 'MULTI_SELECT', 'TEXT'].includes(q.type) ? q.type : 'MCQ',
                    options: options,
                    correctAnswer: correctAnswer,
                    points: typeof q.points === 'number' ? q.points : 1
                };
            });

        } catch (e) {
            console.error("AI Generation JSON Parse Error:", e, "\\nRaw text:", text);
            res.status(500).json({ status: 'error', message: 'Failed to parse AI response into valid questions' });
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                questions
            }
        });
    } catch (error: any) {
        console.error("AI Generation failed:", error);
        res.status(500).json({ status: 'error', message: error.message || 'AI Generation failed' });
    }
};

export const chatWithAI = async (req: AuthRequest, res: Response): Promise<void> => {
    console.log("===> AI CHAT REQUEST RECEIVED <===");
    try {
        const { message, history = [], context = {} } = req.body;

        if (!message) {
            res.status(400).json({ status: 'fail', message: 'Message is required' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        console.log(`[AI-CHAT] Key found: ${!!apiKey} (${apiKey?.substring(0, 5)}...)`);
        
        if (!apiKey) {
            res.status(500).json({ status: 'error', message: 'AI API key not configured on server' });
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const systemPrompt = `You are the PDI AI Assistant, a highly specialized instructional coach and mentor for teachers and school leaders.
Your expertise lies in the Danielson Framework for Teaching, professional development strategies, and data-driven educational leadership.

CORE PRINCIPLES:
1. **Mentor Persona**: Be encouraging, professional, and growth-oriented. Don't just give answers; offer instructional perspectives.
2. **Danielson Framework**: Refer to domains (1: Planning, 2: Environment, 3: Instruction, 4: Professionalism) when providing feedback or suggestions.
3. **Actionable Insights**: Provide specific "next steps" for teachers and leaders.
4. **Platform Expert**: Help users navigate the PDI platform and understand their analytics.

CURRENT USER ENVIRONMENT:
- Page: "${context.pageTitle || 'Dashboard'}"
- Location: "${context.url || '/'}"
- User Role: "${req.user?.role || 'User'}"
- User Name: "${req.user?.fullName || 'Educator'}"

ANALYTICAL CONTEXT: 
${JSON.stringify(context.data || {}, null, 2)}

Strictly adhere to these guidelines. If the data is empty, focus on general instructional support and platform guidance.`;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        const chat = model.startChat({
            history: history.length > 0 ? history.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })) : [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const fullPrompt = message + (context.data ? `\n\nContext for this request: ${JSON.stringify(context.data)}` : '');
        
        const result = await chat.sendMessage(fullPrompt);
        
        const response = result.response;
        const text = response.text();

        res.status(200).json({
            status: 'success',
            data: {
                content: text
            }
        });
    } catch (error: any) {
        console.error("AI Chat Result Error:", error);
        console.error("Error Stack:", error.stack);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'AI Chat failed',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
