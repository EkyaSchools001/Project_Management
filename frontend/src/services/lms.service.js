import api from './api.client';

export const lmsService = {
  getCourses: (params = {}) => api.get('/lms/courses', { params }),
  getCourseById: (id) => api.get(`/lms/courses/${id}`),
  createCourse: (data) => api.post('/lms/courses', data),
  updateCourse: (id, data) => api.patch(`/lms/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/lms/courses/${id}`),

  getLessons: (courseId) => api.get(`/lms/courses/${courseId}/lessons`),
  getLessonById: (id) => api.get(`/lms/lessons/${id}`),
  createLesson: (courseId, data) => api.post(`/lms/courses/${courseId}/lessons`, data),
  updateLesson: (id, data) => api.patch(`/lms/lessons/${id}`, data),
  deleteLesson: (id) => api.delete(`/lms/lessons/${id}`),

  getQuizzes: (lessonId) => api.get(`/lms/lessons/${lessonId}/quizzes`),
  getQuizById: (id) => api.get(`/lms/quizzes/${id}`),
  createQuiz: (lessonId, data) => api.post(`/lms/lessons/${lessonId}/quizzes`, data),
  updateQuiz: (id, data) => api.patch(`/lms/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/lms/quizzes/${id}`),

  submitQuizAttempt: (quizId, answers) => api.post(`/lms/quizzes/${quizId}/attempts`, { answers }),
  getQuizAttempts: (quizId) => api.get(`/lms/quizzes/${quizId}/attempts`),

  enrollInCourse: (courseId) => api.post(`/lms/courses/${courseId}/enroll`),
  getMyEnrollments: () => api.get('/lms/courses/my-enrollments'),
  getEnrollment: (courseId) => api.get(`/lms/courses/${courseId}/enrollment`),
  updateProgress: (courseId, progress) => api.patch(`/lms/courses/${courseId}/progress`, { progress }),
  getMyCourses: () => api.get('/lms/courses/my'),

  generateCertificate: (courseId) => api.post(`/lms/courses/${courseId}/certificate`),
  getMyCertificates: () => api.get('/lms/certificates'),
  getCertificateById: (id) => api.get(`/lms/certificates/${id}`),

  getLearningPaths: () => api.get('/lms/learning-paths'),
  getLearningPathById: (id) => api.get(`/lms/learning-paths/${id}`),
  createLearningPath: (data) => api.post('/lms/learning-paths', data),
  updateLearningPath: (id, data) => api.patch(`/lms/learning-paths/${id}`, data),
  enrollInLearningPath: (pathId) => api.post(`/lms/learning-paths/${pathId}/enroll`),
  getMyLearningPaths: () => api.get('/lms/learning-paths/my'),

  getCategories: () => api.get('/lms/courses/categories'),
};

export default lmsService;