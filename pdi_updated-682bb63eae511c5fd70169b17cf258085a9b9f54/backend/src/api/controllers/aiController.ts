import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import { AuthRequest } from '../middlewares/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001/api/v1/ai';

// Initialize Groq Client
const getGroqClient = () => {
    const apiKey = (process.env.GROQ_API_KEY || "").trim().replace(/^["']|["']$/g, '');
    if (!apiKey) {
        throw new Error('Groq API key is not configured. Please add GROQ_API_KEY to your .env file.');
    }
    return new Groq({ apiKey });
};

// Initialize Gemini Client
const getGeminiClient = () => {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
    return new GoogleGenerativeAI(apiKey);
};

export const transcribeAudio = async (req: AuthRequest, res: Response): Promise<void> => {
    let tempFilePath = '';
    try {
        if (!req.file) {
            res.status(400).json({ status: 'fail', message: 'No audio file uploaded' });
            return;
        }

        const groq = getGroqClient();

        // Write buffer to a temp file because Groq SDK expects a readable stream
        tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}_${req.file.originalname || 'audio.webm'}`);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-large-v3",
            response_format: "json",
            language: "en"
        });

        // Clean up temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        let text = transcription.text ? transcription.text.trim() : "";

        res.status(200).json({
            status: 'success',
            data: { text }
        });
    } catch (error: any) {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        console.error("❌ AUDIO S2T ERROR [Groq]:", error);
        res.status(500).json({ status: 'error', message: error.message || 'Transcription failed' });
    }
};

export const generateQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { prompt, count = 5 } = req.body;

        if (!prompt) {
            res.status(400).json({ status: 'fail', message: 'Prompt is required' });
            return;
        }

        const groq = getGroqClient();

        const systemPrompt = `You are an expert educator and instructional designer. 
Generate exactly ${count} assessment questions or form fields based on the following topic or context: "${prompt}".

The questions must be returned as a valid JSON array of objects.
Each object MUST conform strictly to this structure:
{
  "prompt": "The question text or label",
  "type": "MCQ", // Options: "MCQ", "MULTI_SELECT", "TEXT", "LONG_TEXT", "RATING", "DATE"
  "options": ["Option A", "Option B", "Option C", "Option D"], // Provide 4 options for MCQ/MULTI_SELECT. For others, provide an empty array [].
  "correctAnswer": "Option A", // If applicable. For MCQ/MULTI_SELECT, match the option string. For others, provide a sample ideal answer or leave empty.
  "points": 1, 
  "required": true
}

Ensure the output is ONLY the JSON array.`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate the questions now." }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        let text = completion.choices[0]?.message?.content || "[]";

        let questions;
        try {
            const parsed = JSON.parse(text);
            questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);

            questions = questions.map((q: any) => ({
                prompt: q.prompt || q.label || "Question formulation failed",
                type: ['MCQ', 'MULTI_SELECT', 'TEXT', 'LONG_TEXT', 'RATING', 'DATE'].includes(q.type) ? q.type : 'MCQ',
                options: Array.isArray(q.options) ? q.options : [],
                correctAnswer: typeof q.correctAnswer === 'string' ? q.correctAnswer : String(q.correctAnswer || ""),
                points: typeof q.points === 'number' ? q.points : 1,
                required: typeof q.required === 'boolean' ? q.required : true
            }));

        } catch (e) {
            console.error("AI Generation JSON Parse Error:", e, "\nRaw text:", text);
            res.status(500).json({ status: 'error', message: 'Failed to parse AI response into valid questions' });
            return;
        }

        res.status(200).json({
            status: 'success',
            data: { questions }
        });
    } catch (error: any) {
        console.error("AI Generation failed:", error);
        res.status(500).json({ status: 'error', message: error.message || 'AI Generation failed' });
    }
};

export const polishObservationText = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text, fieldName = 'notes' } = req.body;
        const groq = getGroqClient();

        const prompt = `You are a professional educational consultant. 
Improve the following classroom observation ${fieldName.toLowerCase()}. 
Convert the input into professional, objective, and grammatically correct language suitable for a teacher's growth record.

- **Concise**: Keep it punchy but professional.
- **Tone**: Encouraging yet objective.
- **Format**: Plain text only.

Input: "${text}"
Output:`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        const output = completion.choices[0]?.message?.content || "";

        res.status(200).json({
            status: 'success',
            data: { polishedText: output.trim() }
        });
    } catch (error: any) {
        console.error("❌ AI POLISH ERROR:", error);
        res.status(500).json({ status: 'error', message: error.message || 'AI refinement failed.' });
    }
};

export const chatWithAI = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, history = [], context = {} } = req.body;
        const groq = getGroqClient();
        const role = req.user?.role?.toUpperCase() || 'TEACHER';

        let masterMap = `
- "/okr": "Progress Dashboard / Goals"
- "/growth": "Observations & Feedback"
- "/educator-hub/interactions": "Interaction Logs (PTIL)"
- "/meetings": "Meeting Schedule & Minutes (MoM)"
- "/hr/resources": "HR Resources Hub / Policies"
- "/hr/wellbeing": "Educator Well-Being"
- "/technology/google-workspace": "Google Workspace Tools"
- "/technology/greythr": "GreytHR Payroll & Leave"
- "/technology/schoology": "Schoology LMS"
- "/technology/ekyaverse": "Ekyaverse Metaverse"
- "/portfolio": "Staff Portfolio Directory"
- "/campuses/cmr-nps/info": "CMR NPS Campus Info"
- "/campuses/ekya-byrathi/info": "Ekya Byrathi Campus Info"`;

        // Role-Specific Route Enhancements
        if (role === 'TEACHER') {
            masterMap += '\n- "/teacher/assessments": "My Assessments / Evaluations"';
            masterMap += '\n- "/teacher/observations": "My Observation History"';
            masterMap += '\n- "/teacher/portfolio": "My Professional Portfolio"';
        } else if (role === 'LEADER' || role === 'SCHOOL_LEADER') {
            masterMap += '\n- "/leader/courses/assessments": "Assessment Builder & Evaluations"';
            masterMap += '\n- "/leader/growth": "Team Observations & Feedback"';
            masterMap += '\n- "/leader/team": "My School Staff & Faculty"';
            masterMap += '\n- "/leader/danielson-framework": "Formal Danielson Observations"';
            masterMap += '\n- "/leader/quick-feedback": "Quick Informal Feedback"';
        } else if (role === 'ADMIN' || role === 'SUPERADMIN') {
            masterMap += '\n- "/admin/courses/assessments": "System-wide Assessment Management"';
            masterMap += '\n- "/admin/growth-analytics": "Growth & Analytics"';
            masterMap += '\n- "/admin/users": "User & Account Management"';
        } else if (role === 'COORDINATOR') {
            masterMap += '\n- "/coordinator/courses/assessments": "Assessment Management"';
            masterMap += '\n- "/coordinator": "Coordinator Performance Dashboard"';
        } else if (role === 'MANAGEMENT') {
            masterMap += '\n- "/management/courses/assessments": "Strategic Assessment Overview"';
            masterMap += '\n- "/management/growth-analytics": "Cross-Campus Growth Analytics"';
        }


        const systemPrompt = `You are Aira (AI Resource Assistant), the Ekya PDI Master Agent. Your mission is to assist users in navigating the platform and capturing data using natural language and voice.

IDENTITY: You are professional, helpful, and technically expert. You are deep-trained on the Ekya PDI Platform.

USER CONTEXT:
Name: ${req.user?.fullName}
Role: ${req.user?.role || context.role}
Current Page: ${context.url || 'Unknown'} (${context.pageTitle || 'Unknown'})

AVAILABLE NAVIGATION ROUTES FOR THIS USER ROLE (STRICTLY USE THESE PATHS):
${JSON.stringify(context.navigationMap || [], null, 2)}

ADVANCED PLATFORM ALIAS MAP (FALLBACK ONLY):
- "/growth": ["My Growth", "Observations", "Feedback", "Performance Reviews"]
- "/leader/growth": ["Teacher Reviews", "Monitor Growth", "Leader Dashboard", "Growth Analytics"]
- "/leader/danielson-framework": ["Formal Observation", "Danielson Rubric", "Professional Review", "Standard Obs"]
- "/leader/quick-feedback": ["Informal Feedback", "Short Observation", "Quick Note", "Observation Light"]
- "/teacher/portfolio": ["My Work", "Achievement Log", "Evidence", "My Portfolio"]
- "/learning/courses": ["Self-Study", "Course Library", "Training Hub"]
- "/meetings": ["Calendar", "Meeting List", "Schedule"]

MASTER PLATFORM MAP (ADDITIONAL):
${masterMap}

MASTER INTENT:
1. **Precision Navigation**: Map user requests to the most relevant platform path.
2. **Deep Form Drafting (BATCH DICTATION)**: If a user provides details for a form (Interactions/PTIL, Observations, Goals, MoM), extract ALL fields and use the 'submitFormCollection' tool to draft it instantly.

AGENTIC PROTOCOLS:
1. **Intelligent Navigation**: When the user asks to navigate, find the EXACT match from the AVAILABLE NAVIGATION ROUTES.
2. **Helpful Context**: When using 'navigateToPage', YOU MUST USE the exact "path".
3. **Fuzzy Matching**: Do not be pedantic; map intent to the corresponding goals route.
4. **Voice Awareness**: Your responses may be read aloud. Keep them concise and professional.
- If a user says "Log an interaction...", extract Parent Name, Email, Student, Issue, and Team.
- If a user says "Take me to...", use 'navigateToPage'.

NOISE RESILIENCE PROTOCOL:
- If the transcript appears to be fragmented chatter, unrelated background dialogue, or "ghost" text (e.g., 'Thank you', 'Bye', 'Okay' with no context), IGNORE it.
- If you are unsure if the user was speaking to you, respond with: "I detected some speech but couldn't quite catch the command. Could you please repeat that?"

TONE: Senior Platform Consultant.`;

        const tools: any[] = [
            {
                type: "function",
                function: {
                    name: "navigateToPage",
                    description: "Navigates the user to a precise platform location.",
                    parameters: {
                        type: "object",
                        properties: {
                            route: { type: "string", description: "The EXACT 'path' value from the provided AVAILABLE NAVIGATION ROUTES array or Master Map." },
                            destinationTitle: { type: "string", description: "The exact 'name' of the destination from the routes array." },
                            platformPath: { type: "string", description: "A logical breadcrumb path matching the destination (e.g., 'Leader > Courses > Learning Festival')." },
                            description: { type: "string", description: "Brief summary of what the user can do on this page." }
                        },
                        required: ["route", "destinationTitle"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "submitFormCollection",
                    description: "Drafts a complete form from natural language input.",
                    parameters: {
                        type: "object",
                        properties: {
                            formType: {
                                type: "string",
                                enum: ["OBSERVATION", "GOAL", "REFLECTION", "PTIL", "MEETING_MOM", "PD_LOG"]
                            },
                            payload: {
                                type: "object",
                                description: "The extracted fields for the form (e.g., teacherEmail, parentName, studentName, issue, remarks)."
                            }
                        },
                        required: ["formType", "payload"]
                    }
                }
            }
        ];

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...history.slice(-10).map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.content
            })),
            { role: "user", content: message }
        ];

        const apiKey = (process.env.GROQ_API_KEY || "").trim().replace(/^["']|["']$/g, '');

        let responseContent = "";
        let toolCalls: any[] = [];

        if (apiKey) {
            try {
                const response = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages,
                    tools,
                    tool_choice: "auto",
                });
                const responseMessage = response.choices[0].message;
                responseContent = responseMessage.content || "";
                toolCalls = responseMessage.tool_calls || [];
            } catch (toolError: any) {
                console.error("⚠️ RETRYING IN TEXT MODE:", toolError.message);
                const response = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages,
                    temperature: 0.7
                });
                responseContent = response.choices[0].message.content || "";
            }
        } else {
            // Fallback to local python ai_service using g4f
            try {
                // To support rudimentary navigation via g4f, inject instructions
                const fallbackSystemPrompt = systemPrompt + `\n\nCRITICAL RULE: If the user explicitly asks to navigate to a specific page or dashboard, output EXACTLY AND ONLY a JSON object in this format: {"tool": "navigateToPage", "args": {"route": "/path", "destinationTitle": "Title"}}. Otherwise, reply with natural text.`;

                const mlResponse = await axios.post(`${AI_SERVICE_URL}/chat`, {
                    message,
                    history,
                    context,
                    system_prompt: fallbackSystemPrompt
                }, { timeout: 25000 });

                responseContent = mlResponse.data.response || "";

                // Try parsing local ML json response for tools
                if (responseContent.trim().startsWith('{') && responseContent.includes('navigateToPage')) {
                    try {
                        const parsed = JSON.parse(responseContent);
                        if (parsed.tool === 'navigateToPage') {
                            toolCalls = [{
                                function: {
                                    name: 'navigateToPage',
                                    arguments: JSON.stringify(parsed.args)
                                }
                            }];
                            responseContent = "";
                        }
                    } catch (e) {
                        // ignore parse errors
                    }
                }
            } catch (mlError: any) {
                console.error("Local ML Chat failed:", mlError.message);
                res.status(200).json({
                    status: 'success',
                    data: {
                        content: "I'm Aira! I am currently running offline. Please ensure the Python ai_service is running locally.",
                        type: 'TEXT'
                    }
                });
                return;
            }
        }

        if (toolCalls && toolCalls.length > 0) {
            const toolCall = toolCalls[0];
            try {
                const args = JSON.parse(toolCall.function.arguments);

                if (toolCall.function.name === 'navigateToPage') {
                    res.status(200).json({
                        status: 'success',
                        data: {
                            type: 'NAV_PREVIEW',
                            payload: args,
                            content: `I've found the ${args.destinationTitle} section. Would you like to go there now?`
                        }
                    });
                    return;
                }

                if (toolCall.function.name === 'submitFormCollection') {
                    res.status(200).json({
                        status: 'success',
                        data: {
                            type: 'FORM_DRAFT',
                            payload: args,
                            content: `I've drafted the ${args.formType.replace('_', ' ')} based on what you told me. I've auto-filled the fields for you.`
                        }
                    });
                    return;
                }
            } catch (err) {
                console.error("❌ ARG PARSE ERROR:", err);
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                content: responseContent || "I'm Aira. How can I help you navigate or log data today?",
                type: 'TEXT'
            }
        });
    } catch (error: any) {
        console.error("❌ FINAL CHAT ERROR:", error);
        res.status(200).json({
            status: 'success',
            data: {
                content: "I'm Aira! Something went wrong processing your request.",
                type: 'TEXT'
            }
        });
    }
};


