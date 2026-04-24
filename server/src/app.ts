import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import growthRoutes from './routes/growth.routes';
import analyticsRoutes from './routes/analytics.routes';
import ticketRoutes from './routes/tickets.routes';
import userRoutes from './routes/users.routes';
import fileRoutes from './routes/file.routes';
import timeRoutes from './routes/time.routes';
import chatRoutes from './routes/chat.routes';
import notificationRoutes from './routes/notification.routes';
import meetingRoutes from './routes/meeting.routes';
import aiRoutes from './routes/ai.routes';
import reportRoutes from './routes/report.routes';
import financeRoutes from './routes/finance.routes';
import tenantRoutes from './routes/tenant.routes';
import gamificationRoutes from './routes/gamification.routes';
import pmsRoutes from './routes/pms.routes';
import lmsRoutes from './routes/lms.routes';
import pdiRouter from './routes/pdi';
import { globalRBAC } from './middlewares/rbac.middleware';
import { authenticate } from './middlewares/auth.middleware';

import {
    // Notifications
    getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification,
    // Settings
    getSettings, getSettingByKey, upsertSetting, getAccessMatrix,
    // Observations
    getObservations, getGrowthObservations, updateGrowthObservation,
    // Goals
    getGoals, createGoal, updateGoal, requestGoalWindowOpen, getGoalWindows,
    // MOOC
    getMooc, submitMooc, updateMoocStatus,
    // Training
    getTraining, getTrainingById, createTraining, updateTraining, deleteTraining,
    updateTrainingStatus, registerForTraining, toggleAttendance,
    // Templates
    getTemplates, getTemplateById,
    // Announcements
    getAnnouncements, getAnnouncementStats, acknowledgeAnnouncement,
    // Meetings
    getMeetings, getMeetingById, getMeetingMoM,
    // Surveys
    getSurveys,
    // Forms
    getForms,
    // PD Hours & Portfolio
    getPdHours, getPortfolio,
    // Attendance
    getAttendance,
    // Courses
    getCourses, getCourseById, getMyEnrollments,
    // Team
    getTeamMembers,
    // Assessments
    getAssessments, getAssessmentAnalytics,
    // Festivals
    getFestivals, getFestivalAnalytics, getFestivalApplications,
    // OKR & Dashboards
    getOkr, getDashboards, getDashboardWidgetTypes,
    // Analytics
    getAnalytics, getGrowthAnalytics,
    // Generic fallthrough
    genericSuccess,
} from './controllers/stubs.controller';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Static Files ───────────────────────────────────────────────────────────
const uploadsDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadsDir)));

// ─── Core Routes ────────────────────────────────────────────────────────────
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/files',     fileRoutes);
app.use('/api/v1/time',      timeRoutes);

// Growth/Observations stubs registered BEFORE the authenticated growthRoutes
// so they don't hit the auth middleware which blocks unauthenticated requests.
app.get   ('/api/v1/growth/observations',       getGrowthObservations);
app.patch ('/api/v1/growth/observations/:id',   updateGrowthObservation);
app.get   ('/api/v1/growth/analytics',           getGrowthAnalytics);

