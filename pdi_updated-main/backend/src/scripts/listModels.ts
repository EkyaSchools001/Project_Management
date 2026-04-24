
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function testFetch() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Available models:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

testFetch();
