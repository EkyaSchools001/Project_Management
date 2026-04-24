
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key Found:', !!apiKey);
    if (!apiKey) return;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello, simple test.");
        console.log('Success!', result.response.text());
    } catch (err) {
        console.error('Gemini SDK Error:', err.message);
        if (err.stack) console.error(err.stack);
    }
}

testGemini();
