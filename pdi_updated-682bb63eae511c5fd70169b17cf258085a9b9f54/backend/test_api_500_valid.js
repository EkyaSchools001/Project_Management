const { PrismaClient } = require('./node_modules/.prisma/client');
const jwt = require('jsonwebtoken');
const http = require('http');

const prisma = new PrismaClient();

async function testValidToken() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found');
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            'secret',
            { expiresIn: '1d' }
        );

        const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/notifications',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.request(options, (res) => {
            console.log('STATUS:', res.statusCode);
            res.setEncoding('utf8');
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log('BODY:', data);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        req.end();
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

testValidToken();
