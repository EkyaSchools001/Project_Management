import { Request, Response } from 'express';
import { prisma } from '../app';

export interface ReportWidget {
    id: string;
    type: 'chart' | 'table' | 'kpi';
    title: string;
    config: Record<string, any>;
    position: { x: number; y: number; w: number; h: number };
}

export interface Report {
    id: string;
    name: string;
    description?: string;
    dataSource: string;
    filters: Record<string, any>[];
    widgets: ReportWidget[];
    groupBy?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    widgets: ReportWidget[];
    defaultFilters: Record<string, any>[];
}

export interface ReportSchedule {
    id: string;
    reportId: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
    format: 'pdf' | 'excel';
    enabled: boolean;
    lastRun?: Date;
    nextRun: Date;
}

const TEMPLATES: ReportTemplate[] = [
    {
        id: 'template-enrollment',
        name: 'Enrollment Summary',
        description: 'Overview of student enrollment across schools',
        category: 'Enrollment',
        widgets: [
            { id: 'w1', type: 'kpi', title: 'Total Students', config: { metric: 'total_students', comparison: 'previous_period' }, position: { x: 0, y: 0, w: 3, h: 1 } },
            { id: 'w2', type: 'kpi', title: 'New Enrollments', config: { metric: 'new_enrollments', comparison: 'previous_period' }, position: { x: 3, y: 0, w: 3, h: 1 } },
            { id: 'w3', type: 'chart', title: 'Enrollment Trend', config: { chartType: 'line', dataField: 'enrollment', groupBy: 'month' }, position: { x: 0, y: 1, w: 6, h: 3 } },
            { id: 'w4', type: 'table', title: 'School Breakdown', config: { columns: ['school', 'students', 'growth'], sortable: true }, position: { x: 0, y: 4, w: 6, h: 3 } }
        ],
        defaultFilters: [{ field: 'period', value: 'current_year' }]
    },
    {
        id: 'template-attendance',
        name: 'Attendance Report',
        description: 'Track student and staff attendance metrics',
        category: 'Attendance',
        widgets: [
            { id: 'w1', type: 'kpi', title: 'Attendance Rate', config: { metric: 'attendance_rate', comparison: 'target' }, position: { x: 0, y: 0, w: 4, h: 1 } },
            { id: 'w2', type: 'kpi', title: 'Absenteeism', config: { metric: 'absenteeism_rate', comparison: 'previous_period' }, position: { x: 4, y: 0, w: 4, h: 1 } },
            { id: 'w3', type: 'chart', title: 'Attendance by Day', config: { chartType: 'bar', dataField: 'attendance', groupBy: 'day_of_week' }, position: { x: 0, y: 1, w: 8, h: 3 } },
            { id: 'w4', type: 'chart', title: 'Attendance by Grade', config: { chartType: 'pie', dataField: 'attendance', groupBy: 'grade' }, position: { x: 0, y: 4, w: 4, h: 3 } },
            { id: 'w5', type: 'table', title: 'Low Attendance Students', config: { columns: ['name', 'grade', 'attendance_rate'], filters: [{ field: 'attendance_rate', operator: 'lt', value: 75 }] }, position: { x: 4, y: 4, w: 4, h: 3 } }
        ],
        defaultFilters: [{ field: 'period', value: 'current_month' }]
    },
    {
        id: 'template-performance',
        name: 'Academic Performance',
        description: 'Student grades and assessment results',
        category: 'Academic',
        widgets: [
            { id: 'w1', type: 'kpi', title: 'Average Grade', config: { metric: 'average_grade', comparison: 'previous_period' }, position: { x: 0, y: 0, w: 3, h: 1 } },
            { id: 'w2', type: 'kpi', title: 'Pass Rate', config: { metric: 'pass_rate', comparison: 'target' }, position: { x: 3, y: 0, w: 3, h: 1 } },
            { id: 'w3', type: 'kpi', title: 'Top Performers', config: { metric: 'top_performers', comparison: 'previous_period' }, position: { x: 6, y: 0, w: 3, h: 1 } },
            { id: 'w4', type: 'chart', title: 'Grade Distribution', config: { chartType: 'bar', dataField: 'grades', groupBy: 'grade_level' }, position: { x: 0, y: 1, w: 6, h: 3 } },
            { id: 'w5', type: 'chart', title: 'Subject Performance', config: { chartType: 'radar', dataField: 'subject_scores' }, position: { x: 6, y: 1, w: 6, h: 3 } },
            { id: 'w6', type: 'table', title: 'Subject Rankings', config: { columns: ['subject', 'average', 'highest', 'lowest'], sortable: true }, position: { x: 0, y: 4, w: 12, h: 3 } }
        ],
        defaultFilters: [{ field: 'period', value: 'current_semester' }]
    },
    {
        id: 'template-staff',
        name: 'Staff Overview',
        description: 'Staff count, roles, and performance metrics',
        category: 'HR',
        widgets: [
            { id: 'w1', type: 'kpi', title: 'Total Staff', config: { metric: 'total_staff' }, position: { x: 0, y: 0, w: 3, h: 1 } },
            { id: 'w2', type: 'kpi', title: 'Teachers', config: { metric: 'teacher_count' }, position: { x: 3, y: 0, w: 3, h: 1 } },
            { id: 'w3', type: 'kpi', title: 'Retention Rate', config: { metric: 'retention_rate', comparison: 'previous_year' }, position: { x: 6, y: 0, w: 3, h: 1 } },
            { id: 'w4', type: 'chart', title: 'Staff by Department', config: { chartType: 'pie', dataField: 'staff_count', groupBy: 'department' }, position: { x: 0, y: 1, w: 6, h: 3 } },
            { id: 'w5', type: 'chart', title: 'Staff Trend', config: { chartType: 'line', dataField: 'staff_count', groupBy: 'month' }, position: { x: 6, y: 1, w: 6, h: 3 } },
            { id: 'w6', type: 'table', title: 'Recent Hires', config: { columns: ['name', 'role', 'department', 'start_date'] }, position: { x: 0, y: 4, w: 12, h: 3 } }
        ],
        defaultFilters: []
    },
    {
        id: 'template-finance',
        name: 'Financial Summary',
        description: 'Revenue, expenses, and budget tracking',
        category: 'Finance',
        widgets: [
            { id: 'w1', type: 'kpi', title: 'Total Revenue', config: { metric: 'total_revenue', comparison: 'budget' }, position: { x: 0, y: 0, w: 4, h: 1 } },
            { id: 'w2', type: 'kpi', title: 'Total Expenses', config: { metric: 'total_expenses', comparison: 'budget' }, position: { x: 4, y: 0, w: 4, h: 1 } },
            { id: 'w3', type: 'kpi', title: 'Net Balance', config: { metric: 'net_balance' }, position: { x: 8, y: 0, w: 4, h: 1 } },
            { id: 'w4', type: 'chart', title: 'Revenue vs Expenses', config: { chartType: 'area', dataField: 'revenue_expenses', groupBy: 'month' }, position: { x: 0, y: 1, w: 12, h: 3 } },
            { id: 'w5', type: 'chart', title: 'Expense Breakdown', config: { chartType: 'pie', dataField: 'expenses', groupBy: 'category' }, position: { x: 0, y: 4, w: 6, h: 3 } },
            { id: 'w6', type: 'table', title: 'Top Expenses', config: { columns: ['category', 'amount', 'budget', 'variance'], sortable: true }, position: { x: 6, y: 4, w: 6, h: 3 } }
        ],
        defaultFilters: [{ field: 'period', value: 'current_year' }]
    }
];

