import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Badge } from '@pdi/components/ui/badge';
import { Button } from '@pdi/components/ui/button';
import { Loader2, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Survey, SurveyResponse, surveyService } from '@pdi/services/surveyService';
import { useNavigate } from 'react-router-dom';
import { ScrollToTop } from '@pdi/components/ui/ScrollToTop';

interface SurveyResponseViewProps {
    survey: Survey;
    response: SurveyResponse;
    onEdit?: () => void;
    onRetake?: () => void;
}

export const SurveyResponseView = ({ survey, response, onEdit, onRetake }: SurveyResponseViewProps) => {
    const navigate = useNavigate();

    // Helper to find question text
    const getQuestion = (qId: string) => survey.questions?.find(q => q.id === qId);

    // Helper to format answer
    const formatAnswer = (ans: any) => {
        if (ans.answerText) return ans.answerText;
        if (ans.answerNumeric) return ans.answerNumeric;
        if (ans.answerJson) {
            try {
                const parsed = JSON.parse(ans.answerJson);
                if (Array.isArray(parsed)) return parsed.join(', ');
                return ans.answerJson;
            } catch {
                return ans.answerJson;
            }
        }
        return <span className="text-muted-foreground italic">No answer provided</span>;
    };

    return (
        <div className="max-w-5xl mx-auto py-4 px-0 space-y-6 relative">
            <div className="flex items-center justify-between bg-white/40 backdrop-blur-md p-4 rounded-2xl border shadow-sm sticky top-0 z-10 gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:bg-white/50 shrink-0">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    {onRetake && (
                        <Button variant="default" onClick={onRetake} className="gap-2 shrink-0 shadow-md">
                            <RefreshCcw className="h-4 w-4" />
                            New Survey
                        </Button>
                    )}
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                    {response.isCompleted ? 'Completed' : 'Draft'}
                </Badge>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border shadow-sm">
                <div className="mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{survey.title}</h1>
                    <p className="text-muted-foreground">
                        Submitted on {new Date(response.submittedAt).toLocaleDateString()} at {new Date(response.submittedAt).toLocaleTimeString()}
                    </p>
                </div>
                <div className="space-y-8">
                    {survey.questions?.sort((a, b) => a.orderIndex - b.orderIndex).map((q) => {
                        const answer = response.answers.find(a => a.questionId === q.id);
                        return (
                            <div key={q.id} className="border-b pb-4 last:border-0 border-primary/10">
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                    Q{q.orderIndex}. {q.questionText}
                                </h4>
                                <div className="text-base font-medium">
                                    {answer ? formatAnswer(answer) : <span className="text-muted-foreground">-</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
};
