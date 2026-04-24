import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const listModels = async () => {
    const apiKey = process.env.GEMINI_API_KEY || "";
    // Note: ListModels is a bit trickier to call with this SDK version if not exposed directly.
    // There is a 'listModels' method but it might be internal or on a different object.
    
    console.log(`Testing key: ${apiKey.substring(0, 5)}...`);
    
    // We can try a direct fetch if needed, but let's try the SDK first.
    // Actually, let's try a different approach. I'll test v1 vs v1beta explicitly.
};

const testApiVersion = async (version: string) => {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log(`\n--- Testing API Version: ${version} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: version });
        const result = await model.generateContent("Hi");
        console.log(`✅ ${version} works! Response: ${result.response.text()}`);
    } catch (err: any) {
        console.log(`❌ ${version} failed: ${err.message}`);
    }
};

const run = async () => {
    await testApiVersion("v1");
    await testApiVersion("v1beta");
};

run();