export const createReport = async (req: Request, res: Response) => {
    try {
        const { name, description, dataSource, filters, widgets, groupBy, sortBy, sortOrder, createdBy } = req.body;

        const report = await prisma.report.create({
            data: {
                name,
                description,
                dataSource,
                filters: JSON.stringify(filters || []),
                widgets: JSON.stringify(widgets || []),
                groupBy: JSON.stringify(groupBy || []),
                sortBy,
                sortOrder,
                createdBy,
                updatedAt: new Date()
            }
        });

        res.status(201).json({ status: 'success', data: { report } });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create report' });
    }
};

export const getReports = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const where = search ? {
            OR: [
                { name: { contains: search as string, mode: 'insensitive' as any } },
                { description: { contains: search as string, mode: 'insensitive' as any } }
            ]
        } : {};

        const skip = (Number(page) - 1) * Number(limit);

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { updatedAt: 'desc' },
                include: { creator: { select: { name: true, email: true } } }
            }),
            prisma.report.count({ where })
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                reports: reports.map(r => ({
                    ...r,
                    filters: JSON.parse(r.filters || '[]'),
                    widgets: JSON.parse(r.widgets || '[]'),
                    groupBy: JSON.parse(r.groupBy || '[]')
                })),
                pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
            }
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch reports' });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;

        const report = await prisma.report.findUnique({
            where: { id },
            include: { creator: { select: { name: true, email: true } } }
        });

        if (!report) {
            return res.status(404).json({ status: 'error', message: 'Report not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                ...report,
                filters: JSON.parse(report.filters || '[]'),
                widgets: JSON.parse(report.widgets || '[]'),
                groupBy: JSON.parse(report.groupBy || '[]')
            }
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch report' });
    }
};

