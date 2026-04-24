const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const http = require('http');

const prisma = new PrismaClient();

const endpoints = [
    '/api/v1/goals',
    '/api/v1/growth/observations',
    '/api/v1/observations',
    '/api/v1/courses',
    '/api/v1/surveys/active',
    '/api/v1/courses/user/enrollments',
    '/api/v1/announcements',
    '/api/v1/training',
    '/api/v1/goals/okrs'
];

async function testEndpoint(path, token) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 500) {
                    resolve({ path, status: res.statusCode, error: data });
                } else {
                    resolve({ path, status: res.statusCode });
                }
            });
        });
        req.on('error', e => resolve({ path, status: 'NETWORK_ERROR', error: e.message }));
        req.end();
    });
}

async function run() {
    try {
        const roles = ['TEACHER', 'LEADER', 'ADMIN', 'MANAGEMENT', 'SUPERADMIN'];
        console.log('Testing Backend Flows for Roles:', roles.join(', '));
        console.log('----------------------------------------------------');

        for (const role of roles) {
            console.log(`\n=== Testing Role: ${role} ===`);
            const user = await prisma.user.findFirst({ where: { role } });

            if (!user) {
                console.log(`⚠️  No user found for role ${role}`);
                continue;
            }

            const token = jwt.sign(
                { id: user.id, role: user.role, email: user.email },
                'your-super-secret-key-change-this-in-production',
                { expiresIn: '1d' }
            );

            // Fetch dashboard config
            const dashboardResult = await testEndpoint(`/api/v1/dashboards/role/${role}`, token);
            console.log(`- Dashboard Route: [${dashboardResult.status}]`);
            if (dashboardResult.status >= 500) console.log('  Error:', dashboardResult.error);

            // Common endpoints
            for (const ep of endpoints) {
                const epResult = await testEndpoint(ep, token);
                const statusStr = epResult.status === 200 ? '✅ 200' : (epResult.status >= 500 ? `❌ ${epResult.status}` : `⚠️ ${epResult.status}`);
                console.log(`  - ${ep.padEnd(35)} [${statusStr}]`);
                if (epResult.status >= 500) {
                    console.log('    ERROR details:', epResult.error);
                }
            }
        }
    } catch (e) {
        console.error('Fatal Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
