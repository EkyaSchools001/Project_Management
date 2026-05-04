import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Info, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const RUBRIC_EXPLANATIONS = [
    {
        rating: "Not Observed",
        description: "The indicator was either not applicable to this specific lesson or the observer did not have the opportunity to evaluate it during the designated timeframe.",
        color: "bg-slate-100 text-slate-700 border-slate-200"
    },
    {
        rating: "Basic",
        description: "Teacher attempts to implement the practice but does so inconsistently or with limited success. Characteristics include heavy reliance on traditional methods without active student engagement.",
        color: "bg-red-50 text-red-700 border-red-200"
    },
    {
        rating: "Developing",
        description: "Teacher applies the practice with partial success. While fundamental elements are present, execution may lack depth or fail to accommodate diverse student needs.",
        color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
        rating: "Effective",
        description: "Teacher consistently demonstrates successful implementation. The classroom functions smoothly, students are engaged, and the instructional outcomes are clearly met.",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
        rating: "Highly Effective",
        description: "Teacher masterfully executes the practice. Students take ownership of their learning, and the teacher seamlessly adapts to any classroom situation to ensure maximum growth.",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
];

export function ObservationRubricGuide() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 font-bold bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                    <BookOpen className="w-4 h-4" />
                    Rubric Guide & Explanations
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        </div>
                        <DialogTitle className="text-2xl">Evaluator's Rubric Guide</DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-zinc-600">
                        Use this standardized scale to maintain consistency across all Head of School, Coordinator, and Leadership evaluations based on the Ekya Danielson Framework adaptation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-zinc-50">
                                <TableRow>
                                    <TableHead className="w-[180px] font-bold text-zinc-900">Rating Scale</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Standardized Definition</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {RUBRIC_EXPLANATIONS.map((row, idx) => (
                                    <TableRow key={idx} className="hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="font-medium align-top pt-4">
                                            <Badge variant="outline" className={row.color + " font-bold px-3 py-1 shadow-sm uppercase tracking-wide text-xs"}>
                                                {row.rating}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pt-4 text-zinc-700 leading-relaxed">
                                            {row.description}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold mb-1">Consistency Matters</p>
                            <p>Evaluators should aim to provide objective, evidence-based ratings. When a rating of "Basic" or "Highly Effective" is given, the qualitative feedback section MUST include specific observable evidence explaining why the outer spectrum rating was selected.</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
