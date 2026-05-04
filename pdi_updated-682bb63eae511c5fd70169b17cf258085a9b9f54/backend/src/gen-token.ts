import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const secret = process.env.JWT_SECRET || 'supersecret123';

// Rohit.schoolleader@pdi.com has ID: 980fa890-efbc-465f-9def-c6729bf75df6
const payload = {
    id: '980fa890-efbc-465f-9def-c6729bf75df6',
    role: 'LEADER',
    fullName: 'Rohit',
    campusId: 'EBTM'
};

const token = jwt.sign(payload, secret, { expiresIn: '1d' });
console.log('TOKEN:', token);
