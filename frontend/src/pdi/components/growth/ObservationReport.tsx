import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import {
    Users, Calendar, MapPin, Star, MessageSquare,
    Lightbulb, Target, Settings, ClipboardCheck,
    BookOpen, CheckCircle2, AlertCircle, ChevronLeft
} from "lucide-react";
import { cn } from "@pdi/lib/utils";

interface ObservationReportProps {
    data: any;
    onBack: () => void;
}

export const ObservationReport: React.FC<ObservationReportProps> = ({ data, onBack }) => {
    // Helper to get rating color
    const getRatingColor = (rating: string | number) => {
        const r = typeof rating === 'string' ? rating : rating.toString();
        if (r.includes("Highly Effective") || r === "4") return "bg-emerald-500 text-white border-transparent";
        if (r.includes("Effective") || r === "3") return "bg-blue-500 text-white border-transparent";
        if (r.includes("Developing") || r === "2") return "bg-amber-500 text-white border-transparent";
        if (r.includes("Basic") || r === "1" || r.includes("Needs Improvement")) return "bg-rose-500 text-white border-transparent";
        return "bg-slate-200 text-slate-700 border-transparent shadow-none";
    };

    const isQuickFeedback = data.type === "Quick Feedback" || String(data.domain || data.moduleType).toUpperCase() === "QUICK FEEDBACK" || String(data.domain || data.moduleType).toUpperCase() === "QUICK_FEEDBACK";
    const overallRating = isQuickFeedback ? "N/A" : (data.overallRating || data.score || "N/A");

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header / Summary Card */}
            <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2rem]">
                <div className="h-3 bg-gradient-to-r from-[#B69D74] to-[#1F2839]" />
                <CardContent className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B69D74]/10 text-[#B69D74] text-[10px] font-black capitalize tracking-[0.2em]">
                                <Star className="w-3.5 h-3.5 fill-[#B69D74]" />
                                Observation Report
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#1F2839] tracking-tight leading-tight">
                                {data.teacherName || data.teacher || "Unnamed Teacher"}
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-600">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <Users className="w-4 h-4 text-[#B69D74]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Observer</span>
                                        <span className="font-bold text-slate-700">{data.observerName || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <Calendar className="w-4 h-4 text-[#1F2839]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Date</span>
                                        <span className="font-bold text-slate-700">{data.observationDate || data.date || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <MapPin className="w-4 h-4 text-[#B69D74]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Campus</span>
                                        <span className="font-bold text-slate-700">{data.campus || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                        <BookOpen className="w-4 h-4 text-[#1F2839]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Context</span>
                                        <span className="font-bold text-slate-700 line-clamp-1">{data.grade || "N/A"} - {data.section || "N/A"} ({data.learningArea || data.block || "N/A"})</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 min-w-[240px] shadow-inner">
                            <span className="text-[10px] font-black text-slate-400 capitalize tracking-[0.3em] mb-4">Final Rating</span>
                            <div className={cn(
                                "text-7xl font-black rounded-3xl px-8 py-4 shadow-2xl transition-transform hover:scale-105",
                                getRatingColor(overallRating)
                            )}>
                                {overallRating}
                            </div>
                            {typeof overallRating === 'string' && overallRating !== "N/A" && (
                                <div className="mt-4 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm">
                                    <span className="font-black text-slate-800 text-sm capitalize tracking-wider">{overallRating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Premium Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group">
                    <div className="h-1.5 bg-emerald-500 w-full" />
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-3 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Key Strengths</CardTitle>
                            <p className="text-xs text-slate-400 font-bold capitalize tracking-wider">Areas of Excellence</p>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 min-h-[120px]">
                            <p className="text-emerald-900 leading-relaxed font-medium whitespace-pre-wrap italic">
                                &ldquo;{data.strengths || data.feedback || "Positive feedback highlights will appear here."}&rdquo;
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group">
                    <div className="h-1.5 bg-amber-500 w-full" />
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-3 rounded-2xl bg-amber-500 shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Growth Areas</CardTitle>
                            <p className="text-xs text-slate-400 font-bold capitalize tracking-wider">Opportunity for Growth</p>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 min-h-[120px]">
                            <p className="text-amber-900 leading-relaxed font-medium whitespace-pre-wrap italic">
                                &ldquo;{data.areasOfGrowth || data.actionStep || data.actionSteps || "Action steps and growth goals will appear here."}&rdquo;
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Ratings Breakdown */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/40 p-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#1F2839] shadow-lg">
                            <ClipboardCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Observation Matrix</CardTitle>
                            <p className="text-xs text-slate-400 font-bold capitalize tracking-widest mt-1">Detailed Indicator Performance</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {/* Danielson Domains */}
                        {data.domains?.map((domain: any) => (
                            <div key={domain.domainId} className="p-8 space-y-6 hover:bg-slate-50/30 transition-colors">
                                <div className="flex justify-between items-center bg-slate-100/50 p-4 rounded-2xl">
                                    <h3 className="text-lg font-black text-[#1F2839] tracking-tight">{domain.title}</h3>
                                    {domain.evidence && <Badge className="bg-[#B69D74] text-white border-none text-[10px] font-black tracking-widest px-3 py-1">EVIDENCE LOGGED</Badge>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {domain.indicators?.map((indicator: any, i: number) => (
                                        <div key={i} className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-[#B69D74]/30 group">
                                            <span className="text-[11px] font-bold text-slate-500 capitalize tracking-tight mb-3 line-clamp-2 md:h-8">{indicator.name}</span>
                                            <Badge className={cn("self-start px-3 py-1 text-[10px] font-black tracking-wider transition-all", getRatingColor(indicator.rating))}>
                                                {indicator.rating}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                                {domain.evidence && (
                                    <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400 capitalize tracking-widest">Observer Evidence</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed italic">&ldquo;{domain.evidence}&rdquo;</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Traditional Structure (PA, VA, PE) */}
                        {['sectionA', 'sectionB', 'sectionC', 'sectionB1', 'sectionB2', 'sectionB3', 'sectionB4'].map(secKey => {
                            const section = data[secKey];
                            const evidence = data[`${secKey}Evidence`];
                            if (!section) return null;

                            return (
                                <div key={secKey} className="p-8 space-y-6 hover:bg-slate-50/30 transition-colors">
                                    <div className="flex justify-between items-center bg-slate-100/50 p-4 rounded-2xl">
                                        <h3 className="text-lg font-black text-[#1F2839] tracking-tight capitalize">
                                            {secKey.replace(/section([A-Z0-9].*)/, "Section $1")}
                                        </h3>
                                        {evidence && <Badge className="bg-[#B69D74] text-white border-none text-[10px] font-black tracking-widest px-3 py-1">EVIDENCE LOGGED</Badge>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(section).map(([statement, val]: any, i) => (
                                            <div key={i} className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-[#B69D74]/30 group">
                                                <span className="text-[11px] font-bold text-slate-500 capitalize tracking-tight mb-3 line-clamp-2 md:h-8">{statement}</span>
                                                <Badge className={cn("self-start px-3 py-1 text-[10px] font-black tracking-wider transition-all",
                                                    val === 'Yes' ? "bg-emerald-500 text-white" :
                                                        val === 'No' ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"
                                                )}>
                                                    {val}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    {evidence && (
                                        <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-400 capitalize tracking-widest">Observer Evidence</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">&ldquo;{evidence}&rdquo;</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Tools & Meta Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                        <CardTitle className="text-sm font-black flex items-center gap-3 text-[#1F2839] capitalize tracking-[0.15em]">
                            <Settings className="w-4 h-4 text-[#B69D74]" /> Observed Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-wrap gap-2.5">
                            {[...(data.routines || []), ...(data.cultureTools || []), ...(data.instructionalTools || []), ...(data.learningAreaTools || []), ...(data.studioHabits || []), ...(data.learningTools || []), ...(data.tools || [])].length > 0 ? (
                                [...(data.routines || []), ...(data.cultureTools || []), ...(data.instructionalTools || []), ...(data.learningAreaTools || []), ...(data.studioHabits || []), ...(data.learningTools || []), ...(data.tools || [])].map((item, i) => (
                                    <div key={i} className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-black capitalize tracking-wider transition-all hover:bg-[#1F2839] hover:text-white hover:scale-105 cursor-default">
                                        {item}
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-slate-400 italic flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" /> No specific tools or routines logged.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                        <CardTitle className="text-sm font-black flex items-center gap-3 text-[#1F2839] capitalize tracking-[0.15em]">
                            <Target className="w-4 h-4 text-[#B69D74]" /> Improvement Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-wrap gap-2.5">
                            {data.metaTags?.length > 0 ? (
                                data.metaTags.map((tag: string, i: number) => (
                                    <div key={i} className="px-4 py-1.5 rounded-full bg-[#1F2839] text-[#B69D74] text-[11px] font-black capitalize tracking-widest shadow-md transition-all hover:scale-110">
                                        {tag}
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-slate-400 italic flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" /> No focus tags assigned.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Footer */}
            <div className="flex flex-col items-center gap-10 pt-12">
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-slate-200" />
                        <div className="flex items-center gap-2 text-[#B69D74] text-[11px] font-black capitalize tracking-[0.4em]">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Report Finalized
                        </div>
                        <div className="h-px w-8 bg-slate-200" />
                    </div>
                    <p className="max-w-md text-slate-400 text-xs leading-relaxed font-medium">
                        This comprehensive dashboard reflects the finalized insights from the session on {data.observationDate || data.date || "the observation date"}.
                    </p>
                </div>

                <button
                    onClick={onBack}
                    className="group relative inline-flex items-center justify-center px-10 py-4 font-black text-white transition-all duration-300 bg-[#1F2839] rounded-2xl shadow-2xl hover:bg-[#B69D74] hover:shadow-[#B69D74]/50 focus:outline-none"
                >
                    <ChevronLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-2" />
                    RETURN TO TEACHER PROFILE
                </button>
            </div>
        </div>
    );
};
