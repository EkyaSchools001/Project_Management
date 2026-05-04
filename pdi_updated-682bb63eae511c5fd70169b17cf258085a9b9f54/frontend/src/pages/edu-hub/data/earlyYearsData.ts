export interface ResourceSection {
  title: string;
  type: 'text' | 'list' | 'table' | 'grid' | 'checklist' | 'tips' | 'glossary' | 'dos_donts' | 'milestones';
  content: any;
}

export interface ResourcePageData {
  id: string;
  title: string;
  subtitle: string;
  sections: ResourceSection[];
}

export const EARLY_YEARS_RESOURCES: Record<string, ResourcePageData> = {
  'program-overview-philosophy': {
    id: 'program-overview-philosophy',
    title: 'Program Overview & Philosophy',
    subtitle: 'Understanding who we are, what we believe, and why we teach the way we do at Ekya Early Years.',
    sections: [
      {
        title: 'VISION & MISSION',
        type: 'text',
        content: `Vision: To build progressive K-12 schools that provide technology-rich and immersive learning experiences. Facilitated by passionate educators, we prepare our students for a rapidly evolving future.

Mission: To empower young minds to make a difference in the world.

Program Aim: The Ekya Early Years Program promotes sustained, healthy development of children between 2.5 and 6 years of age, and prepares them for later school years with a strong foundation for learning.`
      },
      {
        title: 'THE TWO PROGRAMS AT EKYA EARLY YEARS',
        type: 'list',
        content: [
          { label: 'Montessori Program (2.5 – 5.5 years)', text: 'Developed by Dr Maria Montessori. Encourages independent learning, mixed-age classrooms, and holistic development across physical, cognitive, social, and emotional domains. Each child works at their own developmental pace with specifically designed materials.' },
          { label: 'Kindergarten Program (4 – 6 years)', text: 'A two-year play-based program for K1 and K2 children. Emphasises exploration, experimentation, expression, and collaboration. Children engage in circle time, literacy, numeracy, arts, music, storytelling, and science experiments in a joyful, balanced environment.' }
        ]
      },
      {
        title: 'OUR SIX PILLARS',
        type: 'table',
        content: {
          headers: ['PILLAR', 'WHAT IT MEANS IN PRACTICE'],
          rows: [
            ['Live the Lesson', 'Teachers model the values, habits, and behaviours they want to see in children. The lesson lives in how we are, not just what we teach.'],
            ['Authentic Assessment', 'Assessment reflects real learning  through observation, performance tasks, and ongoing documentation rather than tests.'],
            ['Professional Practice', 'Teachers are reflective, collaborative, and continuously growing. Great teaching is a craft that is developed over time.'],
            ['Instruct to Inspire', 'Teaching at Ekya goes beyond delivery: it sparks curiosity, wonder, and a genuine desire to learn more.'],
            ['Care about Culture', 'A warm, inclusive classroom culture is the foundation of everything. Children learn best when they feel safe, seen, and valued.'],
            ['Engaging Environment', 'The classroom environment is purposeful, beautiful, and designed to invite exploration and independent learning.']
          ]
        }
      },
      {
        title: 'OUR PROCESS: LEARN, THINK, DO',
        type: 'list',
        content: [
          { label: 'LEARN', text: 'Ekya is a community of children, educators, and parents who learn together. Learning is not one-directional.' },
          { label: 'THINK', text: 'Thinking at Ekya involves two key actions: Connect (linking new ideas to existing knowledge and the world) and Enquire (asking important questions and challenging assumptions).' },
          { label: 'DO', text: 'Children at Ekya create, care, collaborate, and communicate. These four actions are at the heart of every learning experience.' }
        ]
      },
      {
        title: 'OUR PHILOSOPHY: THE THREE DISPOSITIONS',
        type: 'list',
        content: [
          { label: 'Aware', text: 'Children cultivate an understanding of their own thoughts, feelings, and emotions, and their place in the wider systems and communities they belong to.' },
          { label: 'Compassionate', text: 'Children develop a way of relating to themselves, others, and all of humanity through kindness and empathy.' },
          { label: 'Engaged', text: 'Children build attitudes and skills that support their personal, social, and communal well-being, and those of others.' }
        ]
      },
      {
        title: 'THE PHILOSOPHICAL FOUNDATIONS',
        type: 'list',
        content: [
          { label: 'Montessori', text: 'Child-led, hands-on learning through carefully prepared environments and materials. Emphasis on independence, mixed-age learning, and the child\'s natural curiosity.' },
          { label: 'Reggio Emilia', text: 'The child as a capable, curious co-constructor of knowledge. The environment as the third teacher. Creativity and expression across a hundred languages.' },
          { label: 'Habits of Heart and Mind', text: 'Explicitly developing dispositions: Respect, Grit, Empathy, Integrity, and Service (Heart); and Think Creatively, Learn Continuously, Communicate Effectively, Reason Critically, Collaborate Productively (Mind).' }
        ]
      },
      {
        title: 'THE EKYA CHILD',
        type: 'text',
        content: 'Curious, confident, and deeply caring: our children see themselves as part of nature\'s web. They know that taking care of the planet is another way of looking after their home.'
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Know and be able to articulate the Ekya philosophy to parents and colleagues' },
          { type: 'dont', text: 'Don\'t treat the philosophy as a document; live it daily' },
          { type: 'do', text: 'Ensure all Six Pillars are visible in your classroom practice' },
          { type: 'dont', text: 'Don\'t separate curriculum from culture: they are one' },
          { type: 'do', text: 'Build a classroom culture of curiosity, compassion, and engagement' },
          { type: 'dont', text: 'Don\'t focus only on academic outcomes; holistic development is the goal' },
          { type: 'do', text: 'Connect your daily teaching decisions back to the Learn-Think-Do process' },
          { type: 'dont', text: 'Don\'t teach in isolation: the program is designed to be integrated' },
          { type: 'do', text: 'Model the Habits of Heart and Mind you want children to develop' },
          { type: 'dont', text: 'Don\'t forget: you are also part of the Ekya learning community' }
        ]
      },
      {
        title: 'GLOSSARY',
        type: 'glossary',
        content: [
          { term: 'Montessori Method', meaning: 'An educational approach developed by Dr Maria Montessori emphasising independence, mixed ages, and child-led learning through prepared environments.' },
          { term: 'Reggio Emilia', meaning: 'A philosophy from northern Italy that views children as capable, expressive learners, with the environment as the \'third teacher.\'' },
          { term: 'Six Pillars', meaning: 'The six guiding principles of Ekya Schools that shape teaching, learning, culture, and environment.' },
          { term: 'Habits of Heart', meaning: 'Dispositional values cultivated at Ekya: Respect, Grit, Empathy, Integrity, and Service.' },
          { term: 'Habits of Mind', meaning: 'Thinking capacities developed at Ekya: Think Creatively, Learn Continuously, Communicate Effectively, Reason Critically, Collaborate Productively.' },
          { term: 'Holistic Development', meaning: 'Development across all domains: cognitive, physical, social, emotional, and creative, not just academic learning.' },
          { term: 'Disposition', meaning: 'A consistent habit of thinking, feeling, or behaving, built over time through experience and modelling.' }
        ]
      },
      {
        title: 'QUICK TIP',
        type: 'tips',
        content: 'Read through the Six Pillars at the start of each term. Ask yourself: which pillar do I want to strengthen most this term? Make it a personal professional goal.'
      }
    ]
  },
  'learning-frameworks-domain': {
    id: 'learning-frameworks-domain',
    title: 'Learning Frameworks by Domain',
    subtitle: 'A clear overview of what is taught, why it matters, and how it is approached across all seven curriculum domains.',
    sections: [
      {
        title: 'WHAT THIS IS',
        type: 'text',
        content: 'The Ekya Early Years curriculum is built around seven learning domains. Each domain has a clear purpose, specific content, suggested teaching processes, and expected learning outcomes. The frameworks for the first five domains are aligned with international standards from Singapore, Australia, and Cambridge. Domains 6 and 7 flow from Ekya\'s own philosophy of Habits of Heart and Mind.'
      },
      {
        title: 'THE SEVEN CURRICULUM DOMAINS: AT A GLANCE',
        type: 'table',
        content: {
          headers: ['DOMAIN', 'PURPOSE', 'KEY CONTENT AREAS'],
          rows: [
            ['1. Literacy & Language', 'Attach meaning to language. Develop receptive and expressive language. Appreciate literature.', 'Fiction, poetry, non-fiction. Reading, retelling, writing. Phonics, vocabulary, grammar.'],
            ['2. Numeracy & Mathematics', 'Develop mathematical thinking and attitude. Engage in real-world mathematical challenges.', 'Number sense and operations. Spatial sense and geometry. Measurement and comparisons.'],
            ['3. Quest  Science & Social Science', 'Cultivate curiosity and inquiry. Develop awareness of the social, natural, and physical world.', 'Identity and social diversity. Natural world  plants, animals, phenomena. Inquiry and investigation.'],
            ['4. Arts  Visual & Performing', 'Express creatively. Explore cultures and art forms. Connect arts to other disciplines.', 'Visual arts  drawing, painting, printing, clay. Performing arts  movement, drama, puppetry, music.'],
            ['5. Physical Education', 'Develop physical, emotional, and social skills. Build lifelong health awareness.', 'Games and free play. Motor exercises. Nutrition, hygiene, and safety.'],
            ['6. Social-Emotional Development', 'Build self-awareness, healthy relationships, and responsible decision-making.', 'Habits of Heart: Respect, Grit, Empathy, Integrity, Service.'],
            ['7. Approaches to Learning', 'Develop thinking dispositions and learning habits that transfer across all domains.', 'Habits of Mind: Think Creatively, Learn Continuously, Communicate Effectively, Reason Critically, Collaborate Productively.']
          ]
        }
      },
      {
        title: 'DOMAIN 1  LITERACY & LANGUAGE',
        type: 'list',
        content: [
          { label: 'Process 1: Comprehension', text: 'Children predict, listen, observe, and discuss texts. They identify characters, events, and their own responses.' },
          { label: 'Process 2: Oral Expression', text: 'Children retell stories, recite rhymes, give information, and recount experiences using vocabulary from the text.' },
          { label: 'Process 3: Word Work', text: 'Children use Montessori materials to identify letters with sounds, decode words, construct sentences, and practise handwriting.' },
          { label: 'Process 4: Writing', text: 'Children write related to the text: labels, sentences, recounts, and simple stories, using learned vocabulary and grammar.' }
        ]
      },
      {
        title: 'DOMAIN 2  NUMERACY & MATHEMATICS',
        type: 'text',
        content: `Mathematics follows a Concrete-Pictorial-Abstract (CPA) approach, inspired by the Singapore method:
• Concrete: children explore mathematical concepts through physical materials and real objects.
• Pictorial: children represent mathematical ideas through drawings, diagrams, and pictures.
• Abstract: children use numerals, symbols, and equations to represent concepts.

Content areas: Number Sense and Operations | Spatial Sense and Geometry | Measurement and Comparisons.`
      },
      {
        title: 'DOMAIN 3  QUEST (SCIENCE & SOCIAL SCIENCE)',
        type: 'list',
        content: [
          { label: 'Social World', text: 'Self, family, school, neighbourhood, community, events, and festivals.' },
          { label: 'Natural World', text: 'Plants, animals, natural phenomena (sun, moon, rain), and materials (water, soil, air).' },
          { label: 'Teaching Process', text: 'Following two processes: investigation (explore, question, predict, collect information) and presentation (share findings through drawing, speaking, or role play).' }
        ]
      },
      {
        title: 'DOMAIN 4  ARTS (VISUAL & PERFORMING)',
        type: 'list',
        content: [
          { label: 'Visual Arts', text: 'Children observe, explore, and create using water colours, acrylic paints, oil pastels, crayons, clay, printing, and origami. Indian art forms (Madhubani, Warli, Rangoli) are also explored.' },
          { label: 'Performing Arts', text: 'Children explore their body as a medium. They act out stories, take on characters, use puppets, express emotions through movement, and collaborate on performances.' }
        ]
      },
      {
        title: 'DOMAIN 5  PHYSICAL EDUCATION',
        type: 'text',
        content: `Play is the work of the child. Physical Education at Ekya includes:
• Free and voluntary play: children choose their own play activities.
• Structured games with simple rules and equipment.
• Fine and gross motor development through targeted exercises.
• Nutrition, personal hygiene, and safety education woven into daily routines.`
      },
      {
        title: 'DOMAINS 6 & 7: SOCIAL-EMOTIONAL DEVELOPMENT & APPROACHES TO LEARNING',
        type: 'table',
        content: {
          headers: ['HABITS OF HEART', 'HABITS OF MIND'],
          rows: [
            ['Respect', 'Think Creatively'],
            ['Grit', 'Learn Continuously'],
            ['Empathy', 'Communicate Effectively'],
            ['Integrity', 'Reason Critically'],
            ['Service', 'Collaborate Productively']
          ]
        }
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Plan using the domain frameworks; they give direction and coherence' },
          { type: 'dont', text: 'Don\'t treat domains as completely separate silos: integration is key' },
          { type: 'do', text: 'Ensure all seven domains are addressed each week' },
          { type: 'dont', text: 'Don\'t skip Arts, PE, or Quest in favour of more literacy and numeracy time' },
          { type: 'do', text: 'Integrate domains wherever possible; a Quest topic can drive literacy, art, and math' },
          { type: 'dont', text: 'Don\'t assess only through worksheets: each domain needs authentic, observed assessment' },
          { type: 'do', text: 'Use the Concrete-Pictorial-Abstract approach consistently in mathematics' },
          { type: 'dont', text: 'Don\'t forget that SEL and Approaches to Learning are present in every moment' }
        ]
      },
      {
        title: 'GLOSSARY',
        type: 'glossary',
        content: [
          { term: 'Domain', meaning: 'A broad area of learning: e.g., Literacy, Numeracy, Arts, with its own purpose, content, and learning outcomes.' },
          { term: 'CPA Approach', meaning: 'Concrete-Pictorial-Abstract: a mathematics teaching sequence moving from hands-on materials to pictures to symbols.' },
          { term: 'Inquiry-Based Learning', meaning: 'A teaching approach where children investigate real questions and problems, constructing their own understanding.' },
          { term: 'Integrated Curriculum', meaning: 'Connecting learning across different domains so that content from one area enriches and deepens another.' },
          { term: 'Receptive Language', meaning: 'Understanding language that is heard or read  listening and reading comprehension.' },
          { term: 'Expressive Language', meaning: 'Producing language  speaking, retelling, writing, and communicating ideas to others.' }
        ]
      },
      {
        title: 'QUICK TIP',
        type: 'tips',
        content: 'When planning a week, lay out all seven domains on one page. If any are missing or imbalanced, adjust before you begin  not after.'
      }
    ]
  },
  'learner-profiles-grade': {
    id: 'learner-profiles-grade',
    title: 'Learner Profiles by Grade Level',
    subtitle: 'Knowing your children: who they are, where they are, and what they are ready for at each stage.',
    sections: [
      {
        title: 'WHAT THIS IS',
        type: 'text',
        content: 'The Learner Profile describes the typical developmental characteristics, learning behaviours, and readiness of children at each level in the Ekya Early Years program. It helps teachers plan appropriately, set realistic expectations, and communicate meaningfully with parents. Every child is unique; these profiles describe a range, not a ceiling or a fixed standard.'
      },
      {
        title: 'MONTESSORI PROGRAM: FOUR LEVELS',
        type: 'table',
        content: {
          headers: ['LEVEL', 'AGE', 'WHO THEY ARE'],
          rows: [
            ['Mont Beginners', '2.5 – 3 yrs', 'Discovering the classroom. Learning through sensory and hands-on activities. Growing independent in self-care. Exploring with curiosity through practical life and sensorial experiences. Parallel play is typical.'],
            ['Mont Sub-Juniors', '3 – 4 yrs', 'Building independence. Learning to communicate and collaborate with friends. Engaging in practical skills, sensorial play, and language. Beginning to solve simple problems and asking \'why?\''],
            ['Mont Juniors', '4 – 5 yrs', 'Ready for new challenges and more advanced activities. Developing self-reliance. Working in small groups, solving problems, growing in literacy, numeracy, and cultural understanding. Taking initiative.'],
            ['Mont Seniors', '5 – 6 yrs', 'Confident and ready for complex challenges. Working independently and as a leader. Exploring advanced activities, asking thoughtful questions, collaborating on projects, and preparing for primary schooling.']
          ]
        }
      },
      {
        title: 'KINDERGARTEN PROGRAM: TWO LEVELS',
        type: 'table',
        content: {
          headers: ['LEVEL', 'AGE', 'WHO THEY ARE'],
          rows: [
            ['Kindergarten 1 (K1)', '4 – 5 yrs', 'Learning to express themselves, work with others, and enjoy stories, art, and music. Exploring numbers and letters through play. Building friendship skills and trying simple experiments.'],
            ['Kindergarten 2 (K2)', '5 – 6 yrs', 'Curious and ready to learn about their world. Working on group projects, enjoying advanced literacy and numeracy, expressing themselves creatively, and preparing for primary school with confidence.']
          ]
        }
      },
      {
        title: 'DEVELOPMENTAL MILESTONES: WHAT TO WATCH FOR',
        type: 'milestones',
        content: {
          headers: ['DOMAIN', '2.5–3.5 yrs', '3.5–4.5 yrs', '4.5–5.5 yrs'],
          rows: [
            ['Language', 'Single words, gestures, mother tongue. Identifies characters.', 'Short phrases, high-frequency words. Retells simple stories.', 'Complete sentences. Retells with detail. Uses text vocabulary.'],
            ['Literacy', 'Identifies letters with pictures. Enjoys re-reading.', 'Constructs CVC words. Reads simple text using pictures.', 'Reads independently. Writes sentences. Uses punctuation.'],
            ['Numeracy', 'Counts 1–10. Compares more/less. Sorts objects.', 'Counts to 50. Adds sets up to 10. Identifies flat shapes.', 'Counts to 100. Adds and subtracts to 30. Tells time.'],
            ['Social-Emotional', 'Parallel play. Expresses basic needs. Follows simple norms.', 'Begins collaborative play. Shows empathy. Follows class routines.', 'Leads peers. Shows grit and integrity. Works in groups.'],
            ['Physical', 'Explores all materials. Basic gross motor movement.', 'Coordinates gross motor. Threading, stacking, buttoning with support.', 'Refined fine motor. Ties laces. Follows multi-step safety rules.']
          ]
        }
      },
      {
        title: 'HOW TO USE IN PRACTICE',
        type: 'checklist',
        content: [
          'Observe each child for 2–3 weeks before making assumptions about their level.',
          'Use the profile to plan differentiated activities that match where children actually are.',
          'Refer to the profile when communicating with parents to give a shared language.',
          'Celebrate growth: a move between profile behaviors is real progress.',
          'Remember: children move at different paces; different stages across domains is normal.'
        ]
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Observe children carefully before placing expectations on them' },
          { type: 'dont', text: 'Don\'t treat the profile as a rigid checklist every child must complete' },
          { type: 'do', text: 'Use profiles as a planning tool, not a judgement' },
          { type: 'dont', text: 'Don\'t compare children to each other; compare each child to themselves' },
          { type: 'do', text: 'Celebrate developmental progress in all domains, not just academics' }
        ]
      },
      {
        title: 'GLOSSARY',
        type: 'glossary',
        content: [
          { term: 'Learner Profile', meaning: 'A description of the typical developmental characteristics and learning behaviours of children at a given age and stage.' },
          { term: 'Developmental Milestone', meaning: 'A skill or behaviour that most children are expected to develop within a certain age range.' },
          { term: 'Parallel Play', meaning: 'Playing alongside other children without directly interacting: a typical stage for children aged 2-3.' },
          { term: 'Differentiation', meaning: 'Adjusting teaching to meet the diverse developmental needs of all learners in one classroom.' }
        ]
      },
      {
        title: 'QUICK TIP',
        type: 'tips',
        content: 'The profile is a compass, not a map. It tells you the direction  but each child charts their own course. Trust your observations over any checklist.'
      }
    ]
  },
  'scope-sequence-age': {
    id: 'scope-sequence-age',
    title: 'Scope & Sequence by Age Group',
    subtitle: 'What is taught, in what order, and at what depth, across all domains and all age groups.',
    sections: [
      {
        title: 'WHAT THIS IS',
        type: 'text',
        content: 'The Scope and Sequence outlines the breadth of content covered (scope) and the order in which it is introduced and built upon (sequence) across each age group. It ensures that learning is progressive: each year builds meaningfully on the one before, and that all children are exposed to age-appropriate content across all seven domains.'
      },
      {
        title: 'LITERACY & LANGUAGE: SCOPE & SEQUENCE',
        type: 'table',
        content: {
          headers: ['CONTENT AREA', 'SUB-JUNIORS (2.5–3.5)', 'JUNIORS / K1 (3.5–4.5)', 'SENIORS / K2 (4.5–5.5)'],
          rows: [
            ['Text Types', 'Fiction picture books. Simple rhymes.', 'Fiction, simple non-fiction. Level 1–2 readers.', 'Fiction, non-fiction, poetry. Level 3–4 readers.'],
            ['Speaking', 'Gestures, mother tongue, single words.', 'Short phrases, high-frequency words.', 'Complete sentences. Text vocabulary.'],
            ['Phonics', 'Alphabet names and sounds.', 'CVC and CCVC/CVCC words.', 'Consonant clusters. Long vowel phonemes.'],
            ['Reading', 'Letter–picture matching.', 'Simple text with picture support.', 'Decodes phonically regular words.'],
            ['Writing', 'Drawing and scribbling.', 'Traces and copies letters/words.', 'Writes words and sentences independently.']
          ]
        }
      },
      {
        title: 'NUMERACY & MATHEMATICS: SCOPE & SEQUENCE',
        type: 'table',
        content: {
          headers: ['CONTENT AREA', 'SUB-JUNIORS (2.5–3.5)', 'JUNIORS / K1 (3.5–4.5)', 'SENIORS / K2 (4.5–5.5)'],
          rows: [
            ['Numbers', '1–10: count, read, write.', '11–50: count, read, write.', '51–100: count, read, write. Place value.'],
            ['Operations', 'Compare sets (more/less).', 'Addition/Subtraction to 10.', 'Addition/Subtraction to 30. Number stories.'],
            ['Time', 'Morning, afternoon, evening.', 'Days of the week. Clock hands.', 'Months, seasons, full calendar.'],
            ['Money', 'Not introduced.', 'Identify coins: 50p, Rs 1, 2, 5, 10.', 'Read price tags. Select correct coins.']
          ]
        }
      },
      {
        title: 'QUEST: SCOPE & SEQUENCE',
        type: 'table',
        content: {
          headers: ['STRAND', 'SUB-JUNIORS (2.5–3.5)', 'JUNIORS / K1 (3.5–4.5)', 'SENIORS / K2 (4.5–5.5)'],
          rows: [
            ['Social World', 'Family and home address.', 'School spaces and routines.', 'Community members, city and localities.'],
            ['Natural World', 'Identify local plants and animals.', 'Categorise by features. Sow a seed.', 'Human–plant relationships. Life cycles.']
          ]
        }
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Use the scope and sequence as a planning reference each term' },
          { type: 'dont', text: 'Don\'t introduce advanced content before foundational skills are secure' },
          { type: 'do', text: 'Ensure content builds progressively; do not skip foundational steps' },
          { type: 'dont', text: 'Don\'t follow the sequence rigidly  use observation to guide pacing' }
        ]
      },
      {
        title: 'QUICK TIP',
        type: 'tips',
        content: 'Print the scope and sequence for your age group and keep it near your planning space. A quick scan at the start of each week keeps your teaching purposeful.'
      }
    ]
  },
  'levelled-reading-program': {
    id: 'levelled-reading-program',
    title: 'Levelled Reading Program: Love to Read',
    subtitle: 'Pairing every child with books that match their reading ability and igniting a lifelong love for reading.',
    sections: [
      {
        title: 'WHAT THIS IS',
        type: 'text',
        content: 'The Love to Read Program is Ekya Early Years\' structured, levelled reading initiative. It pairs each child with books matched to their current reading ability and gradually moves them toward greater complexity. The goal is not just reading skill: it is joy. Every child should leave our program believing \'I am a reader.\''
      },
      {
        title: 'THE FOUR READING LEVELS',
        type: 'table',
        content: {
          headers: ['LEVEL', 'NAME', 'WORD COUNT', 'CHARACTERISTICS'],
          rows: [
            ['Level 1', 'Beginning to Read', '0 – 100 words', 'Easy words, word repetition, short sentences, large pictures.'],
            ['Level 2', 'Learning to Read', '100 – 250 words', 'Stories with linear, engaging plots and simple concepts.'],
            ['Level 3', 'Reading Independently', '250 – 450 words', 'Longer sentences, relatable topics, developed characters.'],
            ['Level 4', 'Reading Proficiently', '450+ words', 'Complex plots, rich vocabulary, language play, varied formats.']
          ]
        }
      },
      {
        title: 'TYPICAL GRADE GROUPS',
        type: 'table',
        content: {
          headers: ['LEVEL', 'TYPICAL GRADE GROUP'],
          rows: [
            ['Level 1', 'Montessori Sub-Juniors'],
            ['Level 2', 'Mont Sub-Juniors, Mont Juniors, K1'],
            ['Level 3', 'Mont Juniors, K1, Mont Seniors, K2'],
            ['Level 4', 'Mont Seniors, K2']
          ]
        }
      },
      {
        title: 'THREE WAYS TO SUPPORT READING',
        type: 'list',
        content: [
          { label: 'Reading Aloud', text: 'Teacher reads expressively to children. Builds vocabulary and love for stories.' },
          { label: 'Guided Reading', text: 'Small groups at a similar level. Teacher observes and teaches strategies.' },
          { label: 'Independent Reading', text: 'Children choose and read books at their own level. Builds confidence and fluency.' }
        ]
      },
      {
        title: 'THE 7-ITEM READINESS CHECKLIST',
        type: 'checklist',
        content: [
          'Makes conversations on stories',
          'Reads text',
          'Re-reads text with meaning',
          'Retells stories',
          'Identifies letters with their sounds',
          'Writes words or sentences related to text',
          'Uses text-related grammar and vocabulary'
        ]
      },
      {
        title: 'QUICK TIP',
        type: 'tips',
        content: 'Take time; don\'t rush to move children between levels. A child who reads Level 2 with deep comprehension and joy, is far ahead of one racing through Level 4 without understanding.'
      }
    ]
  },
  'arrival-entry': {
    id: 'arrival-entry',
    title: 'Arrival & Entry Routine',
    subtitle: 'Setting up a calm, confident start to every child\'s day.',
    sections: [
      {
        title: 'WHAT THIS IS',
        type: 'text',
        content: 'The arrival routine helps children transition from home to school smoothly. When arrival steps are consistent and familiar, children feel safe, build independence, and are ready to learn.'
      },
      {
        title: 'STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'Welcome each child warmly at the gate. Make eye contact.',
          'Children remove their shoes and place them neatly in the shoe rack.',
          'Children complete registration (marking attendance independently).',
          'Each child collects their assigned mat from the shelf.',
          'Children place their school bag and tiffin in the designated area.',
          'Children settle into a morning activity (reading corner, Montessori material).'
        ]
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Greet every child individually; use their name' },
          { type: 'dont', text: 'Don\'t rush children through arrival steps' },
          { type: 'do', text: 'Keep the entrance area clear and organised' },
          { type: 'dont', text: 'Don\'t carry children\'s bags for them unless needed' }
        ]
      }
    ]
  },
  'circle-time-calendar': {
    id: 'circle-time-calendar',
    title: 'Circle Time & Calendar Time',
    subtitle: 'Building community, language, and mathematical thinking through daily shared experiences.',
    sections: [
      {
        title: 'WHAT THIS IS',
        type: 'text',
        content: 'Circle Time is a daily whole-group gathering where children connect, converse, and learn together. Calendar Time makes concepts like days, months, and seasons concrete.'
      },
      {
        title: 'CIRCLE TIME: STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'Begin with a warm greeting.',
          '\'Good Things\': invite 2–3 children to share something positive.',
          'Affirmations: encourage children to affirm a peer.',
          'Main focus: story, language game, Math activity, or Quest discussion.',
          'Close with a mindful moment.'
        ]
      },
      {
        title: 'CALENDAR TIME  STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'Show the real calendar. Ask: \'What day is today?\'',
          'Count the days in the current month together.',
          'Ask event-linked questions (birthdays, festivals).',
          'Invite a child to mark today\'s date on the calendar.',
          'Discuss the weather or season.'
        ]
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Use a real calendar  it makes learning concrete' },
          { type: 'dont', text: 'Don\'t let circle time run longer than 20–25 minutes' },
          { type: 'do', text: 'Keep the tone warm, fun, and conversational' },
          { type: 'dont', text: 'Don\'t dominate  children should do most of the talking' }
        ]
      }
    ]
  },
  'rhyme-time': {
    id: 'rhyme-time',
    title: 'Rhyme Time',
    subtitle: 'Building language, rhythm, and joy through songs, chants, and action rhymes.',
    sections: [
      {
        title: 'WHY RHYME TIME MATTERS',
        type: 'list',
        content: [
          { label: 'Phonemic Awareness', text: 'Children hear and play with sounds in words.' },
          { label: 'Vocabulary', text: 'Builds vocabulary through repetition and context.' },
          { label: 'Memory', text: 'Strengthens memory and recall.' },
          { label: 'Coordination', text: 'Encourages movement and body coordination.' }
        ]
      },
      {
        title: 'STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'Choose 2–3 rhymes. Mix a familiar one with a new one.',
          'Introduce the new rhyme slowly with gestures.',
          'Say the rhyme together  clap, stamp, or move.',
          'Invite children to perform individually or in small groups.',
          'Revisit familiar rhymes often.'
        ]
      },
      {
        title: 'DO\'S AND DON\'TS',
        type: 'dos_donts',
        content: [
          { type: 'do', text: 'Use expressive voice, gestures, and facial expressions' },
          { type: 'dont', text: 'Don\'t rush through rhymes  enjoy the rhythm' },
          { type: 'do', text: 'Repeat rhymes over days to build confidence' },
          { type: 'dont', text: 'Don\'t skip Rhyme Time  even 5 minutes makes a difference' }
        ]
      }
    ]
  },
  'storytelling-puppetry': {
    id: 'storytelling-puppetry',
    title: 'Storytelling & Puppetry',
    subtitle: 'Developing language, imagination, and empathy through the power of story.',
    sections: [
      {
        title: 'STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'PREPARE: Choose an age-appropriate story and gather puppets.',
          'SET THE SPACE: Seat children in a semi-circle on mats.',
          'INTRODUCE: Begin with a hook question and prediction.',
          'TELL THE STORY: Narrate with expressive voice and varied tone.',
          'INVOLVE CHILDREN: Repeat refrains and use \'turn and talk\'.',
          'CLOSE: Reflect and let children help puppets \'say goodbye\'.'
        ]
      },
      {
        title: 'PUPPETRY TIPS',
        type: 'list',
        content: [
          { label: 'Independent Exploration', text: 'Keep a puppet basket in the reading nook.' },
          { label: 'Rotation', text: 'Rotate puppets regularly to maintain curiosity.' },
          { label: 'Creation', text: 'Allow children to create their own puppets in Visual Arts.' },
          { label: 'Support', text: 'Use puppets to help shy children find their voice.' }
        ]
      }
    ]
  },
  'montessori-learning-block': {
    id: 'montessori-learning-block',
    title: 'Montessori & Learning Block Routine',
    subtitle: 'Fostering independence, concentration, and self-directed learning through hands-on exploration.',
    sections: [
      {
        title: 'STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'PREPARE materials suited to developmental stages.',
          'SET THE SPACE in clearly defined zones (Practical Life, Sensorial, etc.).',
          'INTRODUCE briefly to outline available materials.',
          'INVITE children to choose purposefully.',
          'WORK PERIOD  Independent or paired work. Observe and note.',
          'CLOSE with reflection and tidy-up song.'
        ]
      },
      {
        title: 'THE TEACHER\'S ROLE',
        type: 'list',
        content: [
          { label: 'Presence', text: 'Move quietly around the room; avoid disrupting focused work.' },
          { label: 'Instruction', text: 'Offer a lesson to one child at a time when they are ready.' },
          { label: 'Feedback', text: 'Use descriptive feedback (\'You placed cubes carefully\') instead of praise.' }
        ]
      },
      {
        title: 'QUICK TIP',
        type: 'tips',
        content: 'A 45–60 minute uninterrupted work period is ideal. Protect this time: it is when the deepest learning happens.'
      }
    ]
  },
  'transitions-attention-signals': {
    id: 'transitions-attention-signals',
    title: 'Transitions & Attention Signals',
    subtitle: 'Moving between activities smoothly, calmly, and with purpose.',
    sections: [
      {
        title: 'COMMON ATTENTION SIGNALS',
        type: 'list',
        content: [
          { label: 'Give Me Five', text: 'Children raise hand with five fingers.' },
          { label: 'Clap Pattern', text: 'Teacher claps a rhythm; children repeat and freeze.' },
          { label: 'Countdown', text: '\'5, 4, 3, 2, 1: eyes on me!\'' },
          { label: 'Wind-Up Song', text: 'A consistent song that signals the end of a session.' }
        ]
      },
      {
        title: 'STEPS FOR A SMOOTH TRANSITION',
        type: 'checklist',
        content: [
          'Give a WARNING (\'2 more minutes\').',
          'Use an ATTENTION SIGNAL.',
          'GIVE CLEAR INSTRUCTIONS on what to do next.',
          'USE A LINING-UP STRATEGY (mystery walker, ninja stealth).',
          'MOVE leading children calmly.',
          'SETTLE with a short activity before beginning.'
        ]
      }
    ]
  },
  'washroom-hygiene': {
    id: 'washroom-hygiene',
    title: 'Washroom Hygiene Routine',
    subtitle: 'Building healthy hygiene habits and safe, independent washroom use.',
    sections: [
      {
        title: 'STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'Child signals need for washroom.',
          'Child changes into washroom chappals.',
          'Child uses washroom independently (staff nearby for safety).',
          'Child washes hands thoroughly with soap (20 seconds).',
          'Child dries hands properly.',
          'Child returns chappals to their place.'
        ]
      },
      {
        title: 'HANDWASHING STEPS',
        type: 'checklist',
        content: [
          'Wet hands with clean water.',
          'Apply soap and lather  rub for 20 seconds.',
          'Clean between fingers, back of hands, and under nails.',
          'Rinse thoroughly.',
          'Dry with a tissue or clean towel.'
        ]
      }
    ]
  },
  'snack-lunch-dispersal': {
    id: 'snack-lunch-dispersal',
    title: 'Snack, Lunch & Dispersal Routine',
    subtitle: 'Building healthy habits, social skills, and independence around mealtimes and home time.',
    sections: [
      {
        title: 'SNACK & LUNCH TIME',
        type: 'checklist',
        content: [
          'Signal time with attention signal and wind-up song.',
          'Children wash hands and collect tiffin boxes.',
          'Teachers model healthy eating by sitting alongside children.',
          'Model table manners (sitting properly, chewing with mouth closed).',
          'After eating, children tidy their space and pack their boxes.'
        ]
      },
      {
        title: 'DISPERSAL  STEPS TO FOLLOW',
        type: 'checklist',
        content: [
          'Give a 5-minute warning.',
          'Children pack bags (tiffin, water, notebooks).',
          'Children tidy their area (push in chairs, collect belongings).',
          'Gather for a brief closing circle.',
          'Children line up quietly.',
          'Hand child to designated adult (verify identity).'
        ]
      }
    ]
  },
  'timetables-period-matrix': {
    id: 'timetables-period-matrix',
    title: 'Timetables & Period Matrix',
    subtitle: 'Understanding how the Ekya Early Years day is structured across all programs.',
    sections: [
      {
        title: 'PERIOD MATRIX: PERIODS PER WEEK',
        type: 'table',
        content: {
          headers: ['LEARNING AREA', 'K1/K2 (Half)', 'Mont JR/SR (Full)', 'Mont Sub-Jr (Half)'],
          rows: [
            ['Early Literacy', '5', '5', '4'],
            ['Reading', '2', '2', ''],
            ['Numeracy', '5', '5', ''],
            ['Quest', '', '3', ''],
            ['Material Time', '', '9', '9'],
            ['Atelier', '2', '1', '1'],
            ['Outdoor Play', '2', '2', '2'],
            ['Visual Art', '2', '2', '2'],
            ['Performing Art', '2', '2', '2']
          ]
        }
      },
      {
        title: 'SAMPLE BELL SCHEDULE',
        type: 'table',
        content: {
          headers: ['TIME', 'ACTIVITY'],
          rows: [
            ['8:10 – 8:20', 'Circle Time (10 min)'],
            ['8:20 – 9:10', 'Period 1 (50 min)'],
            ['10:00 – 10:15', 'Short Break'],
            ['1:15 – 2:05', 'Period 6  Mont only'],
            ['3:00', 'Dispersal']
          ]
        }
      }
    ]
  },
  'montessori-material-guides': {
    id: 'montessori-material-guides',
    title: 'Montessori Material Guides',
    subtitle: 'Understanding the purpose and use of key Montessori materials across classroom areas.',
    sections: [
      {
        title: 'CORE PRINCIPLES',
        type: 'list',
        content: [
          { label: 'Concrete to Abstract', text: 'Moving from hands-on to symbolic understanding.' },
          { label: 'Self-Correcting', text: 'Designed so the child can fix their own errors.' },
          { label: 'Sequential', text: 'Introduced in a carefully planned order.' }
        ]
      },
      {
        title: 'PRACTICAL LIFE MATERIALS',
        type: 'table',
        content: {
          headers: ['MATERIAL', 'PURPOSE'],
          rows: [
            ['Pouring Trays', 'Builds concentration and coordination.'],
            ['Buttoning Frames', 'Builds independence in dressing.'],
            ['Sweeping Set', 'Care of environment and gross motor control.']
          ]
        }
      },
      {
        title: 'SENSORIAL MATERIALS',
        type: 'table',
        content: {
          headers: ['MATERIAL', 'PURPOSE'],
          rows: [
            ['Pink Tower', 'Visual discrimination of size.'],
            ['Knobless Cylinders', 'Comparison and ordering skills.'],
            ['Sound Cylinders', 'Auditory discrimination.']
          ]
        }
      }
    ]
  },
  'atelier-hub-guides': {
    id: 'atelier-hub-guides',
    title: 'Atelier Hub Guides',
    subtitle: 'How to set up, run, and extend learning across the five Atelier hubs.',
    sections: [
      {
        title: 'THE FIVE HUBS',
        type: 'list',
        content: [
          { label: 'Narrative Hub', text: 'Storytelling, imagination, and puppets.' },
          { label: 'Numeracy Hub', text: 'Math thinking through creative exploration.' },
          { label: 'Multiplicity Hub', text: 'Expressing one idea in many ways.' },
          { label: 'Discovery Hub', text: 'Inquiry, observation, and science.' },
          { label: 'Nature Hub', text: 'Connecting with environment and sustainability.' }
        ]
      },
      {
        title: 'RUNNING THE ATELIER',
        type: 'checklist',
        content: [
          'Set up hub with intentional materials before children arrive.',
          'Introduce briefly: name materials and invite exploration.',
          'Step back and observe. Engage only when invited.',
          'Document the session through photos.',
          'Gather for reflection circle at the end.',
          'Display the process on the hub display space.'
        ]
      }
    ]
  },
  'outdoor-learning': {
    id: 'outdoor-learning',
    title: 'Outdoor Learning',
    subtitle: 'Taking curriculum beyond the classroom walls, into the open air and natural world.',
    sections: [
      {
        title: 'WHY IT MATTERS',
        type: 'list',
        content: [
          { label: 'Physical Health', text: 'Supports coordination and stamina.' },
          { label: 'Scientific Inquiry', text: 'Authentic contexts for discovery.' },
          { label: 'Emotional Well-being', text: 'Reduces stress and improves focus.' },
          { label: 'Social Interaction', text: 'Natural and spontaneous social play.' }
        ]
      },
      {
        title: 'PLANNING A SESSION',
        type: 'checklist',
        content: [
          'DECIDE THE PURPOSE: Link to classroom topic.',
          'PREPARE THE SPACE: Check area is safe and set up materials.',
          'BRIEF THE CHILDREN: Outline expectations before going out.',
          'EXPLORE: Observe and ask open questions.',
          'DOCUMENT: Take photographs and note discoveries.',
          'REFLECT: Share findings back in the classroom.'
        ]
      }
    ]
  },
  'differentiation-modifications': {
    id: 'differentiation-modifications',
    title: 'Differentiation & Modifications',
    subtitle: 'Meeting every child where they are: adjusting teaching to support different abilities.',
    sections: [
      {
        title: 'PRACTICAL STRATEGIES',
        type: 'list',
        content: [
          { label: 'Same Task, Different Level', text: 'Calibrate materials to the child\'s level (e.g. 2-color vs 4-color patterns).' },
          { label: 'Flexible Grouping', text: 'Group by ability for targeted teaching; mix ages for collaboration.' },
          { label: 'Open-Ended Tasks', text: 'Activities with no single right answer allow natural engagement levels.' },
          { label: 'Scaffolding', text: 'Provide temporary support (visual prompts) and remove as confidence grows.' },
          { label: 'Extension', text: 'Add complexity for mastered concepts (more choices, abstract representation).' }
        ]
      },
      {
        title: 'MODIFYING THE ENVIRONMENT',
        type: 'checklist',
        content: [
          'Place simpler materials at lower shelf levels.',
          'Use picture-based labels alongside text.',
          'Provide writing tools of varying thickness.',
          'Offer structured materials for younger children, open-ended for older.'
        ]
      }
    ]
  },
  'performance-assessment-guidelines': {
    id: 'performance-assessment-guidelines',
    title: 'Performance-Based Assessment Guidelines',
    subtitle: 'Assessing what children can actually do: through real tasks, not tests.',
    sections: [
      {
        title: 'PRINCIPLES',
        type: 'list',
        content: [
          { label: 'Authentic Tasks', text: 'Assessing through doing: building, retelling, counting.' },
          { label: 'Continuous', text: 'Happening throughout the day, not just end of term.' },
          { label: 'Informative', text: 'Results should shape what is taught next.' }
        ]
      },
      {
        title: 'THE THREE-LEVEL RUBRIC',
        type: 'table',
        content: {
          headers: ['LEVEL', 'MEANING'],
          rows: [
            ['Fully Meeting (FME)', 'Demonstrates skill consistently and independently.'],
            ['Beginning to Meet (BME)', 'Shows emerging understanding; needs some support.'],
            ['Yet to Begin (YBE)', 'Not yet demonstrated; needs revisit or re-teach.']
          ]
        }
      },
      {
        title: 'DESIGNING A TASK',
        type: 'checklist',
        content: [
          'IDENTIFY the specific learning outcome.',
          'CHOOSE an authentic task (e.g. \'Build a tower and count\').',
          'SET UP materials and space.',
          'OBSERVE and note using specific, factual language.',
          'RECORD findings using the rubric.',
          'USE evidence to adjust planning.'
        ]
      }
    ]
  },
  'observation-anecdote-tools': {
    id: 'observation-anecdote-tools',
    title: 'Observation & Anecdote-Keeping Tools',
    subtitle: 'Seeing children clearly, and recording what you see to drive better teaching.',
    sections: [
      {
        title: 'HOW TO WRITE AN ANECDOTE',
        type: 'checklist',
        content: [
          'NOTE the date, child\'s name, and context.',
          'DESCRIBE what happened factually; no interpretation yet.',
          'INCLUDE a direct quote from the child.',
          'NOTE the domain/learning area.',
          'ADD an interpretation for next steps.'
        ]
      },
      {
        title: 'PRACTICAL TIPS',
        type: 'list',
        content: [
          { label: 'Accessibility', text: 'Keep sticky notes or a phone accessible during work time.' },
          { label: 'Frequency', text: 'Aim for 2–3 anecdotes per child per week.' },
          { label: 'Rotation', text: 'Focus on different domains each day (e.g. Mon: Literacy, Tue: Numeracy).' },
          { label: 'Multimedia', text: 'Include photographs alongside written anecdotes.' }
        ]
      }
    ]
  },
  'progress-cards-reporting': {
    id: 'progress-cards-reporting',
    title: 'Progress Cards & Reporting',
    subtitle: 'Communicating a child\'s growth honestly, warmly, and meaningfully.',
    sections: [
      {
        title: 'REPORTING RUBRIC',
        type: 'table',
        content: {
          headers: ['LEVEL', 'WHAT IT MEANS'],
          rows: [
            ['FME', 'Consistently and independently meeting expected level.'],
            ['BME', 'Showing early signs; actively working towards it.'],
            ['YBE', 'Not yet demonstrated; needs more time or different approach.']
          ]
        }
      },
      {
        title: 'STEPS TO COMPLETE',
        type: 'checklist',
        content: [
          'GATHER evidence systematically across the term.',
          'REVIEW observations and work samples (don\'t rely on memory).',
          'APPLY the rubric honestly based on consistent evidence.',
          'WRITE specific, strength-based comments.',
          'REVIEW with leadership for calibration.',
          'ISSUE and discuss during the PTM.'
        ]
      }
    ]
  },
  'parent-communication-resources': {
    id: 'parent-communication-resources',
    title: 'Parent Communication Resources',
    subtitle: 'Building strong, trusting partnerships with families.',
    sections: [
      {
        title: 'PRINCIPLES',
        type: 'list',
        content: [
          { label: 'Warm & Specific', text: 'Parents respond to detail, not generalities.' },
          { label: 'Lead with Strengths', text: 'Always begin with what a child is doing well.' },
          { label: 'Proactive', text: 'Don\'t wait for problems to grow before contacting parents.' }
        ]
      },
      {
        title: 'TYPES OF COMMUNICATION',
        type: 'table',
        content: {
          headers: ['TYPE', 'PURPOSE'],
          rows: [
            ['Daily Check-In', 'Share one specific positive moment at dispersal.'],
            ['Sunshine Notes', 'Celebrate a specific milestone sent home.'],
            ['Parent Workshops', 'Help parents understand curriculum and routines.'],
            ['PTM', 'Formal discussion of the progress card with evidence.']
          ]
        }
      }
    ]
  },
  'sops': {
    id: 'sops',
    title: 'SOPs - Standard Operating Procedures',
    subtitle: 'Clear, consistent procedures that ensure every child is safe and supported.',
    sections: [
      {
        title: 'WHY THEY MATTER',
        type: 'list',
        content: [
          { label: 'Consistency', text: 'Every child has the same quality of experience.' },
          { label: 'New Teachers', text: 'Reduces uncertainty and builds confidence quickly.' },
          { label: 'Safety', text: 'Critical for transitions, outdoor spaces, and handover.' }
        ]
      },
      {
        title: 'KEY SOPS SUMMARY',
        type: 'table',
        content: {
          headers: ['AREA', 'KEY STEPS'],
          rows: [
            ['Reading Program', 'Assess, assign level, guided reading, record progress.'],
            ['Arrival & Entry', 'Greet, shoe rack, registration, settle into morning activity.'],
            ['Dispersal', '5-min warning, pack, closing circle, hand to designated adult.'],
            ['Washroom', 'Chappals, handwashing, staff supervision.']
          ]
        }
      }
    ]
  },
  'pedagogical-approaches': {
    id: 'pedagogical-approaches',
    title: 'Pedagogical Approaches',
    subtitle: 'The educational philosophies that shape how we teach and see children.',
    sections: [
      {
        title: 'MONTESSORI VS REGGIO EMILIA',
        type: 'table',
        content: {
          headers: ['FEATURE', 'MONTESSORI', 'REGGIO EMILIA'],
          rows: [
            ['Role of Teacher', 'Guide and observer. Steps back.', 'Facilitator, researcher, co-learner.'],
            ['Environment', 'Prepared and ordered materials.', 'The third teacher: aesthetically rich.'],
            ['Curriculum', 'Structured sequence across five areas.', 'Emergent  long-term projects.'],
            ['Materials', 'Specific, purposeful, self-correcting.', 'Open-ended, natural, loose parts.']
          ]
        }
      },
      {
        title: 'CORE MONTESSORI PRINCIPLES',
        type: 'list',
        content: [
          { label: 'Absorbent Mind', text: 'Critical window (0-6) where children absorb info effortlessly.' },
          { label: 'Sensitive Periods', text: 'Windows of heightened sensitivity to types of learning.' },
          { label: 'Prepared Environment', text: 'Order, beauty, and independence built into the classroom.' }
        ]
      }
    ]
  },
  'phonics-program': {
    id: 'phonics-program',
    title: 'Phonics Program',
    subtitle: 'Systematic sound-based learning for early readers.',
    sections: [
      {
        title: 'CURATING CONTENT',
        type: 'tips',
        content: 'We are currently curating the detailed Phonics Program resources. Stay tuned!'
      }
    ]
  },
  'handwriting-program': {
    id: 'handwriting-program',
    title: 'Handwriting Program',
    subtitle: 'Developing fine motor skills and letter formation.',
    sections: [
      {
        title: 'CURATING CONTENT',
        type: 'tips',
        content: 'We are currently curating the detailed Handwriting Program resources. Stay tuned!'
      }
    ]
  },
  'making-learning-visible-documentation': {
    id: 'making-learning-visible-documentation',
    title: 'Making Learning Visible & Documentation',
    subtitle: 'Techniques for capturing and sharing the learning journey.',
    sections: [
      {
        title: 'CURATING CONTENT',
        type: 'tips',
        content: 'We are currently curating the detailed Documentation resources. Stay tuned!'
      }
    ]
  }
};

