import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CourseDetail({ 
  course, 
  enrollment, 
  onEnroll,
  onLessonClick 
}: { 
  course: any; 
  enrollment?: any; 
  onEnroll?: () => void; 
  onLessonClick?: (lesson: any) => void;
}) {
  const progress = enrollment?.progress || 0;
  const completedLessons = course.lessons?.filter((l: any) => l.completed)?.length || 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-6">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About this course</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {course.description || 'No description available.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="curriculum" className="mt-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <p className="text-muted-foreground">
                    {course.lessons?.length || 0} lessons
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.lessons?.map((lesson: any, index: number) => (
                      <div 
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer"
                        onClick={() => onLessonClick?.(lesson)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.duration && (
                              <p className="text-sm text-muted-foreground">
                                {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                              </p>
                            )}
                          </div>
                        </div>
                        {lesson.type && (
                          <Badge variant="outline">{lesson.type}</Badge>
                        )}
                      </div>
                    ))}
                    {(!course.lessons || course.lessons.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">
                        No lessons available yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructor" className="mt-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Instructor</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-slate-600">
                        {course.instructor?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{course.instructor?.name || 'Unknown'}</p>
                      <p className="text-muted-foreground">{course.instructor?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">{course.title}</h2>
              {course.category && <Badge>{course.category}</Badge>}
            </CardHeader>
            <CardContent className="space-y-4">
              {course.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                </div>
              )}
              
              {enrollment && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {completedLessons} of {course.lessons?.length || 0} lessons completed
                  </p>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>{course._count?.enrollments || 0} students enrolled</p>
              </div>
            </CardContent>
            <CardContent>
              {!enrollment && onEnroll && (
                <Button className="w-full" size="lg" onClick={onEnroll}>
                  Enroll Now
                </Button>
              )}
              {enrollment && progress < 100 && (
                <Button className="w-full" size="lg" onClick={() => onLessonClick?.(course.lessons?.[0])}>
                  Continue Learning
                </Button>
              )}
              {enrollment && progress >= 100 && (
                <Button className="w-full" size="lg" variant="secondary" disabled>
                  Course Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;