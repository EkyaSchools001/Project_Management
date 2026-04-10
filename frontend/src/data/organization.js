export const DEPARTMENTS = [
  {
    id: 'hr',
    name: 'Human Resource',
    head: 'Poornima',
    resources: [],
    type: 'core'
  },

  {
    id: 'ops',
    name: 'Operations',
    head: 'Ketan',
    resources: [],
    type: 'core'
  },
  {
    id: 'pd',
    name: 'Teacher Development',
    head: 'Sharada',
    resources: [],
    type: 'core'
  },
  {
    id: 'tech',
    name: 'Technology',
    head: 'Indu',
    resources: ['Bharat'],
    type: 'core'
  },
  {
    id: 'elc',
    name: 'Ekya Learning Centre',
    head: 'Sharada',
    resources: [],
    type: 'core'
  },
  {
    id: 'sd',
    name: 'Student Development',
    head: 'Chinmay',
    resources: ['Shobha'],
    type: 'core'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    children: [
      { id: 'admissions', name: 'Admissions', head: 'Rajeev', resources: ['Suyash'] },
      { id: 'brand', name: 'Brand Growth', head: 'TBD' }
    ],
    type: 'core'
  },
  {
    id: 'qa',
    name: 'Quality Assurance',
    head: 'Suja',
    type: 'core'
  },
  {
    id: 'finance',
    name: 'Finance & Accounts',
    head: 'Lavanya',
    type: 'core'
  },
  {
    id: 'strategy',
    name: 'Strategic & Innovation',
    head: 'Angad',
    type: 'core'
  },
  {
    id: 'wellbeing',
    name: 'Well Being',
    head: 'Natalia',
    type: 'core'
  }
];

export const SCHOOLS = {
  progressive: [
    { id: 'btm-p', name: 'BTM Layout' },
    { id: 'jp-p', name: 'JP Nagar' },
    { id: 'itpl-p', name: 'ITPL' },
    { id: 'byrathi-p', name: 'Byrathi' },
    { id: 'koppa', name: 'Koppa Gubbi' }
  ],
  icse_cbse: [
    { id: 'btm-i', name: 'BTM Layout' },
    { id: 'jp-i', name: 'JP Nagar' },
    { id: 'itpl-i', name: 'ITPL' },
    { id: 'byrathi-i', name: 'Byrathi' },
    { id: 'nice', name: 'Nice Road' },
    { id: 'world', name: 'World School' },
    { id: 'l1', name: 'L1' }
  ],
  purpose_based: [
    { id: 'kala', name: 'Kala — Kasturi Nagar' },
    { id: 'nava', name: 'Nava' }
  ]
};

export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  MANAGEMENT_ADMIN: 'ManagementAdmin',
  ADMIN: 'Admin',
  TEACHER_STAFF: 'TeacherStaff',
  GUEST: 'Guest'
};
