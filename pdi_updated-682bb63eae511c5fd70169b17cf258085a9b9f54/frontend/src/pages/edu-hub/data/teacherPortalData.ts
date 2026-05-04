export const SECTIONS = ['purpose', 'curriculum', 'pedagogy', 'tools', 'assessment', 'evidence'] as const;
export const SECTION_LABELS = [
  'LA purpose',
  'Curriculum progression',
  'Instructional strategies',
  'Learning tools',
  'Assessment',
  'Student work evidence'
];

export type Stage = 'ey' | 'primary' | 'middle' | 'senior' | 'beyond';

export interface StageContent {
  id: Stage;
  label: string;
  color: string;
  bg: string;
  desc: string;
  purpose: string[];
  curriculum: string[];
  pedagogy: string[];
  tools: string[];
  assessment: string[];
  evidence: string[];
  nestedHandouts?: Record<string, string[]>;
  handoutLinks?: Record<string, string>;
}

export interface SubjectData {
  label: string;
  stages: StageContent[];
}

export interface LearningArea {
  label: string;
  desc: string;
  subs?: string[];
  subIds?: string[];
  subjectData?: Record<string, SubjectData>;
  stages?: StageContent[];
}

export const TEACHING_DATA: Record<string, LearningArea> = {
  cs: {
    label: 'Computer Science',
    desc: 'Empowering students with digital literacy, computational thinking, and programming skills.',
    stages: [
      {
        id: 'beyond',
        label: 'Common Resources',
        color: '#6366f1',
        bg: '#eef2ff',
        desc: 'Foundational documents for Computer Science across all levels.',
        purpose: [],
        curriculum: ['CS Curriculum Overview Handout'],
        pedagogy: [],
        tools: [],
        assessment: ['CS Assessment Practices Handout'],
        evidence: [],
        handoutLinks: {
          'CS Assessment Practices Handout': '/edu-hub/learning/cs/assessment',
          'CS Curriculum Overview Handout': '/edu-hub/learning/cs/curriculum'
        }
      }
    ]
  },
  hass: {
    label: 'HASS (Social Science)',
    desc: 'Humanities and Social Sciences: exploring history, geography, and society.',
    stages: [
      {
        id: 'beyond',
        label: 'Common Resources',
        color: '#f59e0b',
        bg: '#fffbeb',
        desc: 'Core HASS curriculum and assessment documentation.',
        purpose: [],
        curriculum: ['HASS Curriculum Overview Handout'],
        pedagogy: [],
        tools: [],
        assessment: ['HASS Assessment Practices Handout'],
        evidence: [],
        handoutLinks: {
          'HASS Assessment Practices Handout': '/edu-hub/learning/hass/assessment',
          'HASS Curriculum Overview Handout': '/edu-hub/learning/hass/curriculum'
        }
      }
    ]
  },
  lang: {
    label: 'Languages',
    desc: 'Developing literacy and communication skills in multiple languages.',
    stages: [
      {
        id: 'beyond',
        label: 'Common Resources',
        color: '#ec4899',
        bg: '#fdf2f8',
        desc: 'General language learning frameworks and assessment practices.',
        purpose: [],
        curriculum: ['Languages Curriculum Overview Handout'],
        pedagogy: [],
        tools: [],
        assessment: ['Languages Assessment Practices Handout'],
        evidence: [],
        handoutLinks: {
          'Languages Assessment Practices Handout': '/edu-hub/learning/languages/assessment',
          'Languages Curriculum Overview Handout': '/edu-hub/learning/languages/curriculum'
        }
      }
    ]
  },
  math: {
    label: 'Mathematics',
    desc: 'Numerical reasoning, problem-solving, and logical thinking.',
    stages: [
      {
        id: 'beyond',
        label: 'Common Resources',
        color: '#10b981',
        bg: '#ecfdf5',
        desc: 'Math curriculum overview and assessment guidelines.',
        purpose: [],
        curriculum: ['Math Curriculum Overview Handout'],
        pedagogy: [],
        tools: [],
        assessment: ['Math Assessment Practices Handout'],
        evidence: [],
        handoutLinks: {
          'Math Assessment Practices Handout': '/edu-hub/learning/math/assessment',
          'Math Curriculum Overview Handout': '/edu-hub/learning/math/curriculum'
        }
      }
    ]
  },
  science: {
    label: 'Science',
    desc: 'Inquiry-based exploration of the natural and physical world.',
    stages: [
      {
        id: 'beyond',
        label: 'Common Resources',
        color: '#3b82f6',
        bg: '#eff6ff',
        desc: 'Scientific inquiry frameworks and assessment tools.',
        purpose: [],
        curriculum: ['Science Curriculum Overview Handout'],
        pedagogy: [],
        tools: [],
        assessment: ['Science Assessment Practices Handout'],
        evidence: [],
        handoutLinks: {
          'Science Assessment Practices Handout': '/edu-hub/learning/science/assessment',
          'Science Curriculum Overview Handout': '/edu-hub/learning/science/curriculum'
        }
      }
    ]
  },
  specialists: {
    label: 'Specialists',
    desc: 'Life Skills, Arts, and Physical Education specialized programs.',
    stages: [
      {
        id: 'beyond',
        label: 'Curriculum Overviews',
        color: '#8b5cf6',
        bg: '#f5f3ff',
        desc: 'Overview handouts for all specialist areas.',
        purpose: [],
        curriculum: [
          'Life Skills Curriculum Overview Handout',
          'Performing Arts Curriculum Overview Handout',
          'Physical Education Curriculum Overview Handout',
          'Visual Arts Curriculum Overview Handout'
        ],
        pedagogy: [],
        tools: [],
        assessment: [],
        evidence: [],
        handoutLinks: {
          'Life Skills Curriculum Overview Handout': '/edu-hub/learning/specialists/lifeskills/curriculum',
          'Performing Arts Curriculum Overview Handout': '/edu-hub/learning/specialists/performingarts/curriculum',
          'Physical Education Curriculum Overview Handout': '/edu-hub/learning/specialists/pe/curriculum',
          'Visual Arts Curriculum Overview Handout': '/edu-hub/learning/specialists/visualarts/curriculum'
        }
      }
    ]
  },
  'teacher-handouts': {
    label: 'Ekya Teacher Handouts All Categories',
    desc: 'Comprehensive teacher resources and handouts across all categories.',
    stages: [
      {
        id: 'beyond',
        label: 'Common Resources',
        color: '#EA104A',
        bg: '#FFF1F2',
        desc: 'Global teacher handouts and category-wide documentation.',
        purpose: [],
        curriculum: ['Ekya Teacher Handouts All Categories'],
        pedagogy: [],
        tools: [],
        assessment: [],
        evidence: [],
        handoutLinks: {
          'Ekya Teacher Handouts All Categories': '/edu-hub/learning/general/teacher-handouts'
        }
      }
    ]
  }
};
