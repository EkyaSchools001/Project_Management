import { Router } from 'express';
import { lmsController } from '../controllers/lms.controller';

const router = Router();

router.get('/courses', lmsController.getCourses);
router.get('/courses/my-enrollments', lmsController.getMyEnrollments);
router.get('/courses/my', lmsController.getMyCourses);
router.get('/courses/categories', lmsController.getCategories);
router.get('/courses/:id', lmsController.getCourseById);
router.post('/courses', lmsController.createCourse);
router.patch('/courses/:id', lmsController.updateCourse);
router.delete('/courses/:id', lmsController.deleteCourse);

router.post('/courses/:courseId/enroll', lmsController.enrollInCourse);
router.get('/courses/:courseId/enrollment', lmsController.getEnrollment);
router.patch('/courses/:courseId/progress', lmsController.updateProgress);
router.post('/courses/:courseId/certificate', lmsController.generateCertificate);

router.get('/courses/:courseId/lessons', lmsController.getLessons);
router.get('/lessons/:id', lmsController.getLessonById);
router.post('/courses/:courseId/lessons', lmsController.createLesson);
router.patch('/lessons/:id', lmsController.updateLesson);
router.delete('/lessons/:id', lmsController.deleteLesson);

router.get('/lessons/:lessonId/quizzes', lmsController.getQuizzes);
router.get('/quizzes/:id', lmsController.getQuizById);
router.post('/lessons/:lessonId/quizzes', lmsController.createQuiz);
router.patch('/quizzes/:id', lmsController.updateQuiz);
router.delete('/quizzes/:id', lmsController.deleteQuiz);

router.post('/quizzes/:quizId/attempts', lmsController.submitQuizAttempt);
router.get('/quizzes/:quizId/attempts', lmsController.getQuizAttempts);

router.get('/certificates', lmsController.getMyCertificates);
router.get('/certificates/:id', lmsController.getCertificateById);

router.get('/learning-paths', lmsController.getLearningPaths);
router.get('/learning-paths/my', lmsController.getMyLearningPaths);
router.get('/learning-paths/:id', lmsController.getLearningPathById);
router.post('/learning-paths', lmsController.createLearningPath);
router.patch('/learning-paths/:id', lmsController.updateLearningPath);
router.post('/learning-paths/:pathId/enroll', lmsController.enrollInLearningPath);

export default router;