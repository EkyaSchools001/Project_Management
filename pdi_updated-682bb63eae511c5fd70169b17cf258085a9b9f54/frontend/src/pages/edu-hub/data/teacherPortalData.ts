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

export const TEACHING_DATA: Record<'lang' | 'math' | 'science' | 'humanities' | 'pe', LearningArea> = {
  lang: {
    label: 'Languages',
    desc: 'English, Hindi, Kannada, and French across all stages.',
    subs: ['English', 'Hindi', 'Kannada', 'French'],
    subIds: ['english', 'hindi', 'kannada', 'french'],
    subjectData: {
      english: {
        label: 'English',
        stages: [
          {
            id: 'ey',
            label: 'Early years',
            color: 'var(--ey)',
            bg: 'var(--ey-bg)',
            desc: 'Language & Literacy (L&L)',
            purpose: ['L&L vision document', 'Why oral language comes first in EY', 'Connection to school values and play'],
            curriculum: ['Phonics scope & sequence', 'Oral language progression map', 'Emergent reading continuum', 'Writing readiness milestones'],
            pedagogy: ['Read-aloud methodology guide', 'Shared reading protocol', 'Play-based literacy strategies', 'Morning meeting language routines'],
            tools: ['Decodable readers library', 'Levelled book sets', 'Letter formation cards', 'Story props and puppets kit'],
            assessment: ['Observation record template', 'Running record guide', 'Anecdotal note format', 'Developmental checklist EY'],
            evidence: ['Portfolio samples — EY English', 'Documentation panel examples', 'Annotated student writing — EY', 'Photo evidence guide']
          },
          {
            id: 'primary',
            label: 'Primary',
            color: 'var(--pri)',
            bg: 'var(--pri-bg)',
            desc: 'Reading, writing, grammar, and literature',
            purpose: ['English LA purpose — Primary', 'Subject vision and goals', 'Vertical alignment to Middle'],
            curriculum: ['Curriculum framework Gr 1–5', 'Scope & sequence by year level', 'Booklist — Primary English', 'Period matrix'],
            pedagogy: ["Reader's workshop model", "Writer's workshop guide", 'Grammar in context approach', 'Shared and guided reading protocol'],
            tools: ['Reading log templates', 'Classroom library catalogue', 'Grammar reference cards', 'Digital tools — Reading A–Z'],
            assessment: ['Assessment pattern — Primary', 'Term assessment schedule', 'Writing rubrics Gr 1–5', 'Reading benchmark levels'],
            evidence: ['Student writing portfolios — Primary', 'Reading response journals', 'Annotated exemplars by grade', 'Evidence submission guide']
          },
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Literature, analytical writing, and language study',
            purpose: ['English LA purpose — Middle', 'Subject vision and goals', 'Vertical alignment to Senior'],
            curriculum: ['Curriculum framework Gr 6–8', 'Text list by year', 'Scope & sequence — Middle', 'Booklist — Middle English'],
            pedagogy: ['Socratic seminar facilitation guide', 'Essay writing framework', 'Literature circles protocol', 'Close reading and annotation strategies'],
            tools: ['Essay planning templates', 'Text annotation guide', 'Digital tools — NoRedInk', 'Vocabulary building resources'],
            assessment: ['Assessment pattern — Middle', 'Term schedule', 'Essay assessment rubric', 'Literature response criteria'],
            evidence: ['Essay samples by grade', 'Literature response examples', 'Annotated exemplars', 'Evidence submission guide']
          }
        ]
      },
      hindi: {
        label: 'Hindi',
        stages: [
          {
            id: 'primary',
            label: 'Primary',
            color: 'var(--pri)',
            bg: 'var(--pri-bg)',
            desc: 'Reading, writing, and oral communication',
            purpose: ['Hindi LA purpose — Primary', 'Subject vision and goals'],
            curriculum: ['Curriculum framework — Hindi Primary', 'Scope & sequence', 'Booklist', 'Period matrix'],
            pedagogy: ['Oral storytelling approach', 'Script and writing progression guide', 'Shared reading in Hindi'],
            tools: ['Levelled Hindi readers', 'Alphabet charts', 'Vocabulary flash cards'],
            assessment: ['Assessment pattern', 'Term schedule', 'Oral assessment rubric'],
            evidence: ['Student writing samples — Hindi', 'Reading response examples', 'Portfolio guide']
          },
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Grammar, literature, and written expression',
            purpose: ['Hindi LA purpose — Middle'],
            curriculum: ['Curriculum framework Gr 6–8', 'Text list', 'Booklist'],
            pedagogy: ['Literature analysis approach in Hindi', 'Essay writing guide', 'Grammar in context'],
            tools: ['Grammar reference guide', 'Digital tools', 'Vocabulary builder'],
            assessment: ['Assessment pattern', 'Term schedule', 'Essay rubric'],
            evidence: ['Essay samples', 'Literature response examples', 'Annotated exemplars']
          }
        ]
      },
      kannada: {
        label: 'Kannada',
        stages: [
          {
            id: 'primary',
            label: 'Primary',
            color: 'var(--pri)',
            bg: 'var(--pri-bg)',
            desc: 'First and second language tracks',
            purpose: ['Kannada LA purpose', 'First vs second language distinction'],
            curriculum: ['First language framework', 'Second language framework', 'Booklist'],
            pedagogy: ['Oral language strategies', 'Script learning progression', 'Story-based teaching in Kannada'],
            tools: ['Kannada readers set', 'Alphabet materials', 'Vocabulary charts'],
            assessment: ['Assessment pattern', 'Oral assessment guide'],
            evidence: ['Writing samples — Kannada', 'Reading response examples']
          },
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Literature and advanced language skills',
            purpose: ['Kannada LA purpose — Middle'],
            curriculum: ['Curriculum framework', 'Text list', 'Booklist'],
            pedagogy: ['Literature analysis approach', 'Grammar in context'],
            tools: ['Grammar reference', 'Vocabulary builder'],
            assessment: ['Assessment schedule', 'Essay rubric'],
            evidence: ['Essay samples', 'Literature response examples']
          }
        ]
      },
      french: {
        label: 'French',
        stages: [
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Introductory French as a third language',
            purpose: ['French LA purpose', 'Why French in Middle school'],
            curriculum: ['Course overview and scope', 'Scope & sequence', 'Booklist'],
            pedagogy: ['Communicative language teaching approach', 'Listening-first methodology', 'Role play and dialogue techniques'],
            tools: ['Digital tools — Duolingo for Schools', 'Audio resources', 'Flash card sets'],
            assessment: ['Assessment guide', 'Oral assessment rubric', 'Written assessment format'],
            evidence: ['Speaking samples', 'Written work examples', 'Portfolio guide']
          }
        ]
      }
    }
  },
  math: {
    label: 'Mathematics',
    desc: 'Number, algebra, geometry, data, and mathematical reasoning across all stages.',
    stages: [
      {
        id: 'ey',
        label: 'Early years',
        color: 'var(--ey)',
        bg: 'var(--ey-bg)',
        desc: 'Number & Mathematics (N&M)',
        purpose: ['N&M vision document', 'Why maths in EY matters', 'Connection to play-based learning'],
        curriculum: ['Number sense progression', 'Counting and cardinality scope', 'Patterns and shapes continuum'],
        pedagogy: ['Manipulative-based learning guide', 'Maths talks protocol', 'Inquiry through play — maths', 'Number story approaches'],
        tools: ['Manipulatives inventory', 'Maths games bank', 'Counting collections guide'],
        assessment: ['Observation checklist — N&M', 'N&M developmental milestones', 'Portfolio evidence guide'],
        evidence: ['Photo documentation examples', 'Maths thinking work samples', 'Annotated evidence guide']
      },
      {
        id: 'primary',
        label: 'Primary',
        color: 'var(--pri)',
        bg: 'var(--pri-bg)',
        desc: 'Arithmetic, fractions, geometry, and data handling',
        purpose: ['Maths LA purpose — Primary', 'Vertical alignment document', 'Maths philosophy statement'],
        curriculum: ['Curriculum framework Gr 1–5', 'Scope & sequence by year', 'Booklist', 'Period matrix'],
        pedagogy: ['Concrete–Pictorial–Abstract (CPA) approach', 'Problem-solving protocol', 'Maths talk structures', 'Differentiation strategies'],
        tools: ['Digital tools — Khan Academy', 'Manipulatives guide', 'Problem set bank', 'Maths journal templates'],
        assessment: ['Assessment pattern', 'Term schedule', 'Maths rubrics by grade', 'Problem-solving assessment criteria'],
        evidence: ['Problem-solving samples — Primary', 'Maths journal entries', 'Annotated student work', 'Portfolio guide']
      },
      {
        id: 'middle',
        label: 'Middle',
        color: 'var(--mid)',
        bg: 'var(--mid-bg)',
        desc: 'Algebra, coordinate geometry, statistics, mensuration',
        purpose: ['Maths LA purpose — Middle', 'Vertical alignment to Senior'],
        curriculum: ['Curriculum framework Gr 6–8', 'Scope & sequence', 'Year plans', 'Booklist'],
        pedagogy: ['Inquiry-based maths lessons', 'Proof and reasoning guide', 'Collaborative problem-solving protocol'],
        tools: ['Graphing tools — GeoGebra', 'Problem set bank', 'Investigation templates'],
        assessment: ['Assessment pattern', 'Term schedule', 'Investigation rubric', 'Algebra assessment criteria'],
        evidence: ['Investigation samples', 'Problem-solving portfolios', 'Annotated exemplars']
      },
      {
        id: 'senior',
        label: 'Senior',
        color: 'var(--sen)',
        bg: 'var(--sen-bg)',
        desc: 'Calculus, probability, and board exam preparation',
        purpose: ['Maths LA purpose — Senior', 'Board alignment document'],
        curriculum: ['Board syllabus', 'Year plan Gr 11–12', 'Chapter-wise breakdown'],
        pedagogy: ['Exam strategy guide', 'Derivation teaching approach', 'Application problem methods'],
        tools: ['Past papers bank', 'Marking schemes', 'Revision tracker', 'Graphing calculator guide'],
        assessment: ['Board exam pattern', 'Internal assessment format', 'Pre-board schedule'],
        evidence: ['Board exam solutions', 'Exemplar answer sheets', 'Moderation guide']
      }
    ]
  },
  science: {
    label: 'Science',
    desc: 'Integrated in EY and Primary, branching into Physics, Chemistry, and Biology in Middle and Senior.',
    subs: ['Physics', 'Chemistry', 'Biology'],
    subIds: ['physics', 'chemistry', 'biology'],
    subjectData: {
      physics: {
        label: 'Physics',
        stages: [
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Motion, light, electricity, and sound',
            purpose: ['Physics LA purpose — Middle', 'Subject vision and goals'],
            curriculum: ['Curriculum framework Gr 6–8', 'Chapter sequence', 'Booklist'],
            pedagogy: ['Experimental learning approach', 'Concept mapping guide', 'Problem-solving in Physics'],
            tools: ['Lab equipment list', 'Digital simulations — PhET', 'Practical record format'],
            assessment: ['Assessment pattern', 'Term schedule', 'Practical assessment rubric'],
            evidence: ['Practical records', 'Investigation reports', 'Annotated exemplars']
          }
        ]
      },
      chemistry: {
        label: 'Chemistry',
        stages: [
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Atoms, elements, reactions, and materials',
            purpose: ['Chemistry LA purpose — Middle'],
            curriculum: ['Curriculum framework Gr 6–8', 'Chapter sequence', 'Booklist'],
            pedagogy: ['Lab-based inquiry approach', 'Model making guide', 'Chemical equations methodology'],
            tools: ['Lab safety poster', 'Periodic table resources', 'Practical record format'],
            assessment: ['Assessment pattern', 'Term schedule', 'Lab report rubric'],
            evidence: ['Lab reports', 'Investigation samples', 'Portfolio guide']
          }
        ]
      },
      biology: {
        label: 'Biology',
        stages: [
          {
            id: 'middle',
            label: 'Middle',
            color: 'var(--mid)',
            bg: 'var(--mid-bg)',
            desc: 'Cell biology, ecosystems, human body systems',
            purpose: ['Biology LA purpose — Middle'],
            curriculum: ['Curriculum framework Gr 6–8', 'Chapter sequence', 'Booklist'],
            pedagogy: ['Diagram-based teaching approach', 'Field study guide', 'Dissection protocol'],
            tools: ['Lab equipment list', 'Biology animation tools', 'Practical record format'],
            assessment: ['Assessment pattern', 'Term schedule', 'Diagram assessment rubric'],
            evidence: ['Lab records', 'Diagram samples', 'Portfolio guide']
          }
        ]
      }
    }
  },
  humanities: {
    label: 'Humanities & social science',
    desc: 'History, Geography, Civics, and Economics across all stages.',
    stages: [
      {
        id: 'ey',
        label: 'Early years',
        color: 'var(--ey)',
        bg: 'var(--ey-bg)',
        desc: 'Quest — self, community, and the natural world',
        purpose: ['Quest vision document', 'Why social understanding in EY'],
        curriculum: ['Quest themes by term', 'Scope of inquiry', 'Provocation planner'],
        pedagogy: ['Inquiry cycle guide', 'Community walk methodology', 'Story-based social learning'],
        tools: ['Community map templates', 'Photo documentation kit', 'Story prop sets'],
        assessment: ['Observation record', 'Inquiry documentation guide'],
        evidence: ['Documentation panels', 'Inquiry portfolio samples']
      },
      {
        id: 'primary',
        label: 'Primary',
        color: 'var(--pri)',
        bg: 'var(--pri-bg)',
        desc: 'History, geography, and civics',
        purpose: ['Social science LA purpose — Primary', 'Vertical alignment document'],
        curriculum: ['Curriculum framework Gr 1–5', 'Scope & sequence', 'Booklist', 'Period matrix'],
        pedagogy: ['Source analysis in Primary', 'Map skills teaching sequence', 'Inquiry-based humanities lessons'],
        tools: ['Atlas and map resources', 'Primary source documents', 'Timeline templates'],
        assessment: ['Assessment pattern', 'Term schedule', 'Project rubric', 'Source analysis criteria'],
        evidence: ['Project samples', 'Map work examples', 'Research portfolios']
      },
      {
        id: 'middle',
        label: 'Middle',
        color: 'var(--mid)',
        bg: 'var(--mid-bg)',
        desc: 'History, geography, political science, and economics',
        purpose: ['Social science LA purpose — Middle', 'Vertical alignment to Senior'],
        curriculum: ['Curriculum framework Gr 6–8', 'Chapter sequence', 'Booklist'],
        pedagogy: ['Historical thinking framework', 'Case study method', 'Critical source analysis guide'],
        tools: ['Past paper bank', 'Map work guide', 'Document analysis templates'],
        assessment: ['Assessment pattern', 'Term schedule', 'Essay rubric', 'Map work criteria'],
        evidence: ['Essay samples', 'Case study responses', 'Annotated exemplars']
      }
    ]
  },
  pe: {
    label: 'Physical education',
    desc: 'Movement, games, fitness, and wellbeing across all stages.',
    stages: [
      {
        id: 'ey',
        label: 'Early years',
        color: 'var(--ey)',
        bg: 'var(--ey-bg)',
        desc: 'Gross motor, outdoor play, and movement games',
        purpose: ['PE vision in EY', 'Movement and development connection'],
        curriculum: ['Gross motor skill progression', 'Outdoor play schedule', 'Movement games sequence'],
        pedagogy: ['Play-based movement guide', 'Outdoor learning approach', 'Movement exploration methods'],
        tools: ['Equipment inventory', 'Activity card bank', 'Outdoor space map'],
        assessment: ['Motor skill observation checklist', 'Movement milestone guide'],
        evidence: ['Observation records', 'Documentation of outdoor play']
      },
      {
        id: 'primary',
        label: 'Primary',
        color: 'var(--pri)',
        bg: 'var(--pri-bg)',
        desc: 'Sport skills, team games, and fitness fundamentals',
        purpose: ['PE LA purpose — Primary', 'Sport and wellbeing vision'],
        curriculum: ['Annual plan', 'Sport rotation schedule', 'Fitness framework'],
        pedagogy: ['Sport education model', 'Games for understanding approach', 'Peer coaching guide'],
        tools: ['Equipment list', 'Sport drills bank', 'Fitness circuit plans'],
        assessment: ['Assessment rubrics by sport', 'Fitness benchmark tests', 'Participation criteria'],
        evidence: ['Skills assessment samples', 'Fitness tracking records', 'Participation logs']
      },
      {
        id: 'middle',
        label: 'Middle',
        color: 'var(--mid)',
        bg: 'var(--mid-bg)',
        desc: 'Competitive sport, health and fitness planning',
        purpose: ['PE LA purpose — Middle', 'Competitive and recreational balance'],
        curriculum: ['Annual plan', 'Sport rotation', 'Health and fitness module'],
        pedagogy: ['Tactical games approach', 'Leadership through sport guide', 'Health literacy framework'],
        tools: ['Sport analysis templates', 'Fitness tracking app guide', 'Coaching resources'],
        assessment: ['Performance rubrics', 'Fitness assessments', 'Theory assessment format'],
        evidence: ['Performance records', 'Fitness journals', 'Leadership evidence samples']
      }
    ]
  }
};
