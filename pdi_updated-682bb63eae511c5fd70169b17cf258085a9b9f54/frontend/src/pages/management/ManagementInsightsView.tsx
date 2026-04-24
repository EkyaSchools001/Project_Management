import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { Search, BookOpen, Award, Target, TrendingUp, CheckCircle2, UserCircle, Download, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

import { analyticsService } from '@/services/analyticsService';
import { learningFestivalService, LearningFestivalApplication } from '@/services/learningFestivalService';
import { CAMPUS_OPTIONS } from '@/lib/constants';

export function ManagementInsightsView() {
    const { user } = useAuth();
    const location = useLocation();

    // State
    const [teachersStats, setTeachersStats] = useState<any[]>([]);
    const [festivalApps, setFestivalApps] = useState<LearningFestivalApplication[]>([]);
    const [loading, setLoading] = useState(true);

    // Default tab based on path
    const getInitialTab = () => {
        if (location.pathname.includes('pdi-health')) return 'engagement';
        if (location.pathname.includes('campus-performance')) return 'applications';
        if (location.pathname.includes('pd-impact')) return 'shortlisted';
        if (location.pathname.includes('training-analytics')) return 'training';
        return 'engagement';
    };

    // Headers mapping
    const headerInfo = {
        engagement: {
            title: "TD Index: Learning Engagement",
            subtitle: "Network-wide overview of course enrollment and completion rates across all campuses."
        },
        applications: {
            title: "Campus Performance: Festival Demand",
            subtitle: "Analysis of Learning Festival applications and interest levels per campus."
        },
        shortlisted: {
            title: "TD Impact: Festival Outcomes",
            subtitle: "Final results and shortlisted candidates for the Learning Festival across the organization."
        },
        training: {
            title: "TD Efficacy: Training Analytics",
            subtitle: "Comprehensive overview of training attendance, compliance, and teacher feedback across the network."
        }
    };

    const [activeTab, setActiveTab] = useState<'engagement' | 'applications' | 'shortlisted' | 'training'>(getInitialTab());

    // Sync tab if path changes (e.g. clicking sidebar links while component is mounted)
    useEffect(() => {
        setActiveTab(getInitialTab());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [campusFilter, setCampusFilter] = useState('all');

    // New Training Data State
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [cutoffData, setCutoffData] = useState<any[]>([]);
    const [feedbackData, setFeedbackData] = useState<any>(null);

    useEffect(() => {
        fetchInsightsData();
         
    }, []);

    const fetchInsightsData = async () => {
        setLoading(true);
        try {
            const [engagementData, appsData, attData, cutData, feedData] = await Promise.all([
                analyticsService.getCampusEngagement(),
                learningFestivalService.getApplications(),
                analyticsService.getCampusAttendance(),
                analyticsService.getCutoffStats(20),
                analyticsService.getFeedbackAnalytics()
            ]);

            setTeachersStats(engagementData.teachers || []);
            setFestivalApps(appsData || []);
            setAttendanceData(attData.data.results || []);
            setCutoffData(cutData.data.results || []);
            setFeedbackData(feedData.data || null);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load management insights.");
        } finally {
            setLoading(false);
        }
    };

    // --- AGGREGATION LOGIC ---

    // 1. Campus-wise Engagement Data
    const campusEngagementData = useMemo(() => {
        const campusMap = new Map<string, { teachers: any[], totalEnrolled: number, totalCompleted: number }>();
        const validTeachers = teachersStats.filter(t => t.campusId);

        validTeachers.forEach(t => {
            if (!campusMap.has(t.campusId)) {
                campusMap.set(t.campusId, { teachers: [], totalEnrolled: 0, totalCompleted: 0 });
            }
            const data = campusMap.get(t.campusId)!;
            data.teachers.push(t);
            data.totalEnrolled += t.coursesEnrolled || 0;
            data.totalCompleted += t.coursesCompleted || 0;
        });

        const mapped = Array.from(campusMap.entries()).map(([campusId, data]) => {
            const activeTeachers = data.teachers.filter(t => t.isActive).length;
            const engagementSum = data.teachers.reduce((sum, t) => sum + (t.engagementPercent || 0), 0);
            const avgEngagement = data.teachers.length > 0 ? Math.round(engagementSum / data.teachers.length) : 0;

            let status: 'High' | 'Medium' | 'Low' = 'Low';
            if (avgEngagement >= 70) status = 'High';
            else if (avgEngagement >= 40) status = 'Medium';

            return {
                campusId,
                totalTeachers: data.teachers.length,
                activeTeachers,
                avgEngagement,
                coursesOffered: data.totalEnrolled, // For simplicity in mock logic
                coursesCompleted: data.totalCompleted,
                status
            };
        });

        return mapped.sort((a, b) => b.avgEngagement - a.avgEngagement);
    }, [teachersStats]);

    const globalEngagementSummary = useMemo(() => {
        const totalCampuses = campusEngagementData.length;
        const totalAvg = totalCampuses > 0
            ? Math.round(campusEngagementData.reduce((sum, c) => sum + c.avgEngagement, 0) / totalCampuses)
            : 0;
        const totalEnrolled = campusEngagementData.reduce((sum, c) => sum + c.coursesOffered, 0);
        const totalActive = campusEngagementData.reduce((sum, c) => sum + c.activeTeachers, 0);
        return { totalAvg, totalEnrolled, totalActive };
    }, [campusEngagementData]);

    // 2. Campus-wise Festival Applications
    const campusApplicationData = useMemo(() => {
        const campusMap = new Map<string, { total: number, underReview: number, shortlisted: number, rejected: number }>();

        festivalApps.forEach(app => {
            const campusId = app.user?.campusId || 'Unknown';
            if (!campusMap.has(campusId)) {
                campusMap.set(campusId, { total: 0, underReview: 0, shortlisted: 0, rejected: 0 });
            }
            const data = campusMap.get(campusId)!;
            data.total += 1;

            if (app.status === 'Under Review' || app.status === 'Submitted') data.underReview += 1;
            if (app.status === 'Shortlisted' || app.status === 'Confirmed') data.shortlisted += 1;
            if (app.status === 'Rejected') data.rejected += 1;
        });

        return Array.from(campusMap.entries()).map(([campusId, stats]) => ({
            campusId,
            ...stats
        })).sort((a, b) => b.total - a.total);
    }, [festivalApps]);

    // Filtered Lists for Drilldowns
    const filteredTeachers = teachersStats.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCampus = campusFilter === 'all' || t.campusId === campusFilter;
        return matchSearch && matchCampus;
    }).sort((a, b) => b.engagementPercent - a.engagementPercent);

    const filteredApps = festivalApps.filter(a => {
        const matchSearch = String(a.user?.fullName).toLowerCase().includes(searchQuery.toLowerCase());
        const matchCampus = campusFilter === 'all' || a.user?.campusId === campusFilter;
        return matchSearch && matchCampus;
    });

    const shortlistedApps = filteredApps.filter(a => a.status === 'Shortlisted' || a.status === 'Confirmed');

    const handleExport = () => {
        // Implement simulated CSV export by printing available table data to console / triggering print
        window.print();
        toast.success("Ready for print/PDF export");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title={headerInfo[activeTab].title}
                    subtitle={headerInfo[activeTab].subtitle}
                />
                <Button onClick={handleExport} variant="outline" className="gap-2 bg-white">
                    <Download className="w-4 h-4" />
                    Export PDF/CSV Segment
                </Button>
            </div>

            {/* Navigation Tabs - Hidden if accessing specific sub-module routes directly */}
            {!location.pathname.includes('pdi-health') && 
             !location.pathname.includes('campus-performance') && 
             !location.pathname.includes('pd-impact') && 
             !location.pathname.includes('training-analytics') && (
                <div className="flex overflow-x-auto gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                    <Button
                        variant={activeTab === 'engagement' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('engagement')}
                        className="gap-2 rounded-md"
                    >
                        <BookOpen className="w-4 h-4" />
                        TD Index
                    </Button>
                    <Button
                        variant={activeTab === 'applications' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('applications')}
                        className="gap-2 rounded-md"
                    >
                        <Award className="w-4 h-4" />
                        Campus Performance
                    </Button>
                    <Button
                        variant={activeTab === 'shortlisted' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('shortlisted')}
                        className="gap-2 rounded-md"
                    >
                        <Target className="w-4 h-4" />
                        TD Impact
                    </Button>
                    <Button
                        variant={activeTab === 'training' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('training')}
                        className="gap-2 rounded-md"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Training Analytics
                    </Button>
                </div>
            )}

            {/* --- SECTION 1: Self Paced Engagement (Aggregated) --- */}
            {activeTab === 'engagement' && (
                <div className="space-y-8 animate-in fade-in">

                    {/* Global KPI Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-indigo-50 to-white shadow-sm  ">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-zinc-950 capitalize">Overall Network Engagement</p>
                                        <h3 className="text-3xl font-black text-indigo-900 mt-2">
                                            {globalEngagementSummary.totalAvg}%
                                        </h3>
                                    </div>
                                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-zinc-950">Network Active Teachers</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                            {globalEngagementSummary.totalActive}
                                        </h3>
                                    </div>
                                    <UserCircle className="w-5 h-5 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-zinc-950">Total Course Enrollments</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                            {globalEngagementSummary.totalEnrolled}
                                        </h3>
                                    </div>
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Campus-Wise Engagement Aggregation */}
                    <Card className="shadow-sm border-primary/20 overflow-hidden">
                        <div className="p-4 bg-gray-50/50 border-b">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                                Campus-Wise Engagement Overviews
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-900 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Campus Name</th>
                                        <th className="px-6 py-4">Total Teachers</th>
                                        <th className="px-6 py-4">Active Teachers</th>
                                        <th className="px-6 py-4">Campus Avg Engagement</th>
                                        <th className="px-6 py-4">Engagement Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {campusEngagementData.map(c => (
                                        <tr key={c.campusId} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-indigo-900">{c.campusId}</td>
                                            <td className="px-6 py-4 font-medium">{c.totalTeachers}</td>
                                            <td className="px-6 py-4 text-emerald-600 font-medium">{c.activeTeachers}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-800 w-8">{c.avgEngagement}%</span>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 max-w-[100px]">
                                                        <div
                                                            className={`h-2 rounded-full ${c.avgEngagement >= 70 ? 'bg-emerald-500' : c.avgEngagement >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${c.avgEngagement}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={cn(
                                                    "px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-none text-white shadow-sm",
                                                    c.status === 'High' ? 'bg-emerald-600' :
                                                        c.status === 'Medium' ? 'bg-amber-500' :
                                                            'bg-rose-600'
                                                )}>{c.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Teacher-Wise Drill Drilldown */}
                    <div className="pt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                placeholder="Search teacher across network..."
                                className="max-w-xs bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Select value={campusFilter} onValueChange={setCampusFilter}>
                                <SelectTrigger className="w-[180px] bg-white">
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

                        <Card className="shadow-sm border-primary/20 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50/80 text-gray-900 font-bold border-b border-primary/20">
                                        <tr>
                                            <th className="px-6 py-4">Teacher Name</th>
                                            <th className="px-6 py-4">Campus</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Courses Enrolled</th>
                                            <th className="px-6 py-4">Engagement %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTeachers.slice(0, 50).map(teacher => ( // Limit view if large list for UI performance
                                            <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{teacher.name}</div>
                                                    <div className="text-xs text-gray-500">{teacher.email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-700">{teacher.campusId}</td>
                                                <td className="px-6 py-4 text-gray-600">{teacher.role}</td>
                                                <td className="px-6 py-4 font-medium">{teacher.coursesEnrolled}</td>
                                                <td className="px-6 py-4 font-bold text-indigo-600">{teacher.engagementPercent}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                </div>
            )}

            {/* --- SECTION 2: Learning Festival Application Demand --- */}
            {activeTab === 'applications' && (
                <div className="space-y-6 animate-in fade-in">

                    {/* Overall Summary */}
                    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50   shadow-sm">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-900">Network-Wide Festival Demand</h3>
                                <p className="text-sm text-indigo-700/70">Total application breakdown</p>
                            </div>
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-indigo-600">{festivalApps.length}</p>
                                    <p className="text-xs font-bold text-indigo-400 capitalize tracking-wider">Total Received</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-blue-600">{campusApplicationData.length}</p>
                                    <p className="text-xs font-bold text-blue-400 capitalize tracking-wider">Campuses Applied</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-yellow-600">{campusApplicationData.reduce((acc, c) => acc + c.underReview, 0)}</p>
                                    <p className="text-xs font-bold text-yellow-500 capitalize tracking-wider">Pending Campus Review</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Campus-Wise Breakdowns */}
                    <Card className="shadow-sm border-primary/20 overflow-hidden">
                        <div className="p-4 bg-gray-50/50 border-b">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-purple-500" />
                                Demand by Campus
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-900 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Campus Name</th>
                                        <th className="px-6 py-4">Total Applications</th>
                                        <th className="px-6 py-4">Under Review</th>
                                        <th className="px-6 py-4 text-emerald-600">Shortlisted</th>
                                        <th className="px-6 py-4 text-rose-600">Rejected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {campusApplicationData.map(c => (
                                        <tr key={c.campusId} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-indigo-900">{c.campusId}</td>
                                            <td className="px-6 py-4 font-bold text-purple-700">{c.total}</td>
                                            <td className="px-6 py-4 font-medium text-amber-600">{c.underReview}</td>
                                            <td className="px-6 py-4 font-medium text-emerald-600">{c.shortlisted}</td>
                                            <td className="px-6 py-4 font-medium text-rose-600">{c.rejected}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- SECTION 3: Shortlisted Outcomes (TD Impact) --- */}
            {activeTab === 'shortlisted' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            placeholder="Search shortlisted teacher..."
                            className="max-w-xs bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select value={campusFilter} onValueChange={setCampusFilter}>
                            <SelectTrigger className="w-[180px] bg-white">
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

                    <Card className="shadow-sm border-primary/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/80 text-gray-900 font-bold border-b border-primary/20">
                                    <tr>
                                        <th className="px-6 py-4">Teacher Name</th>
                                        <th className="px-6 py-4">Campus</th>
                                        <th className="px-6 py-4">Festival Name</th>
                                        <th className="px-6 py-4">Current Status</th>
                                        <th className="px-6 py-4">Campus Remarks (Read-Only)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {shortlistedApps.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-8 text-gray-400">No shortlisted teachers found.</td></tr>
                                    ) : (
                                        shortlistedApps.map(app => (
                                            <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{app.user?.fullName}</div>
                                                    <div className="text-[10px] text-gray-400">{app.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">{app.user?.campusId}</td>
                                                <td className="px-6 py-4 font-medium">{app.festival?.name}</td>
                                                <td className="px-6 py-4">
                                                    <Badge className="bg-emerald-600 hover:bg-emerald-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{app.status}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate">{app.feedback || '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- SECTION 4: Training Analytics Dashboard --- */}
            {activeTab === 'training' && (
                <div className="space-y-8 animate-in fade-in">

                    {/* Training KPI Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-zinc-950 uppercase">Avg Attendance Rate</p>
                                        <h3 className="text-3xl font-black text-blue-900 mt-2">
                                            {attendanceData.length > 0
                                                ? Math.round(attendanceData.reduce((acc, curr) => acc + curr.attendancePercent, 0) / attendanceData.length)
                                                : 0}%
                                        </h3>
                                    </div>
                                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-zinc-950 uppercase">Compliance (20h+)</p>
                                        <h3 className="text-3xl font-black text-emerald-900 mt-2">
                                            {cutoffData.length > 0
                                                ? Math.round(cutoffData.reduce((acc, curr) => acc + curr.abovePercent, 0) / cutoffData.length)
                                                : 0}%
                                        </h3>
                                    </div>
                                    <Award className="w-6 h-6 text-emerald-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-50 to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-zinc-950 uppercase">Avg Training Rating</p>
                                        <h3 className="text-3xl font-black text-amber-900 mt-2">
                                            {feedbackData?.globalAverage || 0}/5
                                        </h3>
                                    </div>
                                    <Target className="w-6 h-6 text-amber-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table 1: Campus Attendance */}
                    <Card className="shadow-sm border-primary/20 overflow-hidden">
                        <div className="p-4 bg-gray-50/50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                Campus Attendance Tracking
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700 border-none">Live Data</Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-900 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Campus Name</th>
                                        <th className="px-6 py-4">Registered</th>
                                        <th className="px-6 py-4">Attended</th>
                                        <th className="px-6 py-4">Attendance Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attendanceData.map((row: any) => (
                                        <tr key={row.campus} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{row.campus}</td>
                                            <td className="px-6 py-4">{row.registered}</td>
                                            <td className="px-6 py-4 font-medium text-blue-600">{row.attended}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-800 w-10">{row.attendancePercent}%</span>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 max-w-[120px]">
                                                        <div
                                                            className={`h-2 rounded-full ${row.attendancePercent >= 80 ? 'bg-emerald-500' : row.attendancePercent >= 60 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${row.attendancePercent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Table 2: PD Hours Compliance */}
                    <Card className="shadow-sm border-primary/20 overflow-hidden">
                        <div className="p-4 bg-gray-50/50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Award className="w-5 h-5 text-emerald-500" />
                                PD Hours Compliance (20h Cutoff)
                            </h3>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none">Academic Year</Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-900 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Campus Name</th>
                                        <th className="px-6 py-4">Total Teachers</th>
                                        <th className="px-6 py-4 text-emerald-600">Above Cutoff (%)</th>
                                        <th className="px-6 py-4 text-rose-600">Below Cutoff (%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cutoffData.map((row: any) => (
                                        <tr key={row.campus} className="hover:bg-emerald-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{row.campus}</td>
                                            <td className="px-6 py-4 font-medium">{row.total}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <span className="font-bold text-emerald-700">{row.abovePercent}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                    <span className="font-bold text-rose-700">{row.belowPercent}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Table 3: Training Feedback */}
                    <Card className="shadow-sm border-primary/20 overflow-hidden">
                        <div className="p-4 bg-gray-50/50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Search className="w-5 h-5 text-amber-500" />
                                Training Efficacy & Feedback
                            </h3>
                            <Badge className="bg-amber-100 text-amber-700 border-none">Survey Results</Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-900 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Training Event / Course Title</th>
                                        <th className="px-6 py-4">Feedback Count</th>
                                        <th className="px-6 py-4">Avg Rating</th>
                                        <th className="px-6 py-4">Quality Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {feedbackData?.events?.map((row: any) => (
                                        <tr key={row.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{row.title}</td>
                                            <td className="px-6 py-4">{row.feedbackCount}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-black text-amber-600">{row.avgRating}</span>
                                                    <span className="text-gray-400">/ 5.0</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={cn(
                                                    "px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-none text-white shadow-sm",
                                                    row.avgRating >= 4.5 ? 'bg-emerald-600' :
                                                        row.avgRating >= 3.5 ? 'bg-blue-600' :
                                                            'bg-amber-500'
                                                )}>
                                                    {row.avgRating >= 4.5 ? 'Excellent' : row.avgRating >= 3.5 ? 'Good' : 'Average'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {!feedbackData?.events?.length && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">No feedback data recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

        </div>
    );
}

