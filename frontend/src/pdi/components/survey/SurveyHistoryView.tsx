import React, { useEffect, useState } from 'react';
import { ScrollToTop } from '@pdi/components/ui/ScrollToTop';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Button } from '@pdi/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@pdi/components/ui/table';
import { Badge } from '@pdi/components/ui/badge';
import { Loader2, Eye, Calendar, ArrowLeft, Search, ChevronDown, ListFilter, XCircle } from 'lucide-react';
import { surveyService, SurveyResponse } from '@pdi/services/surveyService';
import { format } from 'date-fns';
import { cn } from '@pdi/lib/utils';
import { Input } from '@pdi/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@pdi/components/ui/dropdown-menu";

interface SurveyHistoryViewProps {
    onViewResponse: (response: SurveyResponse) => void;
    onBack: () => void;
}

export const SurveyHistoryView = ({ onViewResponse, onBack }: SurveyHistoryViewProps) => {
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [titleFilter, setTitleFilter] = useState("");
    const [academicYearFilter, setAcademicYearFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Get unique academic years for filter
    const academicYears = Array.from(new Set(responses.map(r => (r as any).survey?.academicYear).filter(Boolean))) as string[];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const data = await surveyService.getMyHistory();
                setResponses(data);
            } catch (err) {
                console.error("Failed to fetch survey history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Filter logic
    const filteredResponses = responses.filter(r => {
        const survey = (r as any).survey;
        const matchesTitle = !titleFilter || (survey?.title || "").toLowerCase().includes(titleFilter.toLowerCase());
        const matchesAcademicYear = academicYearFilter === "all" || survey?.academicYear === academicYearFilter;
        const matchesDate = !dateFilter || (r.submittedAt && format(new Date(r.submittedAt), 'PPP').toLowerCase().includes(dateFilter.toLowerCase()));
        
        // Status logic - responses are either completed or potentially pending (though history usually shows completed)
        const status = r.isCompleted ? "Completed" : "Pending";
        const matchesStatus = statusFilter === "all" || status.toLowerCase() === statusFilter.toLowerCase();

        return matchesTitle && matchesAcademicYear && matchesDate && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-2xl border shadow-sm sticky top-0 z-10 transition-all duration-300">
                <Button variant="ghost" onClick={onBack} size="sm" className="hover:bg-white/50">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">My Survey History</h2>
                </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px] text-center">S.No.</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">Survey Title</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                    <Search className={cn("h-3 w-3", titleFilter && "text-primary")} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-64 p-2">
                                                <div className="p-2">
                                                    <Input 
                                                        placeholder="Search title..." 
                                                        className="h-8 text-xs mb-2"
                                                        value={titleFilter}
                                                        onChange={(e) => setTitleFilter(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <Button 
                                                        variant="ghost" 
                                                        className="w-full justify-start text-xs h-8"
                                                        onClick={() => setTitleFilter("")}
                                                    >
                                                        Clear
                                                    </Button>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">Academic Year</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                    <ChevronDown className={cn("h-3 w-3", academicYearFilter !== "all" && "text-primary")} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-48">
                                                <DropdownMenuItem onClick={() => setAcademicYearFilter("all")}>All Years</DropdownMenuItem>
                                                {academicYears.map(year => (
                                                    <DropdownMenuItem key={year} onClick={() => setAcademicYearFilter(year)}>
                                                        {year}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableHead>
                                <TableHead>Term</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">Submitted Date</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                    <ChevronDown className={cn("h-3 w-3", dateFilter && "text-primary")} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-48 p-2">
                                                <div className="p-2">
                                                    <Input 
                                                        placeholder="Search date..." 
                                                        className="h-8 text-xs mb-2"
                                                        value={dateFilter}
                                                        onChange={(e) => setDateFilter(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <Button 
                                                        variant="ghost" 
                                                        className="w-full justify-start text-xs h-8"
                                                        onClick={() => setDateFilter("")}
                                                    >
                                                        Clear
                                                    </Button>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">Status</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                    <ListFilter className={cn("h-3 w-3", statusFilter !== "all" && "text-primary")} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableHead>
                                <TableHead className="text-right">
                                    <div className="flex items-center justify-end gap-2 pr-2">
                                        <span className="font-bold">Action</span>
                                        {(titleFilter || academicYearFilter !== "all" || dateFilter || statusFilter !== "all") && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-primary hover:bg-primary/5 rounded-full"
                                                onClick={() => {
                                                    setTitleFilter("");
                                                    setAcademicYearFilter("all");
                                                    setDateFilter("");
                                                    setStatusFilter("all");
                                                }}
                                                title="Clear All Filters"
                                            >
                                                <XCircle className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResponses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No surveys found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResponses.map((response, index) => (
                                    <TableRow key={response.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium text-slate-500 text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{(response as any).survey?.title || 'Untitled Survey'}</TableCell>
                                        <TableCell>{(response as any).survey?.academicYear}</TableCell>
                                        <TableCell>{(response as any).survey?.term}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {response.submittedAt ? format(new Date(response.submittedAt), 'PPP') : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={cn(
                                                "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-bold text-[10px] capitalize tracking-wider",
                                                !response.isCompleted && "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                            )}>
                                                {response.isCompleted ? "Completed" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onViewResponse(response)}
                                                className="font-bold text-xs"
                                            >
                                                <Eye className="h-3.5 w-3.5 mr-2" /> View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
};
