import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export function QuizPlayer({ 
  quiz, 
  onSubmit,
  onComplete 
}: { 
  quiz: any; 
  onSubmit?: (answers: any[], score: number, passed: boolean) => void;
  onComplete?: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 0);
  
  const questions = (quiz.questions as any[]) || [];
  const question = questions[currentQuestion];
  
  useEffect(() => {
    if (quiz.timeLimit && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz.timeLimit, submitted]);
  
  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answerIndex }));
  };
  
  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const score = (correct / questions.length) * 100;
    const passed = score >= (quiz.passingScore || 70);
    
    setSubmitted(true);
    onSubmit?.(Object.values(answers), score, passed);
    if (passed) onComplete?.();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (submitted) {
    const correct = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
    const score = (correct / questions.length) * 100;
    const passed = score >= (quiz.passingScore || 70);
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{passed ? 'Congratulations!' : 'Keep Trying!'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-primary">
            {Math.round(score)}%
          </div>
          <p className="text-lg">
            You got {correct} out of {questions.length} questions correct.
          </p>
          <div className={`text-xl font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? 'Passed' : 'Failed'}
          </div>
          <p className="text-muted-foreground">
            Passing score: {quiz.passingScore || 70}%
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      {quiz.timeLimit && timeLeft > 0 && (
        <Card className="mb-6">
          <CardContent className="py-3 flex justify-between items-center">
            <span className="text-muted-foreground">Time Remaining</span>
            <span className={`text-2xl font-mono ${timeLeft < 60 ? 'text-red-600' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{quiz.title}</CardTitle>
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question?.question}</h3>
            <RadioGroup 
              value={answers[currentQuestion]?.toString()} 
              onValueChange={(v) => handleAnswer(parseInt(v))}
            >
              {question?.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={answers[currentQuestion] === undefined}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuizPlayer;