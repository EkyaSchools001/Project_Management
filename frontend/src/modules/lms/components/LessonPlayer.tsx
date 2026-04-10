import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function LessonPlayer({ 
  lesson, 
  course, 
  onComplete,
  onNext,
  onPrevious 
}: { 
  lesson: any; 
  course: any;
  onComplete?: () => void; 
  onNext?: () => void; 
  onPrevious?: () => void;
}) {
  const [videoProgress, setVideoProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const lessons = course.lessons || [];
  const currentIndex = lessons.findIndex((l: any) => l.id === lesson.id);
  const hasNext = currentIndex < lessons.length - 1;
  const hasPrevious = currentIndex > 0;
  
  useEffect(() => {
    if (lesson.type === 'Video' && lesson.videoUrl) {
      const video = document.querySelector('video');
      if (video) {
        const handleTimeUpdate = () => {
          const progress = (video.currentTime / video.duration) * 100;
          setVideoProgress(progress);
          if (progress >= 90 && !completed) {
            setCompleted(true);
            onComplete?.();
          }
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    }
  }, [lesson, completed, onComplete]);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">{course.title}</p>
      </div>
      
      {lesson.type === 'Video' && lesson.videoUrl && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video 
            src={lesson.videoUrl} 
            controls 
            className="w-full h-full"
            onEnded={() => {
              setCompleted(true);
              onComplete?.();
            }}
          />
        </div>
      )}
      
      {lesson.type === 'Text' && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content || '' }}
            />
          </CardContent>
        </Card>
      )}
      
      {lesson.type === 'Quiz' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz: {lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Complete the quiz to proceed.
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Lesson Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Video Progress</p>
              <Progress value={videoProgress} />
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round(videoProgress)}% complete
              </p>
            </div>
            {completed && (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Lesson completed</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          Previous Lesson
        </Button>
        
        <div className="flex gap-2">
          {!completed && lesson.type !== 'Quiz' && (
            <Button variant="secondary" onClick={onComplete}>
              Mark as Complete
            </Button>
          )}
          {hasNext && (
            <Button onClick={onNext}>
              Next Lesson
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPlayer;