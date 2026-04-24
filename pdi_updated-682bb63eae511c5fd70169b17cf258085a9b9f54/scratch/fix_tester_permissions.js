
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:C:/Users/Admin/Desktop/PDI/pdi_updated/database/prisma/dev.db"
        }
    }
});

async function main() {
    const configRecord = await prisma.systemSettings.findUnique({
        where: { key: 'access_matrix_config' }
    });
    
    if (!configRecord) {
        console.log('No access_matrix_config found to update.');
        return;
    }
    
    let config = JSON.parse(configRecord.value);
    let updatedCount = 0;
    
    if (config.accessMatrix && Array.isArray(config.accessMatrix)) {
        config.accessMatrix = config.accessMatrix.map(module => {
            if (module.roles && typeof module.roles === 'object') {
                if (module.roles.TESTER === undefined) {
                    // Defaulting TESTER to true for all existing modules for now
                    // You might want to match defaultAccessMatrix logic, but for a quick fix
                    // we can just enable it where other staff roles have it.
                    module.roles.TESTER = true;
                    updatedCount++;
                }
            }
            return module;
        });
        
        await prisma.systemSettings.update({
            where: { key: 'access_matrix_config' },
            data: { value: JSON.stringify(config) }
        });
        
        console.log(`Updated ${updatedCount} modules to include the TESTER role.`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
