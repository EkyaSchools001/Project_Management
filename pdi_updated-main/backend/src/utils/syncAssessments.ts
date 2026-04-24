import fs from 'fs';
import path from 'path';
import prisma from '../infrastructure/database/prisma';

export const syncAssessmentsToFile = async () => {
    try {
        const assessments = await prisma.assessment.findMany({
            include: { questions: true }
        });

        // Ensure the data directory exists
        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const filePath = path.join(dataPath, 'assessment_templates.json');

        // Strip out specific IDs and timestamps so the seed is clean
        const cleanAssessments = assessments.map(a => {
            const { id, createdById, createdAt, updatedAt, ...rest } = a;
            return {
                ...rest,
                questions: a.questions.map(q => {
                    const { id, assessmentId, ...qRest } = q;
                    return qRest;
                })
            };
        });

        fs.writeFileSync(filePath, JSON.stringify(cleanAssessments, null, 2), 'utf8');
        console.log(`✅ Synced ${cleanAssessments.length} assessment templates to JSON.`);
    } catch (error) {
        console.error('Failed to sync assessments to file:', error);
    }
};
