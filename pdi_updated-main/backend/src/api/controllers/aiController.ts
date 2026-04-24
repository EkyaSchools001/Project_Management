import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import { AuthRequest } from '../middlewares/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    try {
        if (!req.file) {
            res.status(400).json({ status: 'fail', message: 'No audio file uploaded' });
            return;
        }

        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = "You are an exact audio transcription system. Transcribe the speech in this audio exactly as you hear it. If there is no distinct human speech (only silence, static, or background noise), output exactly the word 'SILENCE_NO_SPEECH'.";

        const audioPart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype || "audio/webm"
            }
        };

        const result = await model.generateContent([prompt, audioPart]);
        const textResponse = result.response.text();
        
        let text = textResponse ? textResponse.trim() : "";
        
        // Filter out silence/noise placeholder
        if (text === "SILENCE_NO_SPEECH" || text.includes("SILENCE_NO_SPEECH")) {
            text = "";
        }

        res.status(200).json({
            status: 'success',
            data: { text }
        });
    } catch (error: any) {
        console.error("❌ AUDIO S2T ERROR [Gemini]:", error);
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
- "/meetings": "Meeting Schedule & Minutes (MoM)"`;

        // Role-Specific Route Enhancements
        if (role === 'TEACHER') {
            masterMap += '\n- "/teacher/assessments": "My Assessments / Evaluations"';
            masterMap += '\n- "/teacher/observations": "My Observation History"';
            masterMap += '\n- "/teacher/portfolio": "My Professional Portfolio"';
        } else if (role === 'LEADER' || role === 'SCHOOL_LEADER') {
            masterMap += '\n- "/leader/courses/assessments": "Assessment Builder & Evaluations"';
            masterMap += '\n- "/leader/growth": "Team Observations & Feedback"';
            masterMap += '\n- "/leader/team": "My School Staff & Faculty"';
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

        let response;
        try {
            response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages,
                tools,
                tool_choice: "auto",
            });
        } catch (toolError: any) {
            console.error("⚠️ RETRYING IN TEXT MODE:", toolError.message);
            response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages,
                temperature: 0.7
            });
        }

        const responseMessage = response.choices[0].message;

        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            const toolCall = responseMessage.tool_calls[0];
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
                content: responseMessage.content || "I'm Aira. How can I help you navigate or log data today?",
                type: 'TEXT'
            }
        });
    } catch (error: any) {
        console.error("❌ FINAL CHAT ERROR:", error);
        res.status(500).json({ status: 'error', message: `Internal API Error: ${error.message} - ${error.stack}` });
    }
};
