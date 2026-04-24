import { Request, Response } from 'express';

// Mock Data
const MOCK_CAMPUSES = [
  { id: 'CAMPUS_001', name: 'Ekya ITPL' },
  { id: 'CAMPUS_002', name: 'Ekya BTM Layout' },
  { id: 'CAMPUS_003', name: 'Ekya JP Nagar' },
  { id: 'CAMPUS_004', name: 'Ekya Byrathi' },
  { id: 'CAMPUS_005', name: 'Ekya Nice Road' },
  { id: 'CAMPUS_006', name: 'CMR NPS' }
];

const MOCK_SUBJECTS = [
  { id: 'SUB_001', name: 'Mathematics' },
  { id: 'SUB_002', name: 'Science' },
  { id: 'SUB_003', name: 'English' },
  { id: 'SUB_004', name: 'Social Studies' },
  { id: 'SUB_005', name: 'ICT' }
];

const MOCK_TASKS = [
  { 
    id: 'TASK_001', 
    subjectId: 'SUB_001', 
    unit: 'Unit 1: Algebra', 
    task: 'Lesson Plan Submission', 
    type: 'Admin', 
    mode: 'Weekly', 
    week: 1, 
    weekCheck: true,
    subject: { id: 'SUB_001', name: 'Mathematics' },
    statuses: []
  },
  { 
    id: 'TASK_002', 
    subjectId: 'SUB_001', 
    unit: 'Unit 1: Algebra', 
    task: 'Assessment Design', 
    type: 'Academic', 
    mode: 'Weekly', 
    week: 2, 
    weekCheck: true,
    subject: { id: 'SUB_001', name: 'Mathematics' },
    statuses: []
  }
];

const MOCK_TEACHERS = [
  { 
    teacherId: 'T_001', 
    name: 'Sarah Connor', 
    subject: 'Mathematics', 
    campus: 'Ekya ITPL', 
    campusId: 'CAMPUS_001',
    completedTasks: 5, 
    inProgressTasks: 2, 
    totalTasks: 10, 
    completionPercentage: 50 
  },
  { 
    teacherId: 'T_002', 
    name: 'John Doe', 
    subject: 'Science', 
    campus: 'Ekya BTM Layout', 
    campusId: 'CAMPUS_002',
    completedTasks: 8, 
    inProgressTasks: 1, 
    totalTasks: 10, 
    completionPercentage: 80 
  }
];

export const getTasks = async (req: Request, res: Response) => {
  try {
    res.json({ status: 'success', data: MOCK_TASKS });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    // Return empty for now or mock data
    res.json({ status: 'success', data: [] });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getCampuses = async (req: Request, res: Response) => {
  try {
    res.json({ status: 'success', data: MOCK_CAMPUSES });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.query;
    let teachers = MOCK_TEACHERS;
    if (campusId && campusId !== 'All') {
      teachers = MOCK_TEACHERS.filter(t => t.campusId === campusId);
    }
    res.json({ status: 'success', data: teachers });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    res.json({ status: 'success', data: MOCK_SUBJECTS });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    res.json({ 
      status: 'success', 
      data: {
        totalTasks: 20,
        statusCounts: [
          { status: 'Complete', _count: 10 },
          { status: 'In Progress', _count: 5 },
          { status: 'Pending', _count: 5 }
        ],
        gradedTasks: 8,
        teacherCount: 15,
        subjectBreakdown: [
          { subjectId: 'SUB_001', subjectName: 'Mathematics', teacherName: 'Sarah Connor', percentage: 75, completedTasks: 6, totalTasks: 8 },
          { subjectId: 'SUB_002', subjectName: 'Science', teacherName: 'John Doe', percentage: 90, completedTasks: 9, totalTasks: 10 }
        ],
        campusBreakdown: [
          { campusId: 'CAMPUS_001', campusName: 'Ekya ITPL', teacherCount: 5, percentage: 65, completedTasks: 32, totalTasks: 50 },
          { campusId: 'CAMPUS_002', campusName: 'Ekya BTM Layout', teacherCount: 4, percentage: 82, completedTasks: 41, totalTasks: 50 }
        ]
      } 
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  try {
    res.json({ status: 'success', message: 'Task assigned successfully (Mock)' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    res.json({ status: 'success', message: 'Task status updated (Mock)' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
