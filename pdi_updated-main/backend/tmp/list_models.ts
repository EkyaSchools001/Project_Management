import prisma from '../src/infrastructure/database/prisma';

async function main() {
    console.log('Available models on prisma object:');
    const keys = Object.keys(prisma);
    keys.filter(k => !k.startsWith('_') && k !== '$connect' && k !== '$disconnect').forEach(k => {
        console.log(`- ${k}`);
    });
}

main();
