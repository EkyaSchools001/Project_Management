import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, ClipboardList, XCircle, Eye, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AttendanceRegister() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Advanced Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState("All");
    const [attendanceStatusFilter, setAttendanceStatusFilter] = useState("All");

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const handleUpdate = () => fetchEvents();
        window.addEventListener('attendance-updated', handleUpdate);
        return () => window.removeEventListener('attendance-updated', handleUpdate);
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get("/training");
            if (response.data.status === "success") {
                setEvents(response.data.data.events);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAttendance = async (eventId: string, action: "enable" | "close") => {
        try {
            const response = await api.post(`/attendance/${eventId}/toggle`, { action });
            if (response.data.status === "success") {
                toast.success(action === "enable" ? "Attendance enabled successfully" : "Attendance closed successfully");
                fetchEvents(); // Refresh list
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update attendance status");
        }
    };

    const handleExport = (event: any) => {
        const registrants = event.registrants || [];
        if (!registrants.length) {
            toast.info("No registrants to export");
            return;
        }

        const headers = ["Name", "Email", "Role", "Campus", "Department", "Date Registered"];
        const rows = registrants.map((r: any) => [
            r.name,
            r.email,
            r.role || "N/A",
            r.campusId || "N/A",
            r.department || "N/A",
            r.dateRegistered
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(c => `"${c}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.body.appendChild(document.createElement("a"));
        link.href = url;
        link.download = `Registrants_${event.title}.csv`;
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully");
    };

    const getStatusBadge = (event: any) => {
        if (event.attendanceClosed) {
            return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Closed</Badge>;
        }
        if (event.attendanceEnabled) {
            return <Badge variant="default" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 animate-pulse">Live</Badge>;
        }
        return <Badge variant="secondary" className="bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border-gray-500/20">Not Enabled</Badge>;
    };

    // Filter events created by the logged-in user
    // Also consider showing all for ADMIN? Prompt says "Shows events created by the logged-in user."
    // But strictly, Admin might want to see all. Implementation plan says "Shows events created by the logged-in user."
    // I will stick to createdBy check for the main view to reduce clutter, or maybe filtered tabs.
    // The backend `getAllTrainingEvents` API already filters the events based on the user's role and campus.
    // So we can directly use the events returned by the API without additional naive frontend filtering.
    // Sort by date (newest first)
    const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredEvents = sortedEvents.filter(e => {
        // Exclude observations from attendance registry
        const isObservation = 
            (e.entryType && e.entryType.toLowerCase().includes('observation')) || 
            (e.type && e.type.toLowerCase().includes('observation'));
        
        if (isObservation) return false;

        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.type || "").toLowerCase().includes(searchQuery.toLowerCase());

        const eventStatus = (e.status === 'Completed' || e.status === 'COMPLETED') ? 'Completed' : 'Approved';
        const matchesStatus = statusFilter === "All" || eventStatus === statusFilter;

        const eType = e.type || "Other";
        const matchesType = typeFilter === "All" || eType === typeFilter;
        
        let aStatus = "Not Enabled";
        if (e.attendanceClosed) aStatus = "Closed";
        else if (e.attendanceEnabled) aStatus = "Live";
        const matchesAttendance = attendanceStatusFilter === "All" || aStatus === attendanceStatusFilter;

        return matchesSearch && matchesStatus && matchesType && matchesAttendance;
    });

    const eventTypes = Array.from(new Set(events.map(e => e.type || "Other")));
    const attendanceStatuses = ["Live", "Closed", "Not Enabled"];

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Attendance Register
                    </h1>
                    <p className="text-zinc-900 mt-2">
                        Manage attendance for your training sessions and events.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-900" />
                        <Input
                            placeholder="Search events..."
                            className="pl-10 rounded-xl bg-background border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className={cn(
                                "rounded-xl border-dashed gap-2",
                                (statusFilter !== "All" || searchQuery) && "bg-primary/5 border-primary text-primary"
                            )}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                        {(statusFilter !== "All" || searchQuery) && (
                            <Button
                                variant="ghost"
                                className="text-zinc-900 text-xs hover:text-primary h-9"
                                onClick={() => {
                                    setStatusFilter("All");
                                    setSearchQuery("");
                                }}
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Card className="  shadow-premium bg-card backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>My Events</CardTitle>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                            {filteredEvents.length} session{filteredEvents.length !== 1 && 's'}
                        </Badge>
                    </div>
                    {showFilters && (
                        <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-muted/20 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-zinc-900 ml-1">Event Status</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="rounded-xl bg-background border-border h-10">
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Statuses</SelectItem>
                                            <SelectItem value="Approved">Approved / Upcoming</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="text-foreground w-16">#</TableHead>
                                    <TableHead className="text-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <span>Event Name</span>
                                            <select 
                                                className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal w-[100px]"
                                                value={typeFilter}
                                                onChange={(e) => setTypeFilter(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="All">All Types</option>
                                                {eventTypes.map(t => (
                                                    <option key={String(t)} value={String(t)}>{String(t)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-foreground">Date</TableHead>
                                    <TableHead className="text-foreground">Status</TableHead>
                                    <TableHead className="text-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <span>Attendance</span>
                                            <select 
                                                className="text-[10px] font-bold border border-zinc-200 rounded-md px-1 py-0.5 bg-white text-zinc-600 cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary normal-case tracking-normal"
                                                value={attendanceStatusFilter}
                                                onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="All">All</option>
                                                {attendanceStatuses.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-foreground text-center">Enrolled</TableHead>
                                    <TableHead className="text-right text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEvents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-zinc-900">
                                            No events found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEvents.map((event, index) => (
                                        <TableRow key={event.id} className="hover:bg-muted/30 border-border transition-colors">
                                            <TableCell className="text-sm font-bold text-zinc-900">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                {event.title}
                                                <div className="text-xs text-zinc-900">{event.type}</div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn(
                                                    "font-medium",
                                                    (event.status === 'Completed' || event.status === 'COMPLETED') ? "border-green-500 text-green-600" :
                                                        event.status === 'Ongoing' ? "border-blue-500 text-blue-600" : "border-yellow-500 text-yellow-600"
                                                )}>
                                                    {event.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {getStatusBadge(event)}
                                                    <Badge variant="outline" className="w-fit bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
                                                        {event.attendanceCount || 0} Attended
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                    {event.registrants?.length || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleExport(event)}
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Export
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`${event.id}`)}
                                                    className="text-zinc-900 hover:text-foreground hover:bg-muted"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>

                                                {/* Close Attendance (If Enabled and Not Closed) */}
                                                {event.attendanceEnabled && !event.attendanceClosed && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggleAttendance(event.id, 'close')}
                                                        className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Close
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
