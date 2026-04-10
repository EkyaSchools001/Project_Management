// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { CourseDetail } from '../components/CourseDetail';
import lmsService from '@/services/lms.service';

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const [courseRes, enrollmentRes] = await Promise.all([
        lmsService.getCourseById(id!),
        lmsService.getEnrollment(id!).catch(() => null),
      ]);
      setCourse(courseRes.data?.data);
      setEnrollment(enrollmentRes.data?.data);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await lmsService.enrollInCourse(id!);
      loadCourse();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const handleLessonClick = (lesson: any) => {
    navigate(`/lms/lessons/${lesson.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <button 
        onClick={() => navigate('/lms')} 
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        ← Back to Learning Center
      </button>
      <CourseDetail
        course={course}
        enrollment={enrollment}
        onEnroll={handleEnroll}
        onLessonClick={handleLessonClick}
      />
    </div>
  );
}