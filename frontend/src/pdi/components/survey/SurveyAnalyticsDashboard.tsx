import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pdi/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { Button } from '@pdi/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, Download, Filter, Eye } from 'lucide-react';
import { surveyService, Survey, SurveyAnalytics, SurveyAnswer } from '@pdi/services/surveyService';
import { toast } from 'sonner';
import { SurveyManagementView } from './SurveyManagementView';
import { useAuth } from '@pdi/hooks/useAuth';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@pdi/components/ui/table';
import { Badge } from '@pdi/components/ui/badge';
import { format } from 'date-fns';

interface SurveyAnalyticsDashboardProps {
    survey: Survey;
    onRefreshSurvey?: () => void;
}

export const SurveyAnalyticsDashboard = ({ survey, onRefreshSurvey }: SurveyAnalyticsDashboardProps) => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
    const [rawResponses, setRawResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampus, setSelectedCampus] = useState<string>('All');

    useEffect(() => {
        fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [survey.id]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [data, rawData] = await Promise.all([
                surveyService.getAnalytics(survey.id),
                surveyService.getRawResponses(survey.id)
            ]);
            setAnalytics(data);
            setRawResponses(rawData || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!analytics) return <div>No data available</div>;

    // Transform data for charts
    const completionData = analytics.completionStats.filter(s => selectedCampus === 'All' || s.campus === selectedCampus);

    // Find the leadership support score question (Q11 or similar)
    const leadershipQuestion = analytics.questionStats.find(q => 
        q.question.toLowerCase().includes('leadership') || 
        q.question.toLowerCase().includes('support') || 
        q.question.toLowerCase().includes('observation feedback')
    ) || analytics.questionStats[0]; // Fallback to first available numeric question if not found

    // Refresh function for the management view
    const handleSurveyUpdate = () => {
        fetchAnalytics(); // Re-fetch data which includes questions
        if (onRefreshSurvey) onRefreshSurvey(); // Notify parent to refresh survey meta-data
    };

    const handleExport = async () => {
        try {
            toast.info('Generating CSV...');
            const blob = await surveyService.exportResults(survey.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `survey_results_${survey.id}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            toast.success('Download started');
        } catch (error) {
            console.error(error);
            toast.error('Failed to export CSV');
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">Survey: {survey.title}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wider ${survey.isActive ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}>
                                {survey.isActive ? "Active" : "Closed"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{survey.academicYear} Term {survey.term}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Campus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Campuses</SelectItem>
                            {analytics.completionStats.map(s => (
                                <SelectItem key={s.campus} value={s.campus}>{s.campus}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {['ADMIN', 'SUPERADMIN'].includes(user?.role || '') && (
                        <>
                            <Button
                                variant={survey.isActive ? "outline" : "default"}
                                className={survey.isActive ? "text-red-600 border-red-200 hover:bg-red-50 font-bold" : "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"}
                                onClick={async () => {
                                    const action = survey.isActive ? 'Deactivate' : 'Activate';
                                    if (confirm(`${action} this survey? All active teachers will be notified automatically.`)) {
                                        try {
                                            await surveyService.updateSurvey(survey.id, { isActive: !survey.isActive });
                                            toast.success(`Survey ${!survey.isActive ? 'activated' : 'closed'} & teachers notified!`);
                                            handleSurveyUpdate();
                                        } catch (error) {
                                            toast.error(`Failed to ${action.toLowerCase()} survey`);
                                        }
                                    }
                                }}
                            >
                                {survey.isActive ? "Close & Notify" : "Activate & Notify"}
                            </Button>
                        </>
                    )}

                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
                    <TabsTrigger value="responses">Raw Responses</TabsTrigger>
                    {['ADMIN', 'SUPERADMIN'].includes(user?.role || '') && (
                        <TabsTrigger value="questions">Manage Questions</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Completion Rate Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Survey Completion Rate</CardTitle>
                                <CardDescription>Percentage of teachers who completed the survey</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={completionData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="campus" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Bar dataKey="rate" name="Completion %" fill="#8884d8">
                                            {completionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Leadership Support Score */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Campus Leadership Support Score</CardTitle>
                                <CardDescription>Avg. rating indicating School Leadership Support (1-5)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {leadershipQuestion ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={leadershipQuestion.data.filter(d => selectedCampus === 'All' || d.campus === selectedCampus)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="campus" />
                                            <YAxis domain={[0, 5]} />
                                            <Tooltip />
                                            <Bar dataKey="avg" name="Avg Score" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        Metric not found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* All Metrics Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Metrics by Question</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {analytics.questionStats.map((q, i) => (
                                    <div key={i} className="space-y-2">
                                        <h4 className="font-semibold text-sm">{q.question}</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {q.data.filter(d => selectedCampus === 'All' || d.campus === selectedCampus).map(d => (
                                                <div key={d.campus} className="bg-secondary/20 p-2 rounded text-xs">
                                                    <span className="font-medium">{d.campus}:</span> {d.avg.toFixed(1)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="responses" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Survey Submissions</CardTitle>
                            <CardDescription>View all raw survey responses submitted across campuses.</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table className="min-w-max">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Campus</TableHead>
                                        <TableHead>Date</TableHead>
                                        {survey.questions.map(q => (
                                            <TableHead key={q.id} className="max-w-[200px] truncate" title={q.questionText}>
                                                {q.questionText}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rawResponses.filter(r => selectedCampus === 'All' || r.user?.campusId === selectedCampus).map(response => (
                                        <TableRow key={response.id}>
                                            <TableCell>
                                                {survey.isAnonymous ? (
                                                    <Badge variant="outline">Anonymous</Badge>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{response.user?.fullName}</span>
                                                        <span className="text-xs text-muted-foreground">{response.user?.email}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{response.user?.campusId || 'Unassigned'}</TableCell>
                                            <TableCell>{response.submittedAt ? format(new Date(response.submittedAt), 'PPp') : ''}</TableCell>
                                            {survey.questions.map(q => {
                                                const ans = response.answers?.find((a: any) => a.question?.questionText === q.questionText);
                                                let ansText = "-";
                                                if (ans) {
                                                    ansText = ans.answerNumeric ? String(ans.answerNumeric) : (ans.answerText || ans.answerJson || "-");
                                                }
                                                return (
                                                    <TableCell key={q.id} className="max-w-[200px] truncate" title={ansText}>
                                                        {ansText}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                    {rawResponses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={survey.questions.length + 3} className="text-center py-8 text-muted-foreground">
                                                No responses retrieved yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {['ADMIN', 'SUPERADMIN'].includes(user?.role || '') && (
                    <TabsContent value="questions">
                        {/* Lazy load or just render */}
                        <SurveyManagementView survey={survey} onUpdate={handleSurveyUpdate} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
};
