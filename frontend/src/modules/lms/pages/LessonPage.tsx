import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '../components/LessonPlayer';
import { QuizPlayer } from '../components/QuizPlayer';
import lmsService from '@/services/lms.service';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      const lessonRes = await lmsService.getLessonById(id!);
      setLesson(lessonRes.data?.data);
      setCourse(lessonRes.data?.data?.course);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!course || !lesson) return;
    
    const totalLessons = course.lessons?.length || 1;
    const currentIndex = course.lessons?.findIndex((l: any) => l.id === lesson.id) || 0;
    const newProgress = ((currentIndex + 1) / totalLessons) * 100;
    
    try {
      await lmsService.updateProgress(course.id, newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNext = () => {
    if (!course || !lesson) return;
    const lessons = course.lessons || [];
    const currentIndex = lessons.findIndex((l: any) => l.id === lesson.id);
    if (currentIndex < lessons.length - 1) {
      navigate(`/lms/lessons/${lessons[currentIndex + 1].id}`);
    }
  };

  const handlePrevious = () => {
    if (!course || !lesson) return;
    const lessons = course.lessons || [];
    const currentIndex = lessons.findIndex((l: any) => l.id === lesson.id);
    if (currentIndex > 0) {
      navigate(`/lms/lessons/${lessons[currentIndex - 1].id}`);
    }
  };

  const handleQuizSubmit = async (answers: any[], score: number, passed: boolean) => {
    if (passed) {
      handleComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <button 
        onClick={() => navigate(`/lms/courses/${course?.id}`)} 
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        ← Back to Course
      </button>
      
      {lesson.quizzes && lesson.quizzes.length > 0 && lesson.type === 'Quiz' ? (
        <QuizPlayer 
          quiz={lesson.quizzes[0]} 
          onSubmit={handleQuizSubmit}
          onComplete={handleComplete}
        />
      ) : (
        <LessonPlayer
          lesson={lesson}
          course={course}
          onComplete={handleComplete}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}