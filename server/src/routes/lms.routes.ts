import { Router } from 'express';
import { lmsController } from '../controllers/lms.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/courses', checkPermission('Curriculum', 'view'), lmsController.getCourses);
router.get('/courses/my-enrollments', checkPermission('Curriculum', 'view'), lmsController.getMyEnrollments);
router.get('/courses/my', checkPermission('Curriculum', 'view'), lmsController.getMyCourses);
router.get('/courses/categories', checkPermission('Curriculum', 'view'), lmsController.getCategories);
router.get('/courses/:id', checkPermission('Curriculum', 'view'), lmsController.getCourseById);
router.post('/courses', checkPermission('Curriculum', 'create'), lmsController.createCourse);
router.patch('/courses/:id', checkPermission('Curriculum', 'edit'), lmsController.updateCourse);
router.delete('/courses/:id', checkPermission('Curriculum', 'delete'), lmsController.deleteCourse);

router.post('/courses/:courseId/enroll', checkPermission('Curriculum', 'edit'), lmsController.enrollInCourse);
router.get('/courses/:courseId/enrollment', checkPermission('Curriculum', 'view'), lmsController.getEnrollment);
router.patch('/courses/:courseId/progress', checkPermission('Curriculum', 'edit'), lmsController.updateProgress);
router.post('/courses/:courseId/certificate', checkPermission('Curriculum', 'view'), lmsController.generateCertificate);

router.get('/courses/:courseId/lessons', checkPermission('Curriculum', 'view'), lmsController.getLessons);
router.get('/lessons/:id', checkPermission('Curriculum', 'view'), lmsController.getLessonById);
router.post('/courses/:courseId/lessons', checkPermission('Curriculum', 'create'), lmsController.createLesson);
router.patch('/lessons/:id', checkPermission('Curriculum', 'edit'), lmsController.updateLesson);
router.delete('/lessons/:id', checkPermission('Curriculum', 'delete'), lmsController.deleteLesson);

router.get('/lessons/:lessonId/quizzes', checkPermission('Curriculum', 'view'), lmsController.getQuizzes);
router.get('/quizzes/:id', checkPermission('Curriculum', 'view'), lmsController.getQuizById);
router.post('/lessons/:lessonId/quizzes', checkPermission('Curriculum', 'create'), lmsController.createQuiz);
router.patch('/quizzes/:id', checkPermission('Curriculum', 'edit'), lmsController.updateQuiz);
router.delete('/quizzes/:id', checkPermission('Curriculum', 'delete'), lmsController.deleteQuiz);

router.post('/quizzes/:quizId/attempts', checkPermission('Curriculum', 'edit'), lmsController.submitQuizAttempt);
router.get('/quizzes/:quizId/attempts', checkPermission('Curriculum', 'view'), lmsController.getQuizAttempts);

router.get('/certificates', checkPermission('Curriculum', 'view'), lmsController.getMyCertificates);
router.get('/certificates/:id', checkPermission('Curriculum', 'view'), lmsController.getCertificateById);

router.get('/learning-paths', checkPermission('Curriculum', 'view'), lmsController.getLearningPaths);
router.get('/learning-paths/my', checkPermission('Curriculum', 'view'), lmsController.getMyLearningPaths);
router.get('/learning-paths/:id', checkPermission('Curriculum', 'view'), lmsController.getLearningPathById);
router.post('/learning-paths', checkPermission('Curriculum', 'create'), lmsController.createLearningPath);
router.patch('/learning-paths/:id', checkPermission('Curriculum', 'edit'), lmsController.updateLearningPath);
router.post('/learning-paths/:pathId/enroll', checkPermission('Curriculum', 'edit'), lmsController.enrollInLearningPath);

export default router;
