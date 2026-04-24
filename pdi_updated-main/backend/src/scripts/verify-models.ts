import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const verifyModel = async (modelName: string) => {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log(`\n--- Testing Model: ${modelName} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello!");
        console.log(`✅ ${modelName} works! Response: ${result.response.text()}`);
    } catch (err: any) {
        console.log(`❌ ${modelName} failed: ${err.message}`);
    }
};

const run = async () => {
    await verifyModel("gemini-1.5-flash");
    await verifyModel("gemini-1.5-flash-latest");
    await verifyModel("gemini-pro");
};

run();
