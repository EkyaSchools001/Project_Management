import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const listModels = async () => {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    console.log(`Listing models for key: ${apiKey.substring(0, 5)}...`);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => console.log(`- ${m.name}`));
        } else {
            console.log("No models found or error response:");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err: any) {
        console.log(`❌ Request failed: ${err.message}`);
    }
};

listModels();
