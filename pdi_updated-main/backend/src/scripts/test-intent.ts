import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const testIntent = async (message: string) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('API key missing');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = `You are the Ekya PDI AI Assistant. 
INTERACTIVE FORM ASSISTANT (HIGH PRIORITY):
- If the user asks to "fill observation", "log observation", or "add observation", immediately trigger the 'triggerGuidedObservation' tool.
- Do NOT provide a generic text response explaining how to find the form. Use the tool to start the interactive assistant.`;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: systemPrompt,
        tools: [{
            functionDeclarations: [
                {
                    name: "triggerGuidedObservation",
                    description: "Starts the interactive guided form for adding a classroom observation log.",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            initialTeacher: { type: SchemaType.STRING },
                            initialSubject: { type: SchemaType.STRING }
                        }
                    }
                }
            ]
        }]
    });

    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = result.response;
    const functionCalls = response.functionCalls ? response.functionCalls() : [];

    console.log(`Message: "${message}"`);
    if (functionCalls && functionCalls.length > 0) {
        console.log(`✅ TOOL CALLED: ${functionCalls[0].name}`);
        console.log(`Args: ${JSON.stringify(functionCalls[0].args)}`);
    } else {
        console.log(`❌ NO TOOL CALLED`);
        console.log(`Response: ${response.text()}`);
    }
};

const run = async () => {
    await testIntent("help me fill observation for Teacher Rohit");
    console.log('---');
    await testIntent("add observation for Math");
};

run();
