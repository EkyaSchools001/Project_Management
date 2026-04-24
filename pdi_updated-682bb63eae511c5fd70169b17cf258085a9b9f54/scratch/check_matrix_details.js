
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:C:/Users/Admin/Desktop/PDI/pdi_updated/database/prisma/dev.db"
        }
    }
});

async function main() {
    const config = await prisma.systemSettings.findUnique({
        where: { key: 'access_matrix_config' }
    });
    
    if (config) {
        const parsed = JSON.parse(config.value);
        console.log('Matrix Modules:', parsed.accessMatrix?.map(m => m.moduleId).join(', '));
        
        // Check specifically for who-we-are and tester role
        const who = parsed.accessMatrix?.find(m => m.moduleId === 'who-we-are');
        console.log('Who we are roles:', JSON.stringify(who?.roles, null, 2));
    } else {
        console.log('No access_matrix_config found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
