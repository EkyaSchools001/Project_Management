
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
        const restricted = parsed.accessMatrix?.filter(m => m.roles && m.roles.TESTER === false);
        console.log('Modules restricted for TESTER:', restricted.map(m => m.moduleId).join(', '));
    } else {
        console.log('No access_matrix_config found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
