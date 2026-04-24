import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const testFetch = async () => {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    console.log(`Testing with key: ${apiKey.substring(0, 5)}...`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hi" }] }]
            })
        });
        
        const data = await response.json();
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err: any) {
        console.log(`❌ Fetch failed: ${err.message}`);
    }
};

testFetch();
