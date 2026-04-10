import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function LearningPathCard({ 
  path,
  enrollment,
  onEnroll,
  onClick 
}: { 
  path: any; 
  enrollment?: any; 
  onEnroll?: () => void; 
  onClick?: () => void;
}) {
  const progress = enrollment?.progress || 0;
  const courseCount = path.courses?.length || 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100 relative">
        {path.thumbnail ? (
          <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-amber-500">
          {courseCount} Courses
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{path.title}</h3>
      </CardHeader>
      
      <CardContent className="pb-2">
        {path.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {path.description}
          </p>
        )}
        
        {enrollment ? (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{courseCount} courses in this path</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {!enrollment && onEnroll && (
          <Button className="w-full" onClick={(e) => { e.stopPropagation(); onEnroll(); }}>
            Start Learning Path
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

export default LearningPathCard;