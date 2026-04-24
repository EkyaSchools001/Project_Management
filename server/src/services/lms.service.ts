import { PrismaClient } from '@prisma/client';
import { MOCK_COURSES, MOCK_CATEGORIES, MOCK_LEARNING_PATHS } from '../data/lms_mocks';

const prisma = new PrismaClient();

export const lmsService = {
  async getCourses(options: { 
    status?: string; 
    category?: string; 
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const { status, category, search, limit = 20, offset = 0 } = options;
    
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: {
            instructor: { select: { id: true, name: true } },
            _count: { select: { enrollments: true, lessons: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.course.count({ where }),
      ]);

      return { courses, total };
    } catch (error) {
      console.error('DB Error in getCourses, falling back to mocks:', error.message);
      // Basic filtering for mock data to make it feel reactive
      let filtered = [...MOCK_COURSES];
      if (category) filtered = filtered.filter(c => c.category === category);
      if (search) filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) || 
        c.description.toLowerCase().includes(search.toLowerCase())
      );
      return { courses: filtered.slice(offset, offset + limit), total: filtered.length };
    }
  },

  async getCourseById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        lessons: { orderBy: { order: 'asc' } },
        quizzes: { include: { lesson: true } },
        _count: { select: { enrollments: true } },
      },
    });
  },

  async createCourse(data: {
    title: string;
    description?: string;
    instructorId: string;
    thumbnail?: string;
    duration?: number;
    category?: string;
    status?: string;
  }) {
    return prisma.course.create({ data });
  },

  async updateCourse(id: string, data: Partial<{
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    category: string;
    status: string;
  }>) {
    return prisma.course.update({ where: { id }, data });
  },

  async deleteCourse(id: string) {
    return prisma.course.delete({ where: { id } });
  },

  async getLessons(courseId: string) {
    return prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: { quizzes: true },
    });
  },

  async getLessonById(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
      include: { quizzes: true, course: true },
    });
  },

  async createLesson(data: {
    courseId: string;
    title: string;
    content?: string;
    videoUrl?: string;
    duration?: number;
    order: number;
    type?: string;
  }) {
    return prisma.lesson.create({ data });
  },

  async updateLesson(id: string, data: Partial<{
    title: string;
    content: string;
    videoUrl: string;
    duration: number;
    order: number;
    type: string;
  }>) {
    return prisma.lesson.update({ where: { id }, data });
  },

  async deleteLesson(id: string) {
    return prisma.lesson.delete({ where: { id } });
  },

  async getQuizzes(lessonId: string) {
    return prisma.quiz.findMany({ where: { lessonId } });
  },

  async getQuizById(id: string) {
    return prisma.quiz.findUnique({
      where: { id },
      include: { lesson: { include: { course: true } } },
    });
  },

  async createQuiz(data: {
    lessonId: string;
    title: string;
    questions: any;
    timeLimit?: number;
    passingScore?: number;
  }) {
    return prisma.quiz.create({ data: data as any });
  },

  async updateQuiz(id: string, data: Partial<{
    title: string;
    questions: any;
    timeLimit: number;
    passingScore: number;
  }>) {
    return prisma.quiz.update({ where: { id }, data });
  },

  async deleteQuiz(id: string) {
    return prisma.quiz.delete({ where: { id } });
  },

  async submitQuizAttempt(data: {
    userId: string;
    quizId: string;
    answers: any;
  }) {
    const quiz = await prisma.quiz.findUnique({ where: { id: data.quizId } });
    if (!quiz) throw new Error('Quiz not found');

    const questions = quiz.questions as any[];
    let correct = 0;
    questions.forEach((q, i) => {
      if (data.answers[i] === q.correctAnswer) correct++;
    });
    const score = (correct / questions.length) * 100;
    const passed = score >= (quiz.passingScore || 70);

    return prisma.quizAttempt.create({
      data: {
        userId: data.userId,
        quizId: data.quizId,
        answers: data.answers,
        score,
        passed,
        completedAt: new Date(),
      },
    });
  },

  async getQuizAttempts(userId: string, quizId: string) {
    return prisma.quizAttempt.findMany({
      where: { userId, quizId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async enrollInCourse(userId: string, courseId: string) {
    return prisma.enrollment.create({
      data: { userId, courseId },
    });
  },

  async getEnrollments(userId: string) {
    try {
      return await prisma.enrollment.findMany({
        where: { userId },
        include: { course: { include: { instructor: { select: { name: true } } } } },
        orderBy: { enrolledAt: 'desc' },
      });
    } catch (error) {
      console.error('DB Error in getEnrollments, falling back to mocks:', error.message);
      return [];
    }
  },

  async getEnrollment(userId: string, courseId: string) {
    return prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: { include: { lessons: true } } },
    });
  },

  async updateProgress(userId: string, courseId: string, progress: number) {
    const enrollment = await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { progress },
    });

    if (progress >= 100) {
      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { completedAt: new Date(), status: 'completed' },
      });
    }

    return enrollment;
  },

  async getMyCourses(userId: string) {
    try {
      return await prisma.enrollment.findMany({
        where: { userId },
        include: { 
          course: { 
            include: { 
              instructor: { select: { name: true } },
              lessons: true,
            } 
          } 
        },
      });
    } catch (error) {
      console.error('DB Error in getMyCourses, falling back to mocks:', error.message);
      return [];
    }
  },

  async generateCertificate(userId: string, courseId: string) {
    const existing = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    if (existing) return existing;

    const certNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    return prisma.certificate.create({
      data: { userId, courseId, certificateNumber: certNumber },
    });
  },

  async getCertificates(userId: string) {
    return prisma.certificate.findMany({
      where: { userId },
      include: { course: { select: { title: true, thumbnail: true } } },
      orderBy: { issuedAt: 'desc' },
    });
  },

  async getCertificateById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
      include: { 
        user: { select: { name: true, email: true } },
        course: { include: { instructor: { select: { name: true } } } },
      },
    });
  },

  async getLearningPaths() {
    try {
      return await prisma.learningPath.findMany({
        include: { 
          enrollments: { where: { userId: undefined as any } },
          _count: { select: { enrollments: true } },
        },
      });
    } catch (error) {
      console.error('DB Error in getLearningPaths, falling back to mocks:', error.message);
      return MOCK_LEARNING_PATHS;
    }
  },

  async getLearningPathById(id: string) {
    return prisma.learningPath.findUnique({
      where: { id },
      include: { enrollments: true },
    });
  },

  async createLearningPath(data: {
    title: string;
    description?: string;
    courses: string[];
    thumbnail?: string;
  }) {
    return prisma.learningPath.create({ data });
  },

  async updateLearningPath(id: string, data: Partial<{
    title: string;
    description: string;
    courses: string[];
    thumbnail: string;
  }>) {
    return prisma.learningPath.update({ where: { id }, data });
  },

  async enrollInLearningPath(userId: string, learningPathId: string) {
    return prisma.learningPathEnrollment.create({
      data: { userId, learningPathId },
    });
  },

  async getMyLearningPaths(userId: string) {
    return prisma.learningPathEnrollment.findMany({
      where: { userId },
      include: { learningPath: true },
    });
  },

  async getCategories() {
    try {
      const courses = await prisma.course.findMany({
        select: { category: true },
        distinct: ['category'],
        where: { category: { not: null } },
      });
      return courses.map(c => c.category).filter(Boolean);
    } catch (error) {
      console.error('DB Error in getCategories, falling back to mocks:', error.message);
      return MOCK_CATEGORIES;
    }
  },
};

export default lmsService;