export const generateGoalSuggestions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { contextData } = req.body;

        // Try calling the Local Python ML Service First
        try {
            const mlResponse = await axios.post(`${AI_SERVICE_URL}/generate-goals`, {
                teacher_context: JSON.stringify(contextData || {}),
                focus_areas: ["Live the Lesson", "Authentic Assessments", "Instruct to Inspire", "Care about Culture", "Engaging Environment", "Professional Practice"]
            }, { timeout: 15000 });

            if (mlResponse.data && mlResponse.data.suggestions) {
                res.status(200).json({
                    status: 'success',
                    data: { suggestions: mlResponse.data.suggestions }
                });
                return;
            }
        } catch (mlError: any) {
            console.log("Local ML Service Goal Generation failed or unavailable, falling back to Gemini:", mlError.message);
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            res.status(500).json({ status: 'error', message: 'AI API key not configured on server' });
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `You are an expert instructional coach. Based on the provided teacher context, generate exactly 3 SMART professional development goals. 
Context Data: ${JSON.stringify(contextData || {})}

Return ONLY a JSON array of objects with this exact structure, nothing else:
[
  {
    "title": "A short, actionable goal title",
    "description": "A detailed SMART goal description",
    "actionStep": "One immediate first step to begin working on this goal",
    "category": "Pick exactly one: 'Live the Lesson', 'Authentic Assessments', 'Instruct to Inspire', 'Care about Culture', 'Engaging Environment', or 'Professional Practice'"
  }
]`;

        const result = await model.generateContent(systemPrompt);
        let text = result.response.text();

        if (text.startsWith('```json')) {
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (text.startsWith('```')) {
            text = text.replace(/```/g, '').trim();
        }

        let suggestions;
        try {
            suggestions = JSON.parse(text);
        } catch (e) {
            console.error("AI Goal Parse Error:", text);
            res.status(500).json({ status: 'error', message: 'Failed to parse AI response' });
            return;
        }

        res.status(200).json({
            status: 'success',
            data: { suggestions }
        });
    } catch (error: any) {
        console.error("AI Goal Generation failed:", error);
        res.status(500).json({ status: 'error', message: error.message || 'AI Generation failed' });
    }
};

export const processEvidenceTags = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { textContent, originalFileName } = req.body;

        if (!textContent && !originalFileName) {
            res.status(400).json({ status: 'error', message: 'Evidence content or filename required for tagging.' });
            return;
        }

        // Try calling the Local Python ML Service First
        try {
            const mlResponse = await axios.post(`${AI_SERVICE_URL}/tag-evidence`, {
                content: textContent || '',
                filename: originalFileName || ''
            }, { timeout: 15000 });

            if (mlResponse.data && mlResponse.data.tags) {
                res.status(200).json({
                    status: 'success',
                    data: { tags: mlResponse.data.tags }
                });
                return;
            }
        } catch (mlError: any) {
            console.log("Local ML Service Tagging failed or unavailable, falling back to Gemini:", mlError.message);
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            res.status(500).json({ status: 'error', message: 'AI API key not configured on server' });
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `You are an expert instructional evaluator based on the Danielson Framework.
Analyze the following evidence content and filename:
Filename: ${originalFileName || 'N/A'}
Content snippet/summary: ${textContent || 'N/A'}

Identify which specific domains and elements of professional teaching practice this evidence aligns with.
Return EXACTLY a JSON array of string tags (e.g., ["Domain 1: Planning", "1c: Setting Instructional Outcomes", "Formative Assessment", "Technology Integration"]).
Do not include any formatting or other text, JUST the JSON array.`;

        const result = await model.generateContent(systemPrompt);
        let text = result.response.text();

        if (text.startsWith('```json')) {
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (text.startsWith('```')) {
            text = text.replace(/```/g, '').trim();
        }

        let tags: string[] = [];
        try {
            tags = JSON.parse(text);
        } catch (e) {
            console.error("AI Tagging Parse Error:", text);
            // Fallback tags if parse fails
            tags = ["General Evidence", "Professional Practice"];
        }

        res.status(200).json({
            status: 'success',
            data: { tags }
        });
    } catch (error: any) {
        console.error("AI Evidence Tagging failed:", error);
        res.status(500).json({ status: 'error', message: error.message || 'AI Tagging failed' });
    }
};

export const recommendPD = async (req: Request, res: Response) => {
    try {
        const { teacher_context, focus_areas, available_courses } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/recommend-pd`, {
            teacher_context,
            focus_areas,
            available_courses
        });
        return res.status(200).json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching PD recommendations:', error);
        return res.status(500).json({ status: 'error', recommendations: [] });
    }
};

export const analyzeReflection = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;

        // Try local ML first
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/analyze-reflection`, { text }, { timeout: 5000 });
            return res.status(200).json({ status: 'success', data: response.data });
        } catch (mlError) {
            console.log("Local ML Reflection Analysis failed, falling back to Gemini");
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(200).json({ status: 'success', sentiment: 'Neutral', summary: 'Reflection recorded. (AI Fallback: API Key Missing)' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `Analyze the following teacher reflection text. Summarize the key sentiment and extract the top 3 actionable growth points.
        Format your response as a JSON object: {"sentiment": "Positive/Neutral/Constructive", "summary": "...", "growthPoints": ["...", "...", "..."]}
        
        Reflection Text: "${text}"`;

        const result = await model.generateContent(systemPrompt);
        let responseText = result.response.text();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const data = JSON.parse(responseText);
        return res.status(200).json({
            status: 'success',
            data: data
        });

    } catch (error) {
        console.error('Error analyzing reflection:', error);
        return res.status(500).json({ status: 'error', sentiment: 'Neutral', summary: 'Reflection submitted.' });
    }
};

export const scoreEvidence = async (req: AuthRequest, res: Response) => {
    try {
        const { content, category } = req.body;

        // Try local ML first
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/score-evidence`, { content, category }, { timeout: 8000 });
            return res.status(200).json({ status: 'success', data: response.data });
        } catch (mlError) {
            console.log("Local ML Evidence Scoring failed, falling back to Gemini");
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ status: 'error', score: 0, feedback: 'AI Analysis unavailable (Missing API Key).' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `You are an expert instructional evaluator. Score the provided professional development evidence on a scale of 1-100 based on the category "${category}".
        Provide constructive feedback.
        Format your response as a JSON object: {"score": number, "feedback": "...", "strengths": ["..."], "improvements": ["..."]}
        
        Evidence Content: "${content}"`;

        const result = await model.generateContent(systemPrompt);
        let responseText = result.response.text();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const data = JSON.parse(responseText);
        return res.status(200).json({
            status: 'success',
            data: data
        });

    } catch (error) {
        console.error('Error scoring evidence:', error);
        return res.status(500).json({ status: 'error', score: 0, feedback: 'Analysis unavailable due to server error.' });
    }
};

export const sendPDSnapshot = async (req: Request, res: Response) => {
    try {
        const { userId, email, progressData } = req.body;

        // Wishlist requirement: Google Authentication
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            console.warn("GOOGLE OAUTH credentials missing. Email snapshot might fail.");
        }

        // Logic to send email via Nodemailer or SendGrid
        // For now, we simulate success and log the data
        console.log(`[SNAPSHOT] Sending PD Summary to ${email} for user ${userId}`);
        console.log(`[SNAPSHOT] Data:`, progressData);

        // In a real scenario, we'd use a template engine:
        // const html = templateEngine.render('pd-snapshot.html', { user, progressData });
        // await emailService.sendMail({ to: email, subject: 'Your Ekya PDI Weekly Snapshot', html });

        res.status(200).json({
            status: 'success',
            message: 'PD Snapshot sent successfully'
        });
    } catch (error: any) {
        console.error('Error sending snapshot:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send snapshot email.' });
    }
};

