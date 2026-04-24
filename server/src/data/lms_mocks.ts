export const MOCK_COURSES = [
  {
    id: 'c-1',
    title: 'Advanced React Patterns',
    description: 'Master higher-order components, render props, and hooks for scalable React applications.',
    instructorId: 'u-sa-1',
    instructor: { id: 'u-sa-1', name: 'Super Admin' },
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    duration: 120,
    status: 'Published',
    category: 'Technology',
    createdAt: new Date().toISOString(),
    _count: { enrollments: 45, lessons: 10 }
  },
  {
    id: 'c-2',
    title: 'Effective Classroom Management',
    description: 'Strategies for creating a positive and productive learning environment for all students.',
    instructorId: 'u-adm-2',
    instructor: { id: 'u-adm-2', name: 'PD Manager' },
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    duration: 90,
    status: 'Published',
    category: 'Pedagogy',
    createdAt: new Date().toISOString(),
    _count: { enrollments: 120, lessons: 8 }
  },
  {
    id: 'c-3',
    title: 'Data-Driven Instruction',
    description: 'Learn how to use student data to inform your teaching and improve student outcomes.',
    instructorId: 'u-dir-2',
    instructor: { id: 'u-dir-2', name: 'Academics Director' },
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bb8c803er94c?w=800',
    duration: 150,
    status: 'Published',
    category: 'Academics',
    createdAt: new Date().toISOString(),
    _count: { enrollments: 78, lessons: 12 }
  }
];

export const MOCK_CATEGORIES = ['Technology', 'Pedagogy', 'Academics', 'Leadership', 'Wellbeing'];

export const MOCK_LEARNING_PATHS = [
  {
    id: 'lp-1',
    title: 'New Teacher Induction',
    description: 'Essential courses for every new teacher at Ekya Schools.',
    courses: ['c-2', 'c-3'],
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    _count: { enrollments: 25 }
  }
];
