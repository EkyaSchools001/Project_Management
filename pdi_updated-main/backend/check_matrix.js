const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConfig() {
    try {
        const setting = await prisma.systemSettings.findUnique({
            where: { key: 'access_matrix_config' }
        });
        if (setting) {
            console.log('ACCESS_MATRIX_CONFIG:');
            console.log(JSON.stringify(JSON.parse(setting.value), null, 2));
        } else {
            console.log('access_matrix_config NOT FOUND IN DB');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkConfig();
