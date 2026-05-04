import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function checkMatrix() {
    try {
        const config = await prisma.systemSettings.findUnique({
            where: { key: 'access_matrix_config' }
        });
        if (config) {
            console.log('Access Matrix Config found.');
            const parsed = JSON.parse(config.value);
            console.log('Parsed matrix keys:', Object.keys(parsed));
            if (parsed.accessMatrix) {
                console.log('Access Matrix length:', parsed.accessMatrix.length);
            } else {
                console.log('accessMatrix key MISSING in parsed object!');
            }
        } else {
            console.log('Access Matrix Config NOT FOUND in DB!');
        }
    } catch (error) {
        console.error('Failed to check matrix:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkMatrix();
