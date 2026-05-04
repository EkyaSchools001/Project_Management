import React from 'react';
import { 
  Books, 
  ChalkboardTeacher, 
  ChartBar, 
  Notepad, 
  Eye, 
  FolderOpen, 
  ClipboardText, 
  AddressBook,
  FileText,
  Link,
  BookOpen,
  Info
} from '@phosphor-icons/react';

const HANDOUT_CARDS = [
  {
    id: '01',
    title: '01 - Curriculum Overview',
    subtitle: 'LA rationale, standards, scope & sequence',
    headerColor: 'bg-[#A81C30]',
    icon: Books,
    items: [
      { title: 'LA Insert : All Learning Areas', desc: 'Programme rationale, key content areas, pedagogy', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'Master Map (C&I Link)', desc: 'Full year unit plans with standards and KUDs', badge: 'Platform', badgeColor: 'text-orange-600 bg-orange-50' },
      { title: 'Scope & Sequence by LA', desc: 'Year-level content progression plan', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'UbD Framework Guide', desc: 'Understanding by Design : stages 1-4 explained', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Rubicon Atlas / C&I Platform', desc: 'Direct link to curriculum mapping tool', badge: 'Platform', badgeColor: 'text-orange-600 bg-orange-50' }
    ]
  },
  {
    id: '02',
    title: '02 - Instructional Practices',
    subtitle: 'Methodology, thinking routines & technology',
    headerColor: 'bg-[#C55A11]',
    icon: ChalkboardTeacher,
    items: [
      { title: 'Instruction Pillar Document', desc: 'Ekya instructional philosophy and approach', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'Thinking Routines Toolkit', desc: 'KWL, 3-2-1, See-Think-Wonder, and more', badge: 'Toolkit', badgeColor: 'text-pink-600 bg-pink-50' },
      { title: 'Technology Integration Guide', desc: 'How to use Schoology, C&I, Google Workspace & AI', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Singapore Math (CPA) Guide', desc: 'Concrete-Pictorial-Abstract methodology for Gr 1-6', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Classroom Management Routines', desc: 'Mindfulness, signals, and routines for an engaged class', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' }
    ]
  },
  {
    id: '03',
    title: '03 - Assessment Practices',
    subtitle: 'Types, forms, feedback & reporting',
    headerColor: 'bg-[#1E8E3E]',
    icon: ChartBar,
    items: [
      { title: 'Assessment Pillar Document', desc: 'Philosophy, types, and forms of assessment at Ekya', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'AY Assessment Pattern', desc: 'Approved assessment schedule for AY 2025-26 per LA', badge: 'Policy', badgeColor: 'text-red-600 bg-red-50' },
      { title: 'Rubric Template Library', desc: 'Rubrics for all assessment forms', badge: 'Toolkit', badgeColor: 'text-pink-600 bg-pink-50' },
      { title: 'Feedback & Correction Guide', desc: 'How to give meaningful, growth-oriented feedback', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Schoology Gradebook Guide', desc: 'Recording, reporting, and managing scores on Schoology', badge: 'Platform', badgeColor: 'text-orange-600 bg-orange-50' },
      { title: 'Mark Register Template', desc: 'Standardised assessment/mark register format', badge: 'Template', badgeColor: 'text-blue-600 bg-blue-50' }
    ]
  },
  {
    id: '04',
    title: '04 - Lesson Planning',
    subtitle: 'C&I, Microplan, Toolkit & Schoology',
    headerColor: 'bg-[#1A73E8]',
    icon: Notepad,
    items: [
      { title: 'Accessing Curriculum on C&I', desc: 'Step-by-step guide to using C&I for planning', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Microplan Template', desc: 'Pre-designed template on C&I Week Planner', badge: 'Template', badgeColor: 'text-blue-600 bg-blue-50' },
      { title: 'AI Microplanning Guide', desc: 'Using PowerBuddy & AI tools to draft microplans', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Academic Year Calendar', desc: 'Key dates, term boundaries, and assessment windows', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'LA Toolkit (per subject)', desc: 'Strategies, thinking tools, unit planning resources', badge: 'Toolkit', badgeColor: 'text-pink-600 bg-pink-50' },
      { title: 'Coordinator Feedback Process', desc: 'How microplan review and feedback works on C&I', badge: 'Process', badgeColor: 'text-red-600 bg-red-50' }
    ]
  },
  {
    id: '05',
    title: '05 - Making Learning Visible',
    subtitle: 'Notebooking, EOL & visible thinking',
    headerColor: 'bg-[#673AB7]',
    icon: Eye,
    items: [
      { title: 'Notebooking Policy & Guide', desc: 'Standards for notebooks, correction, and feedback', badge: 'Policy', badgeColor: 'text-red-600 bg-red-50' },
      { title: 'Evidence of Learning Guide', desc: 'How to collect, organize, and link EOL to C&I Stage 4', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'EOL Folder Template (Drive)', desc: 'Google Drive folder structure for documenting EOL', badge: 'Template', badgeColor: 'text-blue-600 bg-blue-50' },
      { title: 'Thinking Routine Display Guide', desc: 'How to use and display classroom thinking routines', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Stage 4 Feedback Form (C&I)', desc: 'Post-unit reflection form : linked from the Master Map', badge: 'Form', badgeColor: 'text-blue-600 bg-blue-50' }
    ]
  },
  {
    id: '06',
    title: '06 - Resources & Materials',
    subtitle: 'Digital, print & professional learning resources',
    headerColor: 'bg-[#00838F]',
    icon: FolderOpen,
    items: [
      { title: 'LA Resource Kit Index', desc: "What's in your subject resource kit and how to use it", badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'In-House Resource Books', desc: 'Ekya-developed curriculum-aligned resource books', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'Digital Platform Quick Guides', desc: 'Schoology, C&I, Google Workspace : how-to guides', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'PDI PD Calendar & MOOC Access', desc: 'Professional development offerings and course links', badge: 'Platform', badgeColor: 'text-orange-600 bg-orange-50' },
      { title: 'Vetted External Resources', desc: 'Approved external websites, videos, and tools per LA', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' }
    ]
  },
  {
    id: '07',
    title: '07 - Board Policies & Procedures',
    subtitle: 'Academic, conduct, and operational guidelines',
    headerColor: 'bg-[#A0522D]',
    icon: ClipboardText,
    items: [
      { title: 'Ekya Employee Handbook', desc: 'Institutional policies, conduct, and expectations', badge: 'Policy', badgeColor: 'text-red-600 bg-red-50' },
      { title: 'CBSE/ICSE Board Guidelines', desc: 'Board-specific exam guidelines, typology & marking', badge: 'Policy', badgeColor: 'text-red-600 bg-red-50' },
      { title: 'Academic Reporting Calendar', desc: 'Dates for report cards, parent meetings, and submissions', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'Parent Communication Protocol', desc: 'How to communicate with parents through official channels', badge: 'Policy', badgeColor: 'text-red-600 bg-red-50' },
      { title: 'Student Welfare & Safeguarding', desc: 'How to identify, document, and report welfare concerns', badge: 'Policy', badgeColor: 'text-red-600 bg-red-50' },
      { title: 'Leave & Substitution Process', desc: 'Steps to follow when planning leave or cover classes', badge: 'Process', badgeColor: 'text-red-600 bg-red-50' }
    ]
  },
  {
    id: '08',
    title: '08 - Glossary & Help Centre',
    subtitle: 'Key terms, FAQs & support contacts',
    headerColor: 'bg-[#4A148C]',
    icon: AddressBook,
    items: [
      { title: 'Master Glossary', desc: 'All key terms and acronyms used at Ekya Schools', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'Frequently Asked Questions', desc: 'Common teacher questions answered by category', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'Support Contacts Directory', desc: 'Who to contact for curriculum, tech, HR, or welfare queries', badge: 'Reference', badgeColor: 'text-purple-600 bg-purple-50' },
      { title: 'New Teacher Onboarding Guide', desc: 'Getting started at Ekya : platforms, people, and processes', badge: 'Guide', badgeColor: 'text-green-600 bg-green-50' },
      { title: 'What\'s New / Updates', desc: 'Latest policy changes, new resources, and announcements', badge: 'Updates', badgeColor: 'text-purple-600 bg-purple-50' }
    ]
  }
];

export function GlobalHandoutsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {HANDOUT_CARDS.map((card) => (
        <button 
          key={card.id} 
          className={`${card.headerColor} rounded-[1.5rem] p-6 text-white flex items-center gap-4 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm flex-shrink-0">
            <card.icon size={28} weight="fill" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">{card.title}</h3>
            <p className="text-white/80 text-xs mt-1 font-medium leading-tight">{card.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
