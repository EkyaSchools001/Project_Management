import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const newUsers = [
        { name: 'Mathangi R', email: 'hos.nice@ekyaschools.com', pass: 'Mathangi@123', role: 'LEADER', campusId: 'ENICE', department: 'Leadership', academics: 'CORE' as const },
        { name: 'Asmita Shetiya', email: 'coordinator.nice@ekyaschools.com', pass: 'Asmita@123', role: 'LEADER', campusId: 'ENICE', department: 'Leadership', academics: 'CORE' as const },
        { name: 'Rima Kumari Ojha', email: 'rimakumario@ekyaschools.com', pass: 'Rima@123', role: 'TEACHER', campusId: 'ENICE', department: 'Hindi', academics: 'CORE' as const },
        { name: 'Ankita Prakash', email: 'ankitap@ekyaschools.com', pass: 'Ankita@123', role: 'TEACHER', campusId: 'ENICE', department: 'Mathematics', academics: 'CORE' as const },
        { name: 'Thejaswini', email: 'thejaswinia@ekyaschools.com', pass: 'Thejaswini@123', role: 'TEACHER', campusId: 'ENICE', department: 'Kannada', academics: 'CORE' as const },
        { name: 'Taniya Tiwary', email: 'taniyat@ekyaschools.com', pass: 'Taniya@123', role: 'TEACHER', campusId: 'ENICE', department: 'English', academics: 'CORE' as const },
        { name: 'Sugandhi S', email: 'sugandhis@ekyaschools.com', pass: 'Sugandhi@123', role: 'TEACHER', campusId: 'ENICE', department: 'Social Science', academics: 'CORE' as const },
        { name: 'S Jayalakshmi', email: 'jayalakshmis@ekyaschools.com', pass: 'Jayalakshmi@123', role: 'TEACHER', campusId: 'ENICE', department: 'Biology', academics: 'CORE' as const },
        { name: 'Shruthi Srinivas', email: 'shruthis@ekyaschools.com', pass: 'Shruthi@123', role: 'TEACHER', campusId: 'ENICE', department: 'Computer Science', academics: 'CORE' as const },
        { name: 'Susan George', email: 'susang@ekyaschools.com', pass: 'Susan@123', role: 'TEACHER', campusId: 'ENICE', department: 'Life Skills', academics: 'NON_CORE' as const },
        { name: 'Shashikumara R', email: 'shashikumarar@ekyaschools.com', pass: 'Shashikumara@123', role: 'TEACHER', campusId: 'ENICE', department: 'Physical Education', academics: 'NON_CORE' as const },
        { name: 'Rupsikha Dowerah', email: 'rupsikhad@ekyaschools.com', pass: 'Rupsikha@123', role: 'TEACHER', campusId: 'ENICE', department: 'Social Science', academics: 'CORE' as const },
        { name: 'Prashanth Mallik', email: 'prashanthm@ekyaschools.com', pass: 'Prashanth@123', role: 'TEACHER', campusId: 'ENICE', department: 'Visual Arts', academics: 'NON_CORE' as const },
        { name: 'Shakshi Sandil', email: 'shakshis@ekyaschools.com', pass: 'Shakshi@123', role: 'TEACHER', campusId: 'ENICE', department: 'English', academics: 'CORE' as const },
        { name: 'Mangala R', email: 'mangalar@ekyaschools.com', pass: 'Mangala@123', role: 'TEACHER', campusId: 'ENICE', department: 'Kannada', academics: 'CORE' as const },
    ];

    console.log('Inserting ENICE users...');
    for (const u of newUsers) {
        const hash = await bcrypt.hash(u.pass, 10);
        await prisma.user.upsert({
            where: { email: u.email },
            update: { fullName: u.name, passwordHash: hash, role: u.role as any, campusId: u.campusId, department: u.department, academics: u.academics },
            create: { fullName: u.name, email: u.email, passwordHash: hash, role: u.role as any, campusId: u.campusId, department: u.department, academics: u.academics },
        });
        console.log(`Upserted: ${u.name} (${u.email})`);
    }
    console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
