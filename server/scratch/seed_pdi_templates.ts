
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultTemplates = [
  {
    name: 'Danielson Framework Observation',
    type: 'Observation',
    status: 'Active',
    isDefault: true,
    structure: JSON.stringify([
      { id: 'q1', label: 'Domain 1: Planning and Preparation', type: 'rating', required: true },
      { id: 'q2', label: 'Domain 2: The Classroom Environment', type: 'rating', required: true },
      { id: 'q3', label: 'Domain 3: Instruction', type: 'rating', required: true },
      { id: 'q4', label: 'Domain 4: Professional Responsibilities', type: 'rating', required: true },
      { id: 'q5', label: 'General Feedback', type: 'textarea', required: false }
    ])
  },
  {
    name: 'Professional Goal Setting (SMART)',
    type: 'Goal Setting',
    status: 'Active',
    isDefault: true,
    structure: JSON.stringify([
      { id: 'g1', label: 'What is your primary goal for this academic year?', type: 'textarea', required: true },
      { id: 'g2', label: 'How will you measure success?', type: 'textarea', required: true },
      { id: 'g3', label: 'Target Completion Date', type: 'date', required: true },
      { id: 'g4', label: 'Resources Needed', type: 'text', required: false }
    ])
  },
  {
    name: 'End-of-Term Reflection',
    type: 'Reflection',
    status: 'Active',
    isDefault: false,
    structure: JSON.stringify([
      { id: 'r1', label: 'What were your greatest achievements this term?', type: 'textarea', required: true },
      { id: 'r2', label: 'What challenges did you face?', type: 'textarea', required: true },
      { id: 'r3', label: 'How did you support student wellbeing?', type: 'textarea', required: true },
      { id: 'r4', label: 'Overall Rating of your performance', type: 'rating', required: true }
    ])
  },
  {
    name: 'Peer Observation Form',
    type: 'Observation',
    status: 'Active',
    isDefault: false,
    structure: JSON.stringify([
      { id: 'p1', label: 'Teacher Name', type: 'text', required: true },
      { id: 'p2', label: 'Class/Subject', type: 'text', required: true },
      { id: 'p3', label: 'Observed Strengths', type: 'textarea', required: true },
      { id: 'p4', label: 'Areas for Growth', type: 'textarea', required: true }
    ])
  }
];

async function main() {
  console.log('Seeding PDI Form Templates...');
  for (const template of defaultTemplates) {
    await prisma.formTemplate.create({
      data: template
    });
  }
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
