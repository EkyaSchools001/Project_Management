import { chatWithAI } from '../api/controllers/aiController';
import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mockResponse = () => {
    const res: any = {};
    res.status = (code: number) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data: any) => {
        res.data = data;
        return res;
    };
    return res;
};

const testChat = async (message: string) => {
    const req: any = {
        body: { message, history: [] },
        user: { fullName: "Test User", role: "LEADER" }
    };
    const res = mockResponse();

    console.log(`\n--- Testing Message: "${message}" ---`);
    await chatWithAI(req, res);

    if (res.statusCode === 200) {
        console.log("✅ SUCCESS");
        console.log("Response:", JSON.stringify(res.data, null, 2));
    } else {
        console.log("❌ FAILED with status:", res.statusCode);
        console.log("Error:", JSON.stringify(res.data, null, 2));
    }
};

const run = async () => {
    try {
        await testChat("hi");
        await testChat("help me fill observation");
    } catch (err) {
        console.error("DEBUG SCRIPT CRASHED:", err);
    }
};

run();
