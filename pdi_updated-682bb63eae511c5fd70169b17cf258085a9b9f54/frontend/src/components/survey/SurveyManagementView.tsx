import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Survey, SurveyQuestion, surveyService } from '@/services/surveyService';
import { Edit, Trash2, Plus, GripVertical, Save, Sparkles, Loader2 } from 'lucide-react';
import { QuestionFormModal } from './QuestionFormModal';
import { toast } from 'sonner';
import { assessmentService } from '@/services/assessmentService';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface SurveyManagementViewProps {
    survey: Survey;
    onUpdate: () => void; // Callback to refresh data
}

export const SurveyManagementView = ({ survey, onUpdate }: SurveyManagementViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | undefined>(undefined);
    const [isUpdating, setIsUpdating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIGenerateSurvey = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const generated = await assessmentService.generateAIQuestions(aiPrompt, 3);
            if (generated && generated.length > 0) {
                // Loop through generated and create questions
                for (const q of generated) {
                    await surveyService.createQuestion(survey.id, {
                        questionText: q.prompt,
                        questionType: (q.type === 'MCQ' || q.type === 'MULTI_SELECT') ? 'multiple_choice' : 'long_text',
                        isRequired: true,
                        pageNumber: 1,
                        options: q.options
                    });
                }
                toast.success(`Generated ${generated.length} survey questions!`);
                setAiPrompt("");
                onUpdate();
            }
        } catch (error) {
            toast.error("Failed to generate survey questions");
        } finally {
            setIsGenerating(false);
        }
    };

    // Sort questions by page and order
    const sortedQuestions = [...survey.questions].sort((a, b) => {
        if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
        return a.orderIndex - b.orderIndex;
    });

    const handleAdd = () => {
        setEditingQuestion(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (q: SurveyQuestion) => {
        setEditingQuestion(q);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question? This will delete all collected answers for this question.')) return;

        try {
            await surveyService.deleteQuestion(id);
            toast.success('Question deleted');
            onUpdate();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete question');
        }
    };

    const handleSave = async (data: Partial<SurveyQuestion>) => {
        try {
            if (editingQuestion) {
                await surveyService.updateQuestion(editingQuestion.id, data);
                toast.success('Question updated');
            } else {
                await surveyService.createQuestion(survey.id, data as any);
                toast.success('Question added');
            }
            setIsModalOpen(false);
            onUpdate();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save question');
        }
    };

    const handleSurveyMetaUpdate = async (field: string, value: any) => {
        try {
            await surveyService.updateSurvey(survey.id, { [field]: value });
            toast.success('Survey updated');
            onUpdate();
        } catch (error) {
            toast.error('Failed to update survey');
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] mb-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold">Magic Survey Generator</h3>
                    </div>
                    <div className="flex gap-4">
                        <Textarea 
                            placeholder="What is this survey about? (e.g., 'Teacher well-being' or 'Digital literacy needs')"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-14 min-h-[56px] py-4 rounded-2xl flex-1 focus:border-primary/50"
                        />
                        <Button 
                            className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-6 font-bold gap-2 self-end shadow-lg"
                            onClick={handleAIGenerateSurvey}
                            disabled={isGenerating || !aiPrompt.trim()}
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Questions ({sortedQuestions.length})</h3>
                <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px] text-center">S.No.</TableHead>
                                <TableHead className="w-[80px]">Page</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead className="w-[150px]">Type</TableHead>
                                <TableHead className="w-[80px]">Req</TableHead>
                                <TableHead className="w-[120px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedQuestions.map((q, idx) => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium text-slate-500 text-center">{idx + 1}</TableCell>
                                    <TableCell>{q.pageNumber}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="line-clamp-2">{q.questionText}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs">
                                            {q.questionType.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {q.isRequired && <Badge variant="secondary" className="text-xs">Req</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(q.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sortedQuestions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No questions found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <QuestionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={editingQuestion}
            />
        </div>
    );
};