export const updateReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const { name, description, dataSource, filters, widgets, groupBy, sortBy, sortOrder } = req.body;

        const report = await prisma.report.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(dataSource && { dataSource }),
                ...(filters && { filters: JSON.stringify(filters) }),
                ...(widgets && { widgets: JSON.stringify(widgets) }),
                ...(groupBy && { groupBy: JSON.stringify(groupBy) }),
                ...(sortBy && { sortBy }),
                ...(sortOrder && { sortOrder }),
                updatedAt: new Date()
            }
        });

        res.status(200).json({ status: 'success', data: { report } });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update report' });
    }
};

export const deleteReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;

        await prisma.report.delete({ where: { id } });

        res.status(200).json({ status: 'success', message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete report' });
    }
};

export const generateReportData = async (req: Request, res: Response) => {
    try {
        const { dataSource, filters, widgets, groupBy, sortBy, sortOrder } = req.body;

        const mockData = generateMockData(dataSource, filters);

        const aggregatedData = aggregateData(mockData, groupBy, sortBy, sortOrder);

        const chartData = generateChartData(widgets, mockData, aggregatedData);

        const kpiData = calculateKPIs(widgets, mockData, aggregatedData);

        res.status(200).json({
            status: 'success',
            data: {
                rawData: mockData,
                aggregatedData,
                chartData,
                kpiData
            }
        });
    } catch (error) {
        console.error('Error generating report data:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate report data' });
    }
};

