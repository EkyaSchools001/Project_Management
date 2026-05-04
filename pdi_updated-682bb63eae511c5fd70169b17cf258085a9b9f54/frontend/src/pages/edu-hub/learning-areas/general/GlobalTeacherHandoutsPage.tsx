import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CaretLeft, 
  FileText, 
  ListChecks, 
  Info, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Lightbulb,
  Sparkle,
  PencilSimple,
  ArrowRight,
  Target,
  GraduationCap,
  Toolbox,
  Layout,
  Eye,
  Books,
  ShieldCheck,
  Translate,
  ArrowUpRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const GlobalTeacherHandoutsPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeHandout, setActiveHandout] = useState(0);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
    mainTitle: "Teacher Handouts",
    italicTitle: "All Categories",
    heroDesc: "A comprehensive guide to the Ekya Schools teaching-learning ecosystem, covering curriculum, instruction, assessment, and institutional policies.",
    handouts: [
      {
        id: "01",
        title: "Curriculum Overview",
        subtitle: "Understanding your Learning Area: Rationale, Standards & Scope and Sequence",
        intro: "At Ekya Schools, the curriculum is planned using the Understanding by Design (UbD) Framework: where 'understanding' is the key to learning. Every Learning Area (LA) is benchmarked with international standards and grounded in research-based pedagogy.",
        content: [
          { 
            heading: "Learning Area Rationale (LAP)", 
            bullets: [
              "Every Learning Area at Ekya has a clear purpose statement: the Learning Area Purpose (LAP). It explains why students learn this subject and what larger goals it serves.",
              "Read your LA Insert carefully: it tells you the philosophical and pedagogical foundation of your subject.",
              "The rationale connects your everyday lessons to the larger mission: empowering students to think deeply, collaborate, and transfer learning to real-world situations."
            ]
          },
          {
            heading: "Standards",
            bullets: [
              "Ekya's curriculum is standards-aligned: every unit, lesson, and assessment is mapped to specific learning standards.",
              "Standards describe what students should KNOW, UNDERSTAND, and be able to DO (KUD) by the end of a unit.",
              "Standards drive the design of all Authentic Tasks and Common Assessments."
            ]
          }
        ],
        materials: ["LA Insert for your Learning Area", "Rubicon Atlas / C&I login", "Schoology account", "Academic Year Master Map", "AY Planning Calendar"],
        dos: [
          { text: "Read your LA Insert thoroughly at the start of the year" },
          { text: "Refer to your Master Map on C&I before planning each unit" },
          { text: "Align every lesson to the standards listed in your unit plan" }
        ],
        donts: [
          { text: "Teach from textbooks without referring to the curriculum map" },
          { text: "Skip standards alignment in your microplans" },
          { text: "Assume all students arrive with the same prior knowledge" }
        ],
        glossary: [
          { term: "UbD", mean: "Understanding by Design framework" },
          { term: "LAP", mean: "Learning Area Purpose rationale" },
          { term: "KUD", mean: "Know, Understand, Do dimensions" }
        ],
        quickTips: [
          "Bookmark your LA's Master Map on C&I for quick access every week.",
          "Print the Scope and Sequence and keep it in your planning folder.",
          "Use the LAP as your 'north star' when making instructional decisions."
        ]
      },
      {
        id: "02",
        title: "Instructional Practices",
        subtitle: "Teacher Methodology and Integrating Technology in the Ekya Classroom",
        intro: "At Ekya Schools, we believe in a collaborative, positive, and student-centric learning environment. Our instructional approach is inquiry-driven, immersive, and built on the UbD Framework.",
        content: [
          { 
            heading: "Teacher Methodology", 
            bullets: [
              "All instruction at Ekya is grounded in the UbD Backward Design approach.",
              "Pedagogical approaches: Inquiry-Based, Project-Based, Collaborative, Differentiated, and Experiential Learning.",
              "Use Thinking Routines (e.g., KWL, 3-2-1) to scaffold student thinking.",
              "Establish classroom management routines: mindfulness (centring), non-verbal signals, and structured discussion norms."
            ]
          },
          {
            heading: "Integrating Technology",
            bullets: [
              "Schoology (LMS): The primary platform for resources, assignments, and communication.",
              "C&I (Curriculum & Instruction): Where lesson plans, microplans, and unit maps are created.",
              "PowerBuddy AI: AI-powered tool within C&I to assist with planning.",
              "AI Tools: Teachers may use platforms like ChatGPT to generate microplans from unit checklists."
            ]
          }
        ],
        materials: ["C&I access", "Schoology login", "Google Workspace account", "LA Toolkit", "Microplan template", "AI tools: PowerBuddy, ChatGPT"],
        dos: [
          { text: "Plan every lesson with a clear learning objective linked to a standard" },
          { text: "Use thinking routines consistently to build metacognitive habits" },
          { text: "Post resources and updates on Schoology regularly" }
        ],
        donts: [
          { text: "Rely solely on textbooks: go beyond them with authentic resources" },
          { text: "Use technology for its own sake; always connect it to a learning goal" },
          { text: "Copy AI-generated plans without reviewing and adapting them" }
        ],
        glossary: [
          { term: "CPA", mean: "Concrete-Pictorial-Abstract (Singapore Math)" },
          { term: "LMS", mean: "Learning Management System (Schoology)" },
          { term: "Backward Design", mean: "Planning starting with goals and assessments" }
        ],
        quickTips: [
          "Vary your pedagogical approaches within a unit.",
          "Set up Schoology sections at the start of the year.",
          "Mindfulness routines (3-breath reset) take 2 minutes and improve focus."
        ]
      },
      {
        id: "03",
        title: "Assessment Practices",
        subtitle: "Practices, Forms of Assessment, Feedback & Reporting at Ekya Schools",
        intro: "Assessment is not just a measure: it is a learning experience. Our assessment philosophy ensures that every student has varied opportunities to demonstrate understanding and reflect on growth.",
        content: [
          { 
            heading: "Types of Assessment", 
            bullets: [
              "Ungraded: Reflections and application tasks used formatively.",
              "Graded: Unit Assessments, Common Reviews, Term-End Examinations, and Board Exams.",
              "Authentic Tasks: Real-world tasks where students transfer learning.",
              "Student Portfolio: A curated collection of work demonstrating learning over time."
            ]
          }
        ],
        materials: ["Assessment Pattern document", "Schoology Gradebook", "Assessment Register", "Evidence of Learning folder", "Stage 4 Feedback Form"],
        dos: [
          { text: "Map every assessment to the relevant learning standards" },
          { text: "Use a variety of assessment forms across the year" },
          { text: "Provide written and verbal feedback that helps students grow" }
        ],
        donts: [
          { text: "Assess only through tests and exams : use diverse formats" },
          { text: "Give feedback without connecting it to the learning goal" },
          { text: "Leave gradebook entries incomplete before report card season" }
        ],
        glossary: [
          { term: "Authentic Task", mean: "Real-world task requiring transfer of learning" },
          { term: "EOL", mean: "Evidence of Learning documentation" },
          { term: "Stage 4", mean: "Reflection and feedback stage in UbD" }
        ],
        quickTips: [
          "Plan your assessments at the beginning of the unit.",
          "Use Schoology's rubric feature to share criteria with students.",
          "Keep your EOL folder updated at least fortnightly."
        ]
      },
      {
        id: "04",
        title: "Lesson Planning",
        subtitle: "Accessing Curriculum on C&I | Microplans, Toolkit & Schoology",
        intro: "At Ekya Schools, every hour of learning is planned with intention. Lesson planning is done digitally using the C&I platform, integrated with Schoology.",
        content: [
          { 
            heading: "Creating Microplans", 
            bullets: [
              "Navigate to Lessons → Week Planner in C&I.",
              "Select the pre-designated Microplan Template.",
              "Link the lesson to the correct unit: the tab highlights in colour.",
              "Use AI (PowerBuddy) to draft microplans from unit checklists."
            ]
          }
        ],
        materials: ["C&I login", "Microplan template", "LA Toolkit", "Schoology account", "AI tool access"],
        dos: [
          { text: "Complete microplans at least 2–3 days before each session" },
          { text: "Always link your lesson to the correct unit on C&I" },
          { text: "Use the Microplan Template : do not create free-form plans" }
        ],
        donts: [
          { text: "Plan lessons in isolation : connect to the big picture" },
          { text: "Leave the learning objective blank" },
          { text: "Use AI output as-is without reviewing" }
        ],
        glossary: [
          { term: "Microplan", mean: "Detailed lesson plan for a single session" },
          { term: "Week Planner", mean: "C&I tool for scheduling and designing sessions" },
          { term: "Stage 1", mean: "Identifying Desired Results (Standards, KUDs)" }
        ],
        quickTips: [
          "Plan for the week on Fridays.",
          "Copy well-designed microplans and adapt them.",
          "Include a hook/activator and a closing reflection in every plan."
        ]
      },
      {
        id: "05",
        title: "Making Learning Visible",
        subtitle: "Documenting, Showcasing and Reflecting on Student Learning",
        intro: "Making learning visible means creating opportunities for students, and teachers, to see, document, and reflect on what is being understood.",
        content: [
          { 
            heading: "Evidence of Learning", 
            bullets: [
              "EOL includes: work samples, photos, recordings, and reflections.",
              "Each teacher maintains an EOL folder on Google Drive, linked to C&I Stage 4.",
              "EOL is collected throughout the year and forms the basis for reporting."
            ]
          },
          {
            heading: "Thinking Routines",
            bullets: [
              "Visible Thinking Routines (e.g., See-Think-Wonder) make student thinking explicit.",
              "Use chart paper, Padlet, or Slides to display student thinking.",
              "Displays serve as formative data for instruction."
            ]
          }
        ],
        materials: ["Student notebooks", "EOL folder on Drive", "Rubric templates", "Thinking Routine templates"],
        dos: [
          { text: "Check and return notebooks regularly with written feedback" },
          { text: "Photograph and upload student work to EOL folders consistently" },
          { text: "Display thinking routine outputs in the classroom" }
        ],
        donts: [
          { text: "Collect notebooks without giving feedback" },
          { text: "Leave EOL folders empty" },
          { text: "Display only 'perfect' work : show the process" }
        ],
        glossary: [
          { term: "Notebooking", mean: "Structured practice of maintaining subject notebooks" },
          { term: "Visible Thinking", mean: "Strategies making thinking explicit" },
          { term: "Padlet", mean: "Digital collaborative board for sharing thinking" }
        ],
        quickTips: [
          "Take 5 minutes weekly to upload work photos.",
          "A simple exit ticket on a sticky note is powerful EOL.",
          "Make a 'Learning Wall' in your classroom."
        ]
      },
      {
        id: "06",
        title: "Resources and Materials",
        subtitle: "Accessing and Using Learning Resources to Support Teaching and Learning",
        intro: "Knowledge is not limited to textbooks: it extends beyond them. Teachers are supported with a rich array of digital and physical resources.",
        content: [
          { 
            heading: "Resource Ecosystem", 
            bullets: [
              "Digital: Schoology, C&I, Google Workspace, LA-specific platforms.",
              "Physical: LA Resource Kits, In-house Resource Books, Manipulatives.",
              "Professional: PDI workshops, MOOCs, Peer Learning."
            ]
          }
        ],
        materials: ["Schoology", "Google Drive", "C&I platform", "LA Resource Kit", "PDI access"],
        dos: [
          { text: "Curate and post resources on Schoology before units begin" },
          { text: "Use a variety of types : videos, articles, manipulatives" },
          { text: "Access PDI regularly for PD opportunities" }
        ],
        donts: [
          { text: "Rely solely on textbooks" },
          { text: "Post resources without organizing by unit" },
          { text: "Miss PDI sessions: they support instructional growth" }
        ],
        glossary: [
          { term: "LA Resource Kit", mean: "Curated materials aligned to curriculum" },
          { term: "PDI", mean: "Professional Development Institute" },
          { term: "Manipulative", mean: "Physical object used for concrete modelling" }
        ],
        quickTips: [
          "Organise Schoology sections by unit at the start of the year.",
          "Preview all videos and articles before assigning.",
          "Check with your coordinator about the LA Resource Kit contents."
        ]
      },
      {
        id: "07",
        title: "Board Policies and Procedures",
        subtitle: "Key Institutional Policies Every Ekya Teacher Should Know",
        intro: "Understanding and adhering to board policies (CBSE/ICSE) and institutional procedures ensures academic integrity and professional conduct.",
        content: [
          { 
            heading: "Key Policies", 
            bullets: [
              "Academic: Alignment with Master Map, Assessment Pattern, Correction Policy.",
              "Professional: Punctuality, Communication Norms, Confidentiality.",
              "Operational: Leave/Substitution process, Incident Reporting, Resource Requests."
            ]
          }
        ],
        materials: ["Assessment Pattern document", "Academic Calendar", "Board Guidelines", "Employee Handbook"],
        dos: [
          { text: "Familiarise yourself with board guidelines for your LA" },
          { text: "Communicate with parents professionally through official channels" },
          { text: "Maintain complete confidentiality of student data" }
        ],
        donts: [
          { text: "Share student scores via unofficial channels" },
          { text: "Make changes to assessment schedules without approval" },
          { text: "Dismiss student welfare concerns : always report" }
        ],
        glossary: [
          { term: "CMR Group", mean: "Parent organisation of Ekya Schools" },
          { term: "Typology", mean: "Question classification framework (MCQ, SA, etc.)" },
          { term: "Welfare Concern", mean: "Issue affecting physical/emotional wellbeing" }
        ],
        quickTips: [
          "Keep the assessment pattern handy throughout the year.",
          "When in doubt about a policy, ask your coordinator.",
          "Use Schoology messaging for all parent communication."
        ]
      },
      {
        id: "08",
        title: "Master Glossary",
        subtitle: "Key Terms and Concepts in the Ekya Schools Teaching-Learning Ecosystem",
        intro: "This Master Glossary compiles the most important terms, acronyms, and concepts used across Ekya Schools.",
        content: [
          { 
            heading: "Usage", 
            bullets: [
              "Covers all 7 handout categories.",
              "Terms are listed alphabetically within each category.",
              "Go-to reference for professional conversations."
            ]
          }
        ],
        materials: ["Glossary handout", "Digital version on Schoology", "C&I embedded version"],
        dos: [
          { text: "Keep this glossary accessible : digital or printed" },
          { text: "Refer to it during planning and professional conversations" },
          { text: "Share unfamiliar terms with students where appropriate" }
        ],
        donts: [
          { text: "Use acronyms with parents without explaining them" },
          { text: "Assume all colleagues use terms the same way" }
        ],
        glossary: [
          { term: "UbD", mean: "Understanding by Design" },
          { term: "LAP", mean: "Learning Area Purpose" },
          { term: "EOL", mean: "Evidence of Learning" },
          { term: "PDI", mean: "Professional Development Institute" }
        ],
        quickTips: [
          "Share the Master Glossary with new staff.",
          "Use consistent Ekya terminology in official documents.",
          "Review at the start of each term as a refresher."
        ]
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_global_teacher_handouts");
        if (result && result.value) {
          setData(prev => sanitizeContent({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const role = currentUser?.role?.toUpperCase() || "";
    return ["ADMIN", "SUPERADMIN", "TESTER"].includes(role);
  };

  const getIcon = (id: string) => {
    switch(id) {
      case "01": return <Layout className="w-6 h-6" />;
      case "02": return <GraduationCap className="w-6 h-6" />;
      case "03": return <Target className="w-6 h-6" />;
      case "04": return <PencilSimple className="w-6 h-6" />;
      case "05": return <Eye className="w-6 h-6" />;
      case "06": return <Toolbox className="w-6 h-6" />;
      case "07": return <ShieldCheck className="w-6 h-6" />;
      case "08": return <Translate className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 rounded-b-[2.5rem] smooth-scroll overflow-x-hidden">
      <PageEditorControls 
        settingKey="page_global_teacher_handouts"
        initialData={data}
        onSave={setData}
        title="Global Teacher Handouts"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "mainTitle", label: "Main Title", type: "input" },
          { key: "italicTitle", label: "Italic Title", type: "input" },
          { key: "heroDesc", label: "Hero Description", type: "textarea" },
          { 
            key: "handouts", 
            label: "Handouts List", 
            type: "list",
            itemFields: [
              { key: "title", label: "Handout Title", type: "input" },
              { key: "subtitle", label: "Subtitle", type: "input" },
              { key: "intro", label: "Introduction", type: "textarea" },
              { 
                key: "content", 
                label: "Sections", 
                type: "list",
                itemFields: [
                   { key: "heading", label: "Section Heading", type: "input" },
                   { key: "bullets", label: "Bullet Points", type: "list", itemFields: [{ key: "text", label: "Bullet", type: "textarea" }] }
                ]
              },
              { key: "materials", label: "Materials Needed (List)", type: "list", itemFields: [{ key: "text", label: "Item", type: "input" }] },
              { 
                key: "dos", 
                label: "Do's", 
                type: "list",
                itemFields: [{ key: "text", label: "Do Text", type: "textarea" }]
              },
              { 
                key: "donts", 
                label: "Don'ts", 
                type: "list",
                itemFields: [{ key: "text", label: "Don't Text", type: "textarea" }]
              },
              { 
                key: "glossary", 
                label: "Glossary", 
                type: "list",
                itemFields: [
                  { key: "term", label: "Term", type: "input" },
                  { key: "mean", label: "Meaning", type: "textarea" }
                ]
              },
              { key: "quickTips", label: "Quick Tips (List)", type: "list", itemFields: [{ key: "text", label: "Tip", type: "textarea" }] }
            ]
          }
        ]}
      />

      {/* Standardized Portal Banner */}
      <PortalBanner
        title={data.mainTitle + " " + data.italicTitle}
        subtitle={data.heroDesc}
        icon={Sparkle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        className="mt-6 mb-12"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2 sticky top-8 h-fit">
             <div className="px-4 py-3 mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select Handout</h3>
             </div>
             {data.handouts.map((h, idx) => (
               <button
                 key={h.id}
                 onClick={() => setActiveHandout(idx)}
                 className={`w-full text-left p-5 rounded-3xl transition-all duration-300 flex items-center gap-5 group relative overflow-hidden ${
                   activeHandout === idx 
                   ? 'bg-white shadow-xl shadow-primary/5 text-slate-900 scale-[1.02]' 
                   : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                 }`}
               >
                 {activeHandout === idx && (
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-primary" />
                 )}
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                   activeHandout === idx ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 group-hover:bg-slate-200'
                 }`}>
                   {getIcon(h.id)}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Handout {h.id}</span>
                    <span className="text-sm font-bold tracking-tight line-clamp-1">{h.title}</span>
                 </div>
                 <ArrowRight className={`ml-auto w-4 h-4 transition-all duration-300 ${activeHandout === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
               </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
             {data.handouts[activeHandout] && (
               <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-12">
                  
                  {/* Header */}
                  <div className="bg-white rounded-[3rem] p-12 lg:p-16 shadow-sm border border-slate-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                        {getIcon(data.handouts[activeHandout].id)}
                     </div>
                     <div className="max-w-4xl relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                           <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                              Handout {data.handouts[activeHandout].id} of 08
                           </span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Year 2025–26</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">
                           {data.handouts[activeHandout].title}
                        </h2>
                        <h3 className="text-xl font-bold text-primary mb-8 leading-relaxed italic">
                           {data.handouts[activeHandout].subtitle}
                        </h3>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed">
                           {data.handouts[activeHandout].intro}
                        </p>
                     </div>
                  </div>

                  {/* Main Content Blocks */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 px-8">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                           <Books weight="duotone" className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Main Content</h4>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.handouts[activeHandout].content.map((section: any, sIdx: number) => (
                          <div key={sIdx} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                             <h5 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full" />
                                {section.heading}
                             </h5>
                             <ul className="space-y-4">
                                {section.bullets.map((bullet: any, bIdx: number) => (
                                  <li key={bIdx} className="flex gap-4 group">
                                     <div className="w-2 h-2 rounded-full bg-primary/30 mt-2.5 flex-none group-hover:bg-primary transition-colors" />
                                     <p className="text-base text-slate-600 font-medium leading-relaxed">
                                        {typeof bullet === 'string' ? bullet : bullet.text}
                                     </p>
                                  </li>
                                ))}
                             </ul>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Bottom Grid: Materials, Do's/Don'ts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Materials */}
                     <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden h-fit lg:sticky lg:top-8">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                           <Toolbox size={120} weight="fill" />
                        </div>
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">Materials Needed</h4>
                        <ul className="space-y-5">
                           {data.handouts[activeHandout].materials.map((m: any, mIdx: number) => (
                             <li key={mIdx} className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                   <ArrowUpRight size={14} weight="bold" />
                                </div>
                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                   {typeof m === 'string' ? m : m.text}
                                </span>
                             </li>
                           ))}
                        </ul>
                     </div>

                     {/* Do's and Don'ts */}
                     <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
                           <div className="flex items-center gap-4 mb-8">
                              <CheckCircle className="w-6 h-6 text-emerald-500" weight="duotone" />
                              <h4 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Best Practices (Do's)</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {data.handouts[activeHandout].dos.map((d: any, dIdx: number) => (
                                <div key={dIdx} className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex gap-4 items-start group">
                                   <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-none group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                      <CheckCircle size={14} weight="bold" />
                                   </div>
                                   <p className="text-sm font-bold text-slate-700 leading-tight">{d.text}</p>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
                           <div className="flex items-center gap-4 mb-8">
                              <XCircle className="w-6 h-6 text-rose-500" weight="duotone" />
                              <h4 className="text-sm font-black text-rose-600 uppercase tracking-[0.3em]">Common Pitfalls (Don'ts)</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {data.handouts[activeHandout].donts.map((d: any, dIdx: number) => (
                                <div key={dIdx} className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100 flex gap-4 items-start group">
                                   <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 flex-none group-hover:bg-rose-500 group-hover:text-white transition-all">
                                      <XCircle size={14} weight="bold" />
                                   </div>
                                   <p className="text-sm font-bold text-slate-700 leading-tight">{d.text}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Glossary & Tips */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     
                     <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                           <BookOpen className="w-6 h-6 text-primary" weight="duotone" />
                           <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em]">Glossary Terms</h4>
                        </div>
                        <div className="space-y-4">
                           {data.handouts[activeHandout].glossary.map((g: any, gIdx: number) => (
                             <div key={gIdx} className="p-6 rounded-[1.5rem] border border-slate-50 bg-slate-50/30 flex flex-col gap-1">
                                <span className="text-sm font-black text-slate-900">{g.term}</span>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">{g.mean}</p>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 space-y-10">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-inner">
                                 <Lightbulb size={32} weight="fill" className="text-white" />
                              </div>
                              <h4 className="text-xl font-black uppercase tracking-[0.4em]">Quick Tips</h4>
                           </div>
                           
                           <div className="space-y-6">
                              {data.handouts[activeHandout].quickTips.map((tip: any, tIdx: number) => (
                                <div key={tIdx} className="flex gap-5 group">
                                   <div className="w-2 h-2 rounded-full bg-white/40 mt-3 group-hover:bg-white group-hover:scale-150 transition-all" />
                                   <p className="text-lg font-bold leading-relaxed italic opacity-90 group-hover:opacity-100 transition-opacity">
                                      {typeof tip === 'string' ? tip : tip.text}
                                   </p>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                  </div>

               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTeacherHandoutsPage;


