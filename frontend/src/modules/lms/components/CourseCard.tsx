import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function CourseCard({ 
  course, 
  enrollment, 
  onEnroll, 
  onClick 
}: { 
  course: any; 
  enrollment?: any; 
  onEnroll?: () => void; 
  onClick?: () => void;
}) {
  const progress = enrollment?.progress || 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-video bg-slate-100 relative">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        {course.category && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            {course.category}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{course.title}</h3>
        {course.instructor?.name && (
          <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        {course.duration && (
          <p className="text-sm text-muted-foreground">
            Duration: {Math.floor(course.duration / 60)}h {course.duration % 60}m
          </p>
        )}
        {enrollment ? (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        ) : (
          course._count?.enrollments !== undefined && (
            <p className="text-sm text-muted-foreground">
              {course._count.enrollments} enrolled
            </p>
          )
        )}
      </CardContent>
      
      <CardFooter>
        {!enrollment && onEnroll && (
          <Button className="w-full" onClick={(e) => { e.stopPropagation(); onEnroll(); }}>
            Enroll Now
          </Button>
        )}
        {enrollment && progress < 100 && (
          <Button className="w-full" variant="outline" onClick={onClick}>
            Continue Learning
          </Button>
        )}
        {enrollment && progress >= 100 && (
          <Button className="w-full" variant="secondary" disabled>
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default CourseCard;