const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function checkWidgets() {
    try {
        const widgets = await prisma.dashboardWidget.findMany({
            where: { widgetType: 'security_feed' }
        });
        console.log('Security Feed Widgets:', JSON.stringify(widgets, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkWidgets();
