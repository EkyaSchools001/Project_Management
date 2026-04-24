export interface Goal {
    id: string;
    title: string;
    description: string;
    status: 'IN_PROGRESS' | 'SELF_REFLECTION_PENDING' | 'SELF_REFLECTION_SUBMITTED' | 'GOAL_SET' | 'GOAL_COMPLETED' | 'PARTIALLY_MET' | 'NOT_MET';
    progress: number;
    dueDate: string;
    createdAt: string;
    teacherId: string;
    teacherEmail?: string;
    teacher?: string;
    category: string;
    isSchoolAligned: boolean;
    selfReflectionForm?: string;
    goalSettingForm?: string;
    goalCompletionForm?: string;
}
