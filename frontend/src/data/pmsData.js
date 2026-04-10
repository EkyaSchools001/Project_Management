export const MOCK_PROJECTS = [
    {
        id: '1',
        name: 'Curriculum Revamp 2026',
        description: 'Updating the science and math curriculum to align with new standards.',
        status: 'IN_PROGRESS',
        startDate: '2025-10-01',
        endDate: '2026-03-31',
        budget: 500000,
        manager: { name: 'Avni', role: 'Head of PD' }
    },
    {
        id: '2',
        name: 'Digital Lab Infrastructure',
        description: 'Implementing high-speed internet and new workstations in lab A.',
        status: 'COMPLETED',
        startDate: '2025-06-01',
        endDate: '2025-08-30',
        budget: 1200000,
        manager: { name: 'Indu', role: 'Head of Tech' }
    },
    {
        id: '3',
        name: 'Pedagogy Workshop Series',
        description: 'Monthly training sessions for teachers on active learning strategies.',
        status: 'IN_PROGRESS',
        startDate: '2026-01-01',
        endDate: '2026-06-30',
        budget: 250000,
        manager: { name: 'Sharada', role: 'Head of PD' }
    },
    {
        id: '4',
        name: 'Leadership Training Hub',
        description: 'Developing leadership skills for heads of departments and principals.',
        status: 'PLANNED',
        startDate: '2026-04-01',
        endDate: '2026-09-30',
        budget: 400000,
        manager: { name: 'Avni', role: 'Head of PD' }
    }
];

export const MOCK_TASKS = [
    {
        id: '1',
        title: 'Draft Science Syllabus',
        priority: 'High',
        status: 'Done',
        dueDate: '2026-02-15'
    },
    {
        id: '2',
        title: 'Vendor Selection for Workstations',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: '2026-02-28'
    }
];

export const MOCK_CHATS = [
    {
        id: 'chat1',
        type: 'PRIVATE',
        participants: [
            { user: { id: '1', name: 'Test User', role: 'Admin' } },
            { user: { id: 'user2', name: 'Indu', role: 'Head of Tech' } }
        ],
        messages: [
            { id: 'm1', content: 'Hey Indu, how is the digital lab progress?', senderId: '1', sender: { id: '1', name: 'Test User' }, createdAt: new Date().toISOString() }
        ],
        unreadCount: 0
    },
    {
        id: 'chat2',
        type: 'GROUP',
        name: 'Tech Department Hub',
        participants: [
            { user: { id: '1', name: 'Test User', role: 'Admin' } },
            { user: { id: 'user2', name: 'Indu', role: 'Head of Tech' } },
            { user: { id: 'user3', name: 'Rahul', role: 'Developer' } }
        ],
        messages: [
            { id: 'm2', content: 'Morning team! Let\'s sync on the revamp.', senderId: 'user2', sender: { id: 'user2', name: 'Indu' }, createdAt: new Date().toISOString() }
        ],
        unreadCount: 2
    }
];

export const MOCK_MESSAGES = {
    'chat1': [
        { id: 'm1', content: 'Hey Indu, how is the digital lab progress?', senderId: '1', sender: { id: '1', name: 'Test User' }, createdAt: new Date().toISOString() },
        { id: 'm3', content: 'Going well! We just finished the wiring.', senderId: 'user2', sender: { id: 'user2', name: 'Indu' }, createdAt: new Date().toISOString() }
    ],
    'chat2': [
        { id: 'm2', content: 'Morning team! Let\'s sync on the revamp.', senderId: 'user2', sender: { id: 'user2', name: 'Indu' }, createdAt: new Date().toISOString() }
    ]
};
