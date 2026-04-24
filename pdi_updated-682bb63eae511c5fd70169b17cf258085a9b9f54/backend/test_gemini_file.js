
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    const logFile = path.join(__dirname, 'gemini_test_result.txt');
    
    try {
        if (!apiKey) {
            fs.writeFileSync(logFile, 'Error: No API Key found in .env');
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello, simple test.");
        const text = result.response.text();
        fs.writeFileSync(logFile, 'Success: ' + text);
        console.log('Success written to file');
    } catch (err) {
        fs.writeFileSync(logFile, 'Error: ' + err.message + '\n' + err.stack);
        console.error('Error written to file');
    }
}

testGemini();
