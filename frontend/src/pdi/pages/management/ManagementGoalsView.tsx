import React, { useState, useEffect } from 'react';
import { PageHeader } from '@pdi/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@pdi/components/ui/card';
import { Progress } from '@pdi/components/ui/progress';
import { Target, FileText } from 'lucide-react';
import { Badge } from '@pdi/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { CAMPUS_OPTIONS } from '@pdi/lib/constants';
import api from '@pdi/lib/api';

interface Goal {
    id: string;
    teacher: string;
    campus?: string;
    title: string;
    status: string;
    selfReflectionForm?: any;
    goalSettingForm?: any;
}

interface CampusStats {
    campus: string;
    totalGoals: number;
    reflectionFilled: number;
    settingFilled: number;
    completed: number;
    totalTeachers: number;
    reflectionPct: number;
    settingPct: number;
}

export function ManagementGoalsView() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [teacherCounts, setTeacherCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCampus, setSelectedCampus] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [goalsRes, countsRes] = await Promise.all([
                api.get('/goals'),
                api.get('/analytics/avg-hours-school')
            ]);
            
            if (goalsRes.data.status === 'success') {
                setGoals(goalsRes.data.data.goals || []);
            }
            
            if (countsRes.data.status === 'success' && countsRes.data.data?.results) {
                const countsMap: Record<string, number> = {};
                countsRes.data.data.results.forEach((r: any) => {
                    countsMap[r.campus] = r.teacherCount || 0;
                });
                setTeacherCounts(countsMap);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Group goals by campus (or fallback)
    const campusStats = React.useMemo<CampusStats[]>(() => {
        const initialGroup: Record<string, { totalGoals: number; reflectionFilled: number; settingFilled: number; completed: number }> = {};
        
        // Initialize all campuses
        CAMPUS_OPTIONS.forEach(campus => {
            initialGroup[campus] = { totalGoals: 0, reflectionFilled: 0, settingFilled: 0, completed: 0 };
        });

        const grouped = goals.reduce((acc, goal) => {
            const campus = goal.campus || "Unassigned";
            if (!acc[campus]) {
                acc[campus] = { totalGoals: 0, reflectionFilled: 0, settingFilled: 0, completed: 0 };
            }

            const isRefFilled = goal.selfReflectionForm && !goal.selfReflectionForm.includes('"adminOverride":true');
            const isSetFilled = goal.goalSettingForm && !goal.goalSettingForm.includes('"adminOverride":true');

            acc[campus].totalGoals += 1;
            if (isRefFilled) acc[campus].reflectionFilled += 1;
            if (isSetFilled) acc[campus].settingFilled += 1;
            if (goal.status === "COMPLETED") acc[campus].completed += 1;
            return acc;
        }, initialGroup);

        return Object.entries(grouped).map(([campus, value]) => {
            const stats = value;
            const tCount = teacherCounts[campus] || 0;
            return {
                campus,
                ...stats,
                totalTeachers: tCount,
                reflectionPct: tCount > 0 ? Math.round((stats.reflectionFilled / tCount) * 100) : 0,
                settingPct: tCount > 0 ? Math.round((stats.settingFilled / tCount) * 100) : 0,
            };
        });
    }, [goals, teacherCounts]);

    // Filter campus stats based on selected dropdown value
    const filteredCampusStats = React.useMemo(() => {
        if (selectedCampus === "all") return campusStats;
        return campusStats.filter(stat => stat.campus === selectedCampus);
    }, [campusStats, selectedCampus]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <PageHeader
                    title="Management: Goals Overview"
                    subtitle="Read-only view of goal setting, reflections, and metrics per campus"
                />
                <div className="flex items-center mt-2 md:mt-0">
                    <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="w-[200px] bg-white shadow-sm border-slate-200">
                            <SelectValue placeholder="All Campuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Campuses</SelectItem>
                            {CAMPUS_OPTIONS.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="col-span-full">
                    <h3 className="text-xl font-bold mb-4 text-slate-800">Campus Goal Metrics</h3>
                </div>
                {filteredCampusStats.map(stat => (
                    <Card key={stat.campus} className="shadow-xl bg-white/50 backdrop-blur-sm border-slate-100 transition-all hover:shadow-2xl">
                        <CardHeader className="border-b bg-slate-50/50 pb-4">
                            <CardTitle className="text-lg flex justify-between items-center text-slate-800">
                                <span className="font-black">{stat.campus}</span>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="bg-white shadow-sm border-slate-200 text-muted-foreground">{stat.totalGoals} Goals Active</Badge>
                                    <Badge variant="secondary" className="bg-card shadow-sm border-zinc-800 text-foreground hover:bg-slate-700">{stat.totalTeachers} Total Teachers</Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-700">
                                    <span className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-violet-100/50"><FileText className="w-4 h-4 text-violet-600" /></div>
                                        Self-Reflection Forms Filled
                                    </span>
                                    <span className="text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">{stat.reflectionPct}% ({stat.reflectionFilled}/{stat.totalTeachers})</span>
                                </div>
                                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                                     <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${stat.reflectionPct}%` }} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-700">
                                    <span className="flex items-center gap-2">
                                         <div className="p-1.5 rounded-md bg-violet-100/50"><Target className="w-4 h-4 text-blue-600" /></div>
                                         Goal Setting Forms Filled
                                    </span>
                                    <span className="text-blue-700 bg-violet-50 px-2 py-0.5 rounded-md">{stat.settingPct}% ({stat.settingFilled}/{stat.totalTeachers})</span>
                                </div>
                                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                                     <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${stat.settingPct}%` }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredCampusStats.length === 0 && !isLoading && (
                    <div className="col-span-full p-12 text-center text-muted-foreground border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">No campus data available.</div>
                )}
            </div>
        </div>
    );
}