app.use('/api/v1/growth',    growthRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/tickets',   ticketRoutes);
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/chat',      chatRoutes);
// notificationRoutes removed — stub handlers below serve /api/v1/notifications in dev mode
app.use('/api/v1/meetings', meetingRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/projects', globalRBAC, pmsRoutes);
app.use('/api/v1/lms', globalRBAC, lmsRoutes);
app.use('/api/v1/pdi', authenticate, pdiRouter);
// Note: /api/v1/notifications stub handlers below take priority for no-DB dev mode

// ─── PDI Stub Routes ─────────────────────────────────────────────────────────
// Notifications
app.get   ('/api/v1/notifications',              getNotifications);
app.patch ('/api/v1/notifications/:id/read',     markNotificationRead);
app.patch ('/api/v1/notifications/mark-all-read',markAllNotificationsRead);
app.delete('/api/v1/notifications/:id',          deleteNotification);

// Settings
app.get   ('/api/v1/settings',                       getSettings);
app.get   ('/api/v1/settings/access_matrix_config',  getAccessMatrix);
app.get   ('/api/v1/settings/:key',                  getSettingByKey);
app.post  ('/api/v1/settings/upsert',               upsertSetting);
app.put   ('/api/v1/settings',                       genericSuccess);
app.delete('/api/v1/settings/:key',                  genericSuccess);

// Observations (Legacy path used by some older service calls)
app.get('/api/v1/observations', getObservations);

// Goals — specific routes MUST come before /:id wildcard
app.get   ('/api/v1/goals/windows',             getGoalWindows);
app.post  ('/api/v1/goals/request-window-open', requestGoalWindowOpen);
app.get   ('/api/v1/goals',                     getGoals);
app.post  ('/api/v1/goals',                     createGoal);
app.patch ('/api/v1/goals/:id',                 updateGoal);
app.put   ('/api/v1/goals/:id',                 updateGoal);

// MOOC
app.get   ('/api/v1/mooc',                  getMooc);
app.post  ('/api/v1/mooc/submit',           submitMooc);
app.patch ('/api/v1/mooc/:id/status',       updateMoocStatus);

// Training / Calendar Events
app.get   ('/api/v1/training',              getTraining);
app.post  ('/api/v1/training',              createTraining);
app.post  ('/api/v1/training/:id/register', registerForTraining);
app.patch ('/api/v1/training/:id/status',  updateTrainingStatus);
app.put   ('/api/v1/training/:id',         updateTraining);
app.delete('/api/v1/training/:id',         deleteTraining);
app.get   ('/api/v1/training/:id',         getTrainingById);

// Templates (Reflection/Observation forms)
app.get   ('/api/v1/templates',     getTemplates);
app.post  ('/api/v1/templates',     genericSuccess);
app.put   ('/api/v1/templates/:id', genericSuccess);
app.delete('/api/v1/templates/:id', genericSuccess);
app.get   ('/api/v1/templates/:id', getTemplateById);

// Announcements
app.get   ('/api/v1/announcements',                      getAnnouncements);
app.post  ('/api/v1/announcements',                      genericSuccess);
app.patch ('/api/v1/announcements/:id',                  genericSuccess);
app.post  ('/api/v1/announcements/acknowledge/:id',      acknowledgeAnnouncement);
app.get   ('/api/v1/announcements/:id/stats',            getAnnouncementStats);

// Meetings
app.get   ('/api/v1/meetings',                               getMeetings);
app.post  ('/api/v1/meetings',                               genericSuccess);
app.get   ('/api/v1/meetings/:meetingId/mom',                getMeetingMoM);
app.post  ('/api/v1/meetings/:meetingId/mom',                genericSuccess);
app.patch ('/api/v1/meetings/:meetingId/mom',                genericSuccess);
app.post  ('/api/v1/meetings/:meetingId/mom/publish',        genericSuccess);
app.post  ('/api/v1/meetings/:meetingId/mom/reply',          genericSuccess);
app.post  ('/api/v1/meetings/:meetingId/mom/share',          genericSuccess);
app.patch ('/api/v1/meetings/:id/complete',                  genericSuccess);
app.patch ('/api/v1/meetings/:id',                           genericSuccess);
app.delete('/api/v1/meetings/:id',                           genericSuccess);
app.get   ('/api/v1/meetings/:id',                           getMeetingById);

// Surveys
app.get   ('/api/v1/surveys/active',                getSurveys);
app.get   ('/api/v1/surveys/my-history',            genericSuccess);
app.post  ('/api/v1/surveys/submit',                genericSuccess);
app.post  ('/api/v1/surveys/questions',             genericSuccess);
app.patch ('/api/v1/surveys/questions/:id',         genericSuccess);
app.delete('/api/v1/surveys/questions/:id',         genericSuccess);
app.get   ('/api/v1/surveys/:surveyId/responses',   genericSuccess);
app.get   ('/api/v1/surveys/:surveyId/analytics',   genericSuccess);
app.get   ('/api/v1/surveys/:surveyId/export',      genericSuccess);
app.post  ('/api/v1/surveys/:surveyId/questions',   genericSuccess);
app.patch ('/api/v1/surveys/:id',                   genericSuccess);
app.get   ('/api/v1/surveys/:id',                   getSurveys);
// generic /survey alias used by some services
app.get('/api/v1/survey', getSurveys);

// Form Templates
app.get ('/api/v1/forms', getForms);
app.post('/api/v1/forms', genericSuccess);

// PD Hours
app.get('/api/v1/pd-hours', getPdHours);

// Portfolio
app.get   ('/api/v1/portfolio',                                       getPortfolio);
app.get   ('/api/v1/portfolio/:teacherId/summary',                    getPortfolio);
app.get   ('/api/v1/portfolio/:teacherId/timeline',                   getPortfolio);
app.get   ('/api/v1/portfolio/:teacherId/achievements',               getPortfolio);
app.post  ('/api/v1/portfolio/:teacherId/achievements',               genericSuccess);
app.put   ('/api/v1/portfolio/:teacherId/achievements/:id',           genericSuccess);
app.delete('/api/v1/portfolio/:teacherId/achievements/:id',           genericSuccess);

// Attendance
app.get ('/api/v1/attendance',           getAttendance);
app.post('/api/v1/attendance',           genericSuccess);
app.post('/api/v1/attendance/:id/toggle',  toggleAttendance);

// Courses
app.get   ('/api/v1/courses/my-enrollments', getMyEnrollments);
app.post  ('/api/v1/courses/:id/enroll',     genericSuccess);
app.patch ('/api/v1/courses/:id/progress',   genericSuccess);
app.get   ('/api/v1/courses',                getCourses);
app.post  ('/api/v1/courses',                genericSuccess);
app.patch ('/api/v1/courses/:id',            genericSuccess);
app.delete('/api/v1/courses/:id',            genericSuccess);
app.get   ('/api/v1/courses/:id',            getCourseById);

// Team
app.get('/api/v1/team', getTeamMembers);

// Assessments
app.get   ('/api/v1/assessments/analytics',                     getAssessmentAnalytics);
app.get   ('/api/v1/assessments/my-assignments',                genericSuccess);
app.post  ('/api/v1/assessments/:assessmentId/assign',          genericSuccess);
app.post  ('/api/v1/assessments/:assessmentId/attempt/start',   genericSuccess);
app.post  ('/api/v1/assessments/attempt/:attemptId/submit',     genericSuccess);
app.put   ('/api/v1/assessments/attempt/:attemptId/save',       genericSuccess);
app.get   ('/api/v1/assessments',                               getAssessments);
app.post  ('/api/v1/assessments',                               genericSuccess);
app.put   ('/api/v1/assessments/:id',                           genericSuccess);
app.delete('/api/v1/assessments/:id',                           genericSuccess);

// Festivals / Learning Festival
app.get   ('/api/v1/festivals/analytics',            getFestivalAnalytics);
app.get   ('/api/v1/festivals/applications',          getFestivalApplications);
app.put   ('/api/v1/festivals/applications/:id/status', genericSuccess);
app.post  ('/api/v1/festivals/:festivalId/apply',    genericSuccess);
app.get   ('/api/v1/festivals',                      getFestivals);
app.post  ('/api/v1/festivals',                      genericSuccess);
app.put   ('/api/v1/festivals/:id',                  genericSuccess);

// OKR
app.get('/api/v1/okr', getOkr);

// Custom Dashboards (widget management)
app.get   ('/api/v1/dashboards/widget-types/list', getDashboardWidgetTypes);
app.post  ('/api/v1/dashboards/widget-types',      genericSuccess);
app.put   ('/api/v1/dashboards/widget-types/:id',  genericSuccess);
app.delete('/api/v1/dashboards/widget-types/:id',  genericSuccess);
app.get   ('/api/v1/dashboards/role/:role',        getDashboards);
app.put   ('/api/v1/dashboards/role/:role/set-default/:id', genericSuccess);
app.get   ('/api/v1/dashboards',                   getDashboards);
app.post  ('/api/v1/dashboards',                   genericSuccess);
app.put   ('/api/v1/dashboards/:id',               genericSuccess);
app.delete('/api/v1/dashboards/:id',               genericSuccess);
app.get   ('/api/v1/dashboards/:id',               getDashboards);
app.post  ('/api/v1/dashboards/:dashboardId/widgets',        genericSuccess);
app.put   ('/api/v1/dashboards/:dashboardId/widgets/reorder',genericSuccess);
app.put   ('/api/v1/dashboards/:dashboardId/widgets/:widgetId', genericSuccess);
app.delete('/api/v1/dashboards/:dashboardId/widgets/:widgetId', genericSuccess);

// Analytics (extra stubs)
app.get('/api/v1/analytics/engagement',          getAnalytics);
app.get('/api/v1/analytics/feedback',            getAnalytics);
app.get('/api/v1/analytics/management/overview', getAnalytics);
app.get('/api/v1/analytics/attendance/campuses', getAnalytics);
app.get('/api/v1/analytics/cutoff-stats',        getAnalytics);
// Removed duplicate /growth/analytics route from here

// Documents
app.get   ('/api/v1/documents/teacher/acknowledgements',                 genericSuccess);
app.post  ('/api/v1/documents/upload',                                   genericSuccess);
app.post  ('/api/v1/documents/assign',                                   genericSuccess);
app.post  ('/api/v1/documents/acknowledgements/:id/view',                genericSuccess);
app.post  ('/api/v1/documents/acknowledgements/:id/acknowledge',         genericSuccess);
app.delete('/api/v1/documents/:id',                                      genericSuccess);

// PTIL (Parent Teacher Interaction Log)
app.get   ('/api/v1/ptil',                               genericSuccess);
app.post  ('/api/v1/ptil',                               genericSuccess);
app.post  ('/api/v1/ptil/public/submit',                 genericSuccess);
app.get   ('/api/v1/ptil/analytics',                     genericSuccess);
app.patch ('/api/v1/ptil/:id',                           genericSuccess);


// AI (stub)
app.post('/api/v1/ai/generate-questions', genericSuccess);

// Upload (stub)
app.post('/api/v1/upload', (_req, res) => {
    res.json({ status: 'success', data: { fileUrl: '', fileName: '', fileSize: 0 } });
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', message: 'SchoolOS API is running', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    
    if (statusCode === 500) {
        console.error('SERVER ERROR:', err.stack);
    }

    res.status(statusCode).json({
        status,
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export { app };
