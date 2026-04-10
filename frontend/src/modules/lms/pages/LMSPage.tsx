import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseCard } from '../components/CourseCard';
import { LearningPathCard } from '../components/LearningPathCard';
import lmsService from '@/services/lms.service';

export default function LMSPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, myCoursesRes, pathsRes, categoriesRes] = await Promise.all([
        lmsService.getCourses(),
        lmsService.getMyCourses(),
        lmsService.getLearningPaths(),
        lmsService.getCategories(),
      ]);
      setCourses(coursesRes.data?.data?.courses || []);
      setMyCourses(myCoursesRes.data?.data || []);
      setLearningPaths(pathsRes.data?.data || []);
      setCategories(categoriesRes.data?.data || []);
    } catch (error) {
      console.error('Error loading LMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await lmsService.getCourses({ 
        search: searchQuery, 
        category: selectedCategory || undefined 
      });
      setCourses(res.data?.data?.courses || []);
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await lmsService.enrollInCourse(courseId);
      loadData();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const handlePathEnroll = async (pathId: string) => {
    try {
      await lmsService.enrollInLearningPath(pathId);
      loadData();
    } catch (error) {
      console.error('Error enrolling in path:', error);
    }
  };

  const enrollmentsMap = new Map(myCourses.map(e => [e.courseId, e]));
  const pathEnrollmentsMap = new Map(
    myCourses.flatMap(e => e.learningPathEnrollments || []).map(e => [e.learningPathId, e])
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Learning Center</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input 
          placeholder="Search courses..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="md:w-80"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No courses found. Try a different search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollmentsMap.get(course.id)}
                  onEnroll={() => handleEnroll(course.id)}
                  onClick={() => navigate(`/lms/courses/${course.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-courses" className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading your courses...</div>
          ) : myCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              You haven't enrolled in any courses yet. Browse the catalog to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myCourses.map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  enrollment={enrollment}
                  onClick={() => navigate(`/lms/courses/${enrollment.courseId}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paths" className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading learning paths...</div>
          ) : learningPaths.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No learning paths available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  enrollment={pathEnrollmentsMap.get(path.id)}
                  onEnroll={() => handlePathEnroll(path.id)}
                  onClick={() => navigate(`/lms/paths/${path.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}