
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log('API Key:', apiKey ? 'FOUND' : 'MISSING');
    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // We can't easily list models with the SDK in a simple way without a specific method, 
        // but we can try to get a model and see if it works.
        // Actually, let's use the REST API via fetch if possible, or just try different names.
        
        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-001', 'gemini-1.5-pro', 'gemini-pro'];
        
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`Model ${modelName}: SUCCESS`);
                break;
            } catch (e: any) {
                console.log(`Model ${modelName}: FAILED - ${e.message}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
