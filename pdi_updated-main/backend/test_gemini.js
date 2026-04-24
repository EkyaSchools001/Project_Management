const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Try to load .env from current directory
dotenv.config();

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing Gemini API Key found in process.env:', apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING');
    
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY not found in environment.');
        // Manually try to read .env
        if (fs.existsSync('.env')) {
            const content = fs.readFileSync('.env', 'utf8');
            console.log('.env file exists and has content size:', content.length);
            if (content.includes('GEMINI_API_KEY')) {
                 console.log('.env file manually confirmed to contain GEMINI_API_KEY');
            }
        }
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log('Sending test message to Gemini...');
        const result = await model.generateContent("Hello, are you working?");
        console.log('Gemini Response:', result.response.text());
        console.log('SUCCESS: Gemini API is working correctly.');
    } catch (error) {
        console.error('FAILURE: Gemini API test failed.');
        console.error('Error Message:', error.message);
        process.exit(1);
    }
}

testGemini();
