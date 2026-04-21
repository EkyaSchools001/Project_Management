import { Request, Response } from 'express';
import { lmsService } from '../services/lms.service';

export const lmsController = {
  async getCourses(req: Request, res: Response) {
    try {
      const { status, category, search, limit, offset } = req.query;
      const result = await lmsService.getCourses({
        status: status as string,
        category: category as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getCourseById(req: Request, res: Response) {
    try {
      const course = await lmsService.getCourseById(req.params.i as string);
      if (!course) {
        return res.status(404).json({ status: 'error', message: 'Course not found' });
      }
      res.json({ status: 'success', data: course });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async createCourse(req: Request, res: Response) {
    try {
      const course = await lmsService.createCourse(req.body);
      res.status(201).json({ status: 'success', data: course });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateCourse(req: Request, res: Response) {
    try {
      const course = await lmsService.updateCourse(req.params.i as string, req.body);
      res.json({ status: 'success', data: course });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async deleteCourse(req: Request, res: Response) {
    try {
      await lmsService.deleteCourse(req.params.i as string);
      res.json({ status: 'success', message: 'Course deleted' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getLessons(req: Request, res: Response) {
    try {
      const lessons = await lmsService.getLessons(req.params.courseI as string);
      res.json({ status: 'success', data: lessons });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getLessonById(req: Request, res: Response) {
    try {
      const lesson = await lmsService.getLessonById(req.params.i as string);
      if (!lesson) {
        return res.status(404).json({ status: 'error', message: 'Lesson not found' });
      }
      res.json({ status: 'success', data: lesson });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async createLesson(req: Request, res: Response) {
    try {
      const lesson = await lmsService.createLesson(req.body);
      res.status(201).json({ status: 'success', data: lesson });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateLesson(req: Request, res: Response) {
    try {
      const lesson = await lmsService.updateLesson(req.params.i as string, req.body);
      res.json({ status: 'success', data: lesson });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async deleteLesson(req: Request, res: Response) {
    try {
      await lmsService.deleteLesson(req.params.i as string);
      res.json({ status: 'success', message: 'Lesson deleted' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getQuizzes(req: Request, res: Response) {
    try {
      const quizzes = await lmsService.getQuizzes(req.params.lessonI as string);
      res.json({ status: 'success', data: quizzes });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getQuizById(req: Request, res: Response) {
    try {
      const quiz = await lmsService.getQuizById(req.params.i as string);
      if (!quiz) {
        return res.status(404).json({ status: 'error', message: 'Quiz not found' });
      }
      res.json({ status: 'success', data: quiz });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async createQuiz(req: Request, res: Response) {
    try {
      const quiz = await lmsService.createQuiz(req.body);
      res.status(201).json({ status: 'success', data: quiz });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateQuiz(req: Request, res: Response) {
    try {
      const quiz = await lmsService.updateQuiz(req.params.i as string, req.body);
      res.json({ status: 'success', data: quiz });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async deleteQuiz(req: Request, res: Response) {
    try {
      await lmsService.deleteQuiz(req.params.i as string);
      res.json({ status: 'success', message: 'Quiz deleted' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async submitQuizAttempt(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.body.userId;
      const attempt = await lmsService.submitQuizAttempt({
        userId,
        quizId: req.params.quizI as string,
        answers: req.body.answers,
      });
      res.json({ status: 'success', data: attempt });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getQuizAttempts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const attempts = await lmsService.getQuizAttempts(userId, req.params.quizI as string);
      res.json({ status: 'success', data: attempts });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async enrollInCourse(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.body.userId;
      const enrollment = await lmsService.enrollInCourse(userId, req.params.courseI as string);
      res.status(201).json({ status: 'success', data: enrollment });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getMyEnrollments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const enrollments = await lmsService.getEnrollments(userId);
      res.json({ status: 'success', data: enrollments });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getEnrollment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const enrollment = await lmsService.getEnrollment(userId!, req.params.courseI as string);
      if (!enrollment) {
        return res.status(404).json({ status: 'error', message: 'Enrollment not found' });
      }
      res.json({ status: 'success', data: enrollment });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { progress } = req.body;
      const enrollment = await lmsService.updateProgress(userId!, req.params.courseI as string, progress);
      res.json({ status: 'success', data: enrollment });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getMyCourses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const courses = await lmsService.getMyCourses(userId!);
      res.json({ status: 'success', data: courses });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async generateCertificate(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const certificate = await lmsService.generateCertificate(userId!, req.params.courseI as string);
      res.json({ status: 'success', data: certificate });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getMyCertificates(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const certificates = await lmsService.getCertificates(userId!);
      res.json({ status: 'success', data: certificates });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getCertificateById(req: Request, res: Response) {
    try {
      const certificate = await lmsService.getCertificateById(req.params.i as string);
      if (!certificate) {
        return res.status(404).json({ status: 'error', message: 'Certificate not found' });
      }
      res.json({ status: 'success', data: certificate });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getLearningPaths(req: Request, res: Response) {
    try {
      const paths = await lmsService.getLearningPaths();
      res.json({ status: 'success', data: paths });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getLearningPathById(req: Request, res: Response) {
    try {
      const path = await lmsService.getLearningPathById(req.params.i as string);
      if (!path) {
        return res.status(404).json({ status: 'error', message: 'Learning path not found' });
      }
      res.json({ status: 'success', data: path });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async createLearningPath(req: Request, res: Response) {
    try {
      const path = await lmsService.createLearningPath(req.body);
      res.status(201).json({ status: 'success', data: path });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateLearningPath(req: Request, res: Response) {
    try {
      const path = await lmsService.updateLearningPath(req.params.i as string, req.body);
      res.json({ status: 'success', data: path });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async enrollInLearningPath(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const enrollment = await lmsService.enrollInLearningPath(userId!, req.params.pathI as string);
      res.status(201).json({ status: 'success', data: enrollment });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getMyLearningPaths(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const paths = await lmsService.getMyLearningPaths(userId!);
      res.json({ status: 'success', data: paths });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await lmsService.getCategories();
      res.json({ status: 'success', data: categories });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};

export default lmsController;