import React, { useState, useEffect } from 'react';
import { ScrollToTop } from '@pdi/components/ui/ScrollToTop';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { Button } from '@pdi/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Label } from '@pdi/components/ui/label';
import { Input } from '@pdi/components/ui/input';
import { Textarea } from '@pdi/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@pdi/components/ui/radio-group';
import { Checkbox } from '@pdi/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { surveyService, Survey, SurveyQuestion } from '@pdi/services/surveyService';

interface SurveyWizardProps {
    survey: Survey;
    initialAnswers?: any[];
    onComplete: () => void;
}

const QuestionRenderer = ({ question }: { question: SurveyQuestion }) => {
    const { register, setValue, watch, formState: { errors } } = useFormContext();
    const answerKey = `answers.${question.id}`;
    const error = errors.answers?.[question.id];

    let options: any = null;
    try {
        options = question.options ? JSON.parse(question.options) : null;
    } catch (e) {
        console.error("Error parsing options", e);
    }

    const currentVal = watch(answerKey);

    // Common wrapper for error message
    const ErrorMsg = () => error ? <p className="text-red-500 text-sm mt-1">This field is required</p> : null;

    switch (question.questionType) {
        case 'short_text':
            return (
                <div className="space-y-2 mb-6">
                    <Label>{question.questionText} {question.isRequired && <span className="text-red-500">*</span>}</Label>
                    <Input
                        {...register(answerKey, { required: question.isRequired })}
                        placeholder="Your answer"
                    />
                    <ErrorMsg />
                </div>
            );
        case 'long_text':
            return (
                <div className="space-y-2 mb-6">
                    <Label>{question.questionText} {question.isRequired && <span className="text-red-500">*</span>}</Label>
                    <Textarea
                        {...register(answerKey, { required: question.isRequired })}
                        placeholder="Your answer"
                        className="min-h-[100px]"
                    />
                    <ErrorMsg />
                </div>
            );
        case 'multiple_choice':
            return (
                <div className="space-y-2 mb-6">
                    <Label>{question.questionText} {question.isRequired && <span className="text-red-500">*</span>}</Label>
                    <RadioGroup
                        onValueChange={(val) => setValue(answerKey, val, { shouldValidate: true })}
                        defaultValue={currentVal}
                    >
                        {Array.isArray(options) && options.map((opt: string) => (
                            <div key={opt} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
                                <Label htmlFor={`${question.id}-${opt}`}>{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {/* Hidden input for validation */}
                    <input
                        type="hidden"
                        {...register(answerKey, { required: question.isRequired })}
                    />
                    <ErrorMsg />
                </div>
            );
        case 'multi_select':
            return (
                <div className="space-y-2 mb-6">
                    <Label>{question.questionText} {question.isRequired && <span className="text-red-500">*</span>}</Label>
                    <div className="grid grid-cols-1 gap-2">
                        {Array.isArray(options) && options.map((opt: string) => (
                            <div key={opt} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${question.id}-${opt}`}
                                    checked={Array.isArray(currentVal) && currentVal.includes(opt)}
                                    onCheckedChange={(checked) => {
                                        const current = Array.isArray(currentVal) ? currentVal : [];
                                        if (checked) {
                                            setValue(answerKey, [...current, opt], { shouldValidate: true });
                                        } else {
                                            setValue(answerKey, current.filter((v: string) => v !== opt), { shouldValidate: true });
                                        }
                                    }}
                                />
                                <Label htmlFor={`${question.id}-${opt}`}>{opt}</Label>
                            </div>
                        ))}
                    </div>
                    <input
                        type="hidden"
                        {...register(answerKey, { required: question.isRequired, validate: v => !question.isRequired || (v && v.length > 0) })}
                    />
                    <ErrorMsg />
                </div>
            );
        case 'rating_scale': {
            const min = options?.min || 1;
            const max = options?.max || 5;
            const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);

            return (
                <div className="space-y-2 mb-6">
                    <Label>{question.questionText} {question.isRequired && <span className="text-red-500">*</span>}</Label>
                    <div className="flex items-center gap-4">
                        {options?.lowLabel && <span className="text-sm text-muted-foreground">{options.lowLabel}</span>}
                        <div className="flex gap-2">
                            {range.map((val) => (
                                <Button
                                    key={val}
                                    type="button"
                                    variant={currentVal == val ? "default" : "outline"}
                                    className="w-10 h-10 rounded-full p-0"
                                    onClick={() => setValue(answerKey, val, { shouldValidate: true })}
                                >
                                    {val}
                                </Button>
                            ))}
                        </div>
                        {options?.highLabel && <span className="text-sm text-muted-foreground">{options.highLabel}</span>}
                    </div>
                    <input
                        type="hidden"
                        {...register(answerKey, { required: question.isRequired })}
                    />
                    <ErrorMsg />
                </div>
            );
        }
        case 'yes_no':
            return (
                <div className="space-y-2 mb-6">
                    <Label>{question.questionText} {question.isRequired && <span className="text-red-500">*</span>}</Label>
                    <RadioGroup
                        onValueChange={(val) => setValue(answerKey, val, { shouldValidate: true })}
                        defaultValue={currentVal}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id={`${question.id}-yes`} />
                            <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id={`${question.id}-no`} />
                            <Label htmlFor={`${question.id}-no`}>No</Label>
                        </div>
                    </RadioGroup>
                    <input
                        type="hidden"
                        {...register(answerKey, { required: question.isRequired })}
                    />
                    <ErrorMsg />
                </div>
            );

        default:
            return null;
    }
};

export const SurveyWizard = ({ survey, initialAnswers, onComplete }: SurveyWizardProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Group questions by page
    const questionsByPage = survey.questions.reduce((acc, q) => {
        if (!acc[q.pageNumber]) acc[q.pageNumber] = [];
        acc[q.pageNumber].push(q);
        return acc;
    }, {} as Record<number, SurveyQuestion[]>);

    const totalPages = Object.keys(questionsByPage).length;

    const methods = useForm({
        defaultValues: {
            answers: initialAnswers?.reduce((acc, ans) => {
                // Convert backend answer format to form format
                if (ans.answerNumeric !== null && ans.answerNumeric !== undefined) acc[ans.questionId] = ans.answerNumeric;
                else if (ans.answerJson) {
                    try {
                        acc[ans.questionId] = JSON.parse(ans.answerJson);
                    } catch (e) {
                        acc[ans.questionId] = ans.answerJson;
                    }
                }
                else acc[ans.questionId] = ans.answerText || "";
                return acc;
            }, {}) || {}
        }
    });

    const { handleSubmit, trigger, getValues, watch, formState: { isDirty } } = methods;
    const allAnswers = watch("answers");

    // Initialize to the last progress page if there are answers
    useEffect(() => {
        if (initialAnswers && initialAnswers.length > 0) {
            // Find the highest page number that has an answer
            const answeredQuestionIds = initialAnswers.map(a => a.questionId);
            let maxPage = 1;

            survey.questions.forEach(q => {
                if (answeredQuestionIds.includes(q.id)) {
                    maxPage = Math.max(maxPage, q.pageNumber);
                }
            });

            // If the last page is completed, we might want to stay there or stay on step 1 if editing?
            // Actually, stay on step 1 is safer, or jump to the first incomplete page.
            // Let's just default to the "furthest" reached page or step 1.
            setCurrentPage(maxPage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [survey.id]); // Only run on survey change/mount

    const formatAnswers = (answersData: any) => {
        return Object.keys(answersData).map(qId => {
            const val = answersData[qId];
            const q = survey.questions.find(q => q.id === qId);
            if (!q || val === undefined || val === null || val === "") return null;

            const ansObj: any = { questionId: qId };
            if (q.questionType === 'rating_scale') {
                ansObj.answerNumeric = Number(val);
            } else if (q.questionType === 'multi_select') {
                ansObj.answerJson = JSON.stringify(val);
            } else {
                ansObj.answerText = String(val);
            }
            return ansObj;
        }).filter(Boolean);
    };

    const saveDraft = async () => {
        const values = getValues();
        const formattedAnswers = formatAnswers(values.answers);

        if (formattedAnswers.length === 0) return;

        setIsSaving(true);
        try {
            await surveyService.submitSurvey(survey.id, formattedAnswers, false);
            setLastSaved(new Date());
        } catch (err) {
            console.error("Auto-save failed", err);
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save logic (debounced)
    useEffect(() => {
        if (!isDirty) return;

        const timer = setTimeout(() => {
            saveDraft();
        }, 3000);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allAnswers, isDirty]);

    const handleNext = async () => {
        // Validate current page fields
        const currentPageQuestions = questionsByPage[currentPage] || [];
        const fieldsToValidate = currentPageQuestions.map(q => `answers.${q.id}`);
        const isValid = await trigger(fieldsToValidate as any);

        if (isValid) {
            // Save progress when moving forward
            saveDraft();
            setCurrentPage(prev => Math.min(prev + 1, totalPages));
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const formattedAnswers = formatAnswers(data.answers);
            await surveyService.submitSurvey(survey.id, formattedAnswers, true);
            toast.success("Survey submitted successfully!");
            onComplete();
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit survey");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentPage / totalPages) * 100;

    return (
        <div className="max-w-5xl mx-auto py-4 px-0">
            <div className="space-y-6">
                <div className="px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4 max-w-sm">
                            <div className="text-sm text-muted-foreground">Step {currentPage} of {totalPages}</div>
                            <div className="w-1/2 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{survey.title}</h1>
                        <p className="text-muted-foreground">{survey.description}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-muted-foreground/10 self-start md:self-auto">
                        {isSaving ? (
                            <div className="flex items-center gap-1.5">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Saving draft...</span>
                            </div>
                        ) : lastSaved ? (
                            <div className="flex items-center gap-1.5 text-success">
                                <CheckCircle className="h-3 w-3" />
                                <span>Draft saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ) : (
                            <span>All changes auto-saved</span>
                        )}
                    </div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border shadow-sm">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mt-4">
                                {questionsByPage[currentPage]?.map(q => (
                                    <QuestionRenderer key={q.id} question={q} />
                                ))}
                            </div>

                            <div className="flex justify-between mt-8 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrev}
                                    disabled={currentPage === 1 || isSubmitting}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                </Button>

                                {currentPage < totalPages ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                    >
                                        Next <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Survey
                                    </Button>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
};