export const exportReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.i as string;
        const { format } = req.body;

        const report = await prisma.report.findUnique({ where: { id } });

        if (!report) {
            return res.status(404).json({ status: 'error', message: 'Report not found' });
        }

        const mockData = generateMockData(report.dataSource, JSON.parse(report.filters || '[]'));

        if (format === 'excel') {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Report');

            const headers = Object.keys(mockData[0] || {});
            worksheet.addRow(headers);

            mockData.forEach(row => {
                worksheet.addRow(Object.values(row));
            });

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${report.name}.xlsx`);
            return res.send(buffer);
        }

        res.status(200).json({
            status: 'success',
            data: {
                message: 'PDF export not implemented yet',
                reportName: report.name,
                recordCount: mockData.length
            }
        });
    } catch (error) {
        console.error('Error exporting report:', error);
        res.status(500).json({ status: 'error', message: 'Failed to export report' });
    }
};

export const scheduleReport = async (req: Request, res: Response) => {
    try {
        const { reportId, frequency, time, recipients, format, enabled } = req.body;

        const schedule = await prisma.reportSchedule.create({
            data: {
                reportId,
                frequency,
                time,
                recipients: JSON.stringify(recipients),
                format,
                enabled,
                nextRun: calculateNextRun(frequency, time)
            }
        });

        res.status(201).json({ status: 'success', data: { schedule } });
    } catch (error) {
        console.error('Error scheduling report:', error);
        res.status(500).json({ status: 'error', message: 'Failed to schedule report' });
    }
};

export const getReportSchedules = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.query;

        const where = reportId ? { reportId: reportId as string } : {};

        const schedules = await prisma.reportSchedule.findMany({
            where,
            include: { report: { select: { name: true } } }
        });

        res.status(200).json({
            status: 'success',
            data: {
                schedules: schedules.map(s => ({
                    ...s,
                    recipients: JSON.parse(s.recipients || '[]')
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch schedules' });
    }
};

export const getReportTemplates = async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: { templates: TEMPLATES } });
};

export const getDataSources = async (_req: Request, res: Response) => {
    const dataSources = [
        { id: 'students', name: 'Students', fields: ['id', 'name', 'email', 'grade', 'school', 'enrollment_date'] },
        { id: 'staff', name: 'Staff', fields: ['id', 'name', 'email', 'role', 'department', 'join_date'] },
        { id: 'attendance', name: 'Attendance', fields: ['student_id', 'date', 'status', 'reason'] },
        { id: 'grades', name: 'Grades', fields: ['student_id', 'subject', 'score', 'grade', 'semester'] },
        { id: 'finance', name: 'Finance', fields: ['id', 'type', 'amount', 'category', 'date', 'description'] },
        { id: 'enrollment', name: 'Enrollment', fields: ['school_id', 'students', 'date', 'growth'] },
        { id: 'tasks', name: 'Tasks', fields: ['id', 'title', 'status', 'assignee', 'due_date', 'priority'] },
        { id: 'projects', name: 'Projects', fields: ['id', 'name', 'status', 'progress', 'start_date', 'end_date'] }
    ];

    res.status(200).json({ status: 'success', data: { dataSources } });
};

function generateMockData(dataSource: string, filters: any[]): any[] {
    const count = 50;
    const data = [];

    for (let i = 0; i < count; i++) {
        const row: any = {};

        switch (dataSource) {
            case 'students':
                row.id = `STU${String(i + 1).padStart(4, '0')}`;
                row.name = `Student ${i + 1}`;
                row.email = `student${i + 1}@school.edu`;
                row.grade = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][Math.floor(Math.random() * 13)];
                row.school = ['North High', 'South Elementary', 'West Middle', 'East Academy'][Math.floor(Math.random() * 4)];
                row.enrollment_date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
                row.attendance_rate = 70 + Math.floor(Math.random() * 30);
                break;
            case 'staff':
                row.id = `STF${String(i + 1).padStart(4, '0')}`;
                row.name = `Staff ${i + 1}`;
                row.email = `staff${i + 1}@school.edu`;
                row.role = ['Teacher', 'Principal', 'Counselor', 'Admin', 'Nurse'][Math.floor(Math.random() * 5)];
                row.department = ['Math', 'Science', 'English', 'History', 'Art', 'PE'][Math.floor(Math.random() * 6)];
                row.join_date = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
                row.salary = 40000 + Math.floor(Math.random() * 60000);
                break;
            case 'attendance':
                row.id = i + 1;
                row.student_id = `STU${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`;
                row.date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
                row.status = ['Present', 'Absent', 'Late', 'Excused'][Math.floor(Math.random() * 4)];
                row.reason = Math.random() > 0.7 ? ['Sick', 'Family event', 'Appointment'][Math.floor(Math.random() * 3)] : '';
                break;
            case 'grades':
                row.id = i + 1;
                row.student_id = `STU${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`;
                row.subject = ['Math', 'Science', 'English', 'History', 'Art'][Math.floor(Math.random() * 5)];
                row.score = 50 + Math.floor(Math.random() * 50);
                row.grade = row.score >= 90 ? 'A' : row.score >= 80 ? 'B' : row.score >= 70 ? 'C' : row.score >= 60 ? 'D' : 'F';
                row.semester = ['Fall 2024', 'Spring 2024'][Math.floor(Math.random() * 2)];
                break;
            case 'finance':
                row.id = i + 1;
                row.type = ['Revenue', 'Expense'][Math.floor(Math.random() * 2)];
                row.amount = Math.floor(Math.random() * 50000) + 1000;
                row.category = ['Tuition', 'Books', 'Supplies', 'Salaries', 'Maintenance', 'Transportation'][Math.floor(Math.random() * 6)];
                row.date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
                row.description = `Transaction ${i + 1}`;
                break;
            case 'enrollment':
                row.school = ['North High', 'South Elementary', 'West Middle', 'East Academy'][i % 4];
                row.students = 200 + Math.floor(Math.random() * 300);
                row.date = new Date(2024, Math.floor(Math.random() * 12), 1).toISOString();
                row.growth = Math.floor(Math.random() * 20) - 5;
                break;
            case 'tasks':
                row.id = i + 1;
                row.title = `Task ${i + 1}`;
                row.status = ['Todo', 'In Progress', 'Review', 'Done'][Math.floor(Math.random() * 4)];
                row.assignee = `Staff ${Math.floor(Math.random() * 10) + 1}`;
                row.due_date = new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
                row.priority = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
                break;
            case 'projects':
                row.id = i + 1;
                row.name = `Project ${i + 1}`;
                row.status = ['Planning', 'Active', 'On Hold', 'Completed'][Math.floor(Math.random() * 4)];
                row.progress = Math.floor(Math.random() * 100);
                row.start_date = new Date(2024, Math.floor(Math.random() * 6), 1).toISOString();
                row.end_date = new Date(2024, 6 + Math.floor(Math.random() * 6), 1).toISOString();
                row.budget = 10000 + Math.floor(Math.random() * 90000);
                break;
            default:
                row.id = i + 1;
                row.value = Math.floor(Math.random() * 100);
                row.label = `Item ${i + 1}`;
        }

        data.push(row);
    }

    return data;
}

function aggregateData(data: any[], groupBy?: string[], sortBy?: string, sortOrder?: 'asc' | 'desc'): any[] {
    if (!groupBy || groupBy.length === 0) return data;

    const grouped: Record<string, any> = {};

    data.forEach(row => {
        const key = groupBy.map(g => row[g]).join('_');
        if (!grouped[key]) {
            grouped[key] = { count: 0, sum: 0, items: [], ...groupBy.reduce((acc, g) => ({ ...acc, [g]: row[g] }), {}) };
        }
        grouped[key].count++;
        grouped[key].sum += row.score || row.amount || row.students || 1;
        grouped[key].items.push(row);
    });

    const result = Object.values(grouped);
    if (sortBy) {
        result.sort((a, b) => {
            const aVal = a[sortBy] || 0;
            const bVal = b[sortBy] || 0;
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });
    }

    return result;
}

function generateChartData(widgets: any[], mockData: any[], aggregatedData: any[]): Record<string, any> {
    const chartData: Record<string, any> = {};

    widgets?.filter(w => w.type === 'chart').forEach(widget => {
        const { id, config } = widget;
        const { chartType, dataField, groupBy } = config;

        if (groupBy) {
            const grouped: Record<string, number> = {};
            mockData.forEach(row => {
                const key = row[groupBy] || 'Other';
                grouped[key] = (grouped[key] || 0) + (row[dataField] || 1);
            });
            chartData[id] = Object.entries(grouped).map(([name, value]) => ({ name, value }));
        } else {
            chartData[id] = mockData.slice(0, 10).map((row, i) => ({
                name: `Item ${i + 1}`,
                value: row[dataField] || Math.floor(Math.random() * 100)
            }));
        }
    });

    return chartData;
}

function calculateKPIs(widgets: any[], mockData: any[], aggregatedData: any[]): Record<string, any> {
    const kpiData: Record<string, any> = {};

    widgets?.filter(w => w.type === 'kpi').forEach(widget => {
        const { id, config } = widget;
        const { metric, comparison } = config;

        let value = 0;
        switch (metric) {
            case 'total_students':
                value = mockData.length;
                break;
            case 'average_grade':
                const total = mockData.reduce((sum: number, r: any) => sum + (r.score || 0), 0);
                value = Math.round(total / mockData.length);
                break;
            case 'attendance_rate':
                value = 85 + Math.floor(Math.random() * 15);
                break;
            default:
                value = Math.floor(Math.random() * 1000);
        }

        let comparisonValue = null;
        if (comparison === 'previous_period') {
            comparisonValue = Math.floor(value * (0.9 + Math.random() * 0.2));
        } else if (comparison === 'target') {
            comparisonValue = 90;
        }

        kpiData[id] = {
            value,
            comparison: comparisonValue ? { value: comparisonValue, change: ((value - comparisonValue) / comparisonValue * 100).toFixed(1) } : null
        };
    });

    return kpiData;
}

function calculateNextRun(frequency: string, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    switch (frequency) {
        case 'daily':
            if (next <= now) next.setDate(next.getDate() + 1);
            break;
        case 'weekly':
            next.setDate(next.getDate() + (7 - next.getDay()));
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + 1);
            next.setDate(1);
            break;
    }

    return next;
}