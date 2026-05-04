import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export function ObservationReview({ observationId }: { observationId: string }) {
    const [observation, setObservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObservation = async () => {
            try {
                const res = await api.get(`/observations/${observationId}`);
                setObservation(res.data.data.observation);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchObservation();
    }, [observationId]);

    if (loading) return <div>Loading...</div>;
    if (!observation) return <div>Observation not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Observation Summary</h1>
                    <p className="text-slate-500">Record ID: {observation.id}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => handleExportPDF(observation)}>
                        <Download className="w-4 h-4" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Educator</p>
                            <p className="font-medium text-lg">{observation.teacher.fullName}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Observer</p>
                            <p className="font-medium text-lg">{observation.observerName || "Instructional Coach"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Grade & Subject</p>
                            <p className="font-medium">{observation.grade} - {observation.learningArea}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                            <p className="font-medium">{new Date(observation.date).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Overall Score</p>
                        <div className="text-5xl font-black text-primary">{observation.score}%</div>
                        <p className="text-sm text-slate-500 mt-2">Compliance Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance breakdown (if available) */}
            {observation.responses && (
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle>Domain Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-bold uppercase text-slate-500">Parameter</th>
                                    <th className="p-4 text-center text-xs font-bold uppercase text-slate-500">Rating</th>
                                    <th className="p-4 text-left text-xs font-bold uppercase text-slate-500">Observer Comments</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {observation.responses.map((r: any) => (
                                    <tr key={r.id}>
                                        <td className="p-4">
                                            <p className="font-medium text-sm">{r.parameter.name}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Badge className={cn(
                                                r.rating === 'YES' ? 'bg-emerald-500' :
                                                r.rating === 'PARTIAL' ? 'bg-amber-500' :
                                                'bg-rose-500'
                                            )}>
                                                {r.rating}
                                            </Badge>
                                        </td>
                                        <td className="p-4 italic text-sm text-slate-600">
                                            {r.comment || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {observation.tools && (
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 bg-slate-50 border-b">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Tools Observed</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-sm text-slate-700 leading-relaxed">{observation.tools}</p>
                        </CardContent>
                    </Card>
                )}
                {observation.routines && (
                    <Card className="shadow-sm">
                        <CardHeader className="py-3 bg-slate-50 border-b">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Routines & Procedures</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-sm text-slate-700 leading-relaxed">{observation.routines}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {observation.otherComment && (
                <Card className="shadow-sm">
                    <CardHeader className="py-3 bg-slate-50 border-b">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Additional Comments</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-sm text-slate-700 leading-relaxed">{observation.otherComment}</p>
                    </CardContent>
                </Card>
            )}

            {/* Glows & Grows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-emerald-100 bg-emerald-50/20">
                    <CardHeader>
                        <CardTitle className="text-emerald-700 text-sm font-black uppercase tracking-widest">Glows</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-slate-700">{observation.strengths || "No strengths recorded."}</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-100 bg-amber-50/20">
                    <CardHeader>
                        <CardTitle className="text-amber-700 text-sm font-black uppercase tracking-widest">Grows</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-slate-700">{observation.areasOfGrowth || "No growth areas recorded."}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Plan */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-primary text-sm font-black uppercase tracking-widest">Next Steps & Action Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-inner">
                        <p className="text-lg font-medium text-slate-800 leading-relaxed italic">
                            "There is scope for the teacher to work on <span className="text-primary font-bold underline decoration-primary/30">{observation.actionStep}</span>"
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Add PDF Export helper
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function handleExportPDF(observation: any) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(31, 40, 57);
    doc.text("Observation Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Record ID: ${observation.id}`, 14, 30);
    
    // Details Table
    autoTable(doc, {
        startY: 40,
        body: [
            ["Educator", observation.teacher.fullName],
            ["Observer", observation.observerName || "Instructional Coach"],
            ["Date", new Date(observation.date).toLocaleDateString()],
            ["Grade & Subject", `${observation.grade} - ${observation.learningArea}`],
            ["Overall Score", `${observation.score}%`]
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 }
    });

    // Responses Table
    if (observation.responses && observation.responses.length > 0) {
        doc.setFontSize(14);
        doc.text("Performance Rating Breakdown", 14, (doc as any).lastAutoTable.finalY + 15);
        
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [["Parameter", "Rating", "Comments"]],
            body: observation.responses.map((r: any) => [
                r.parameter.name,
                r.rating,
                r.comment || "—"
            ]),
            headStyles: { fillColor: [31, 40, 57], textColor: [255, 255, 255] },
            styles: { fontSize: 9 }
        });
    }

    // Glows, Grows, Action Steps
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text("Glows", 14, finalY);
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(observation.strengths || "—", 14, finalY + 7, { maxWidth: 180 });

    const growsY = finalY + 25;
    doc.setFontSize(12);
    doc.setTextColor(245, 158, 11); // Amber
    doc.text("Grows", 14, growsY);
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(observation.areasOfGrowth || "—", 14, growsY + 7, { maxWidth: 180 });

    const actionY = growsY + 25;
    doc.setFontSize(12);
    doc.setTextColor(225, 29, 72); // Primary
    doc.text("Action Plan", 14, actionY);
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`"There is scope for the teacher to work on ${observation.actionStep}"`, 14, actionY + 7, { maxWidth: 180 });

    doc.save(`Observation_${observation.teacher.fullName}_${observation.date}.pdf`);
}

function Button({ children, className, variant = "default", onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
                variant === "outline" ? "border border-slate-200 hover:bg-slate-50" : "bg-primary text-white hover:bg-primary/90",
                className
            )}
        >
            {children}
        </button>
    );
}
