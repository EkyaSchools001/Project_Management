import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@pdi/lib/api";
import { useAuth } from "@pdi/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pdi/components/ui/table";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, ClipboardList, CheckCircle2, XCircle, ArrowRight, Search, Calendar, MapPin, Activity, Filter, ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@pdi/lib/utils";
import { Input } from "@pdi/components/ui/input";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@pdi/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";

export default function TeacherAttendance() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter states
    const [nameFilter, setNameFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Get unique locations for filter
    const locations = Array.from(new Set(events.map(e => e.location).filter(Boolean)));

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

    // Filter events:
    // 1. Status is Completed or Live or attendance enabled
    // 2. School matches
    // 3. User is registered
    const relevantEvents = events.filter(e => {
        if (!user?.id) return false;

        const userId = user.id;
        const campusId = user.campusId;
        const userEmail = user.email?.toLowerCase();

        // 1. Is the user explicitly registered?
        // Check multiple possible ID fields for robustness
        const isRegistered = e.registrants?.some((r: any) =>
            (r.id === userId) ||
            (r.userId === userId) ||
            (r.email?.toLowerCase() === userEmail)
        ) || e.registrations?.some((reg: any) =>
            (reg.userId === userId) ||
            (reg.user?.id === userId) ||
            (reg.user?.email?.toLowerCase() === userEmail)
        );

        // 2. Is this an observation scheduled for this specific teacher?
        const isTargetTeacher = e.teacherId === userId ||
            (e.teacherEmail?.toLowerCase() === userEmail) ||
            (e.teacherName?.toLowerCase().includes(user.fullName.toLowerCase()));

        // 3. Does it belong to the user's school / campus?
        const isGlobal = !e.schoolId || e.schoolId === "" || e.schoolId.toLowerCase() === "all";
        const isMySchool = campusId && e.schoolId === campusId;

        // 4. Important: Exclude Observations from Attendance Markings
        const isObservation = 
            (e.entryType && e.entryType.toLowerCase().includes('observation')) || 
            (e.type && e.type.toLowerCase().includes('observation'));
        
        if (isObservation) return false;

        // Important: Registered events should ALWAYS show regardless of school/campus
        return isRegistered || isTargetTeacher || isGlobal || isMySchool;
    });

    // Apply inline filters
    const filteredEvents = relevantEvents.filter(e => {
        const matchesName = !nameFilter || 
            e.title.toLowerCase().includes(nameFilter.toLowerCase()) || 
            (e.topic || "").toLowerCase().includes(nameFilter.toLowerCase());
        const matchesDate = !dateFilter || format(new Date(e.date), "MMM d, yyyy").toLowerCase().includes(dateFilter.toLowerCase());
        const matchesLocation = locationFilter === "all" || e.location === locationFilter;
        
        let eStatus = "not_enabled";
        if (e.attendanceClosed) eStatus = "closed";
        else if (e.attendanceEnabled) eStatus = "live";
        const matchesStatus = statusFilter === "all" || eStatus === statusFilter;

        return matchesName && matchesDate && matchesLocation && matchesStatus;
    });

    // Sort by date desc
    const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Attendance
                    </h1>
                    <p className="text-zinc-900 mt-2">
                        Mark your attendance for completed training sessions.
                    </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                    <ClipboardList className="w-6 h-6 text-primary" />
                </div>
            </div>

            <Card className="  shadow-premium bg-card backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="text-zinc-900 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">Event Name</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                        <Search className={cn("h-3 w-3", nameFilter && "text-primary")} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-64 p-2">
                                                    <div className="p-2">
                                                        <Input 
                                                            placeholder="Search by name or topic..." 
                                                            className="h-8 text-xs mb-2"
                                                            value={nameFilter}
                                                            onChange={(e) => setNameFilter(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <Button 
                                                            variant="ghost" 
                                                            className="w-full justify-start text-xs h-8"
                                                            onClick={() => setNameFilter("")}
                                                        >
                                                            Clear
                                                        </Button>
                                                    </div>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableHead>
                                    
                                    {/* Date Filter Dropdown */}
                                    <TableHead className="text-zinc-900 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">Date</span>
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

                                    {/* Location Filter Dropdown */}
                                    <TableHead className="text-zinc-900 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">Location</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                        <MapPin className={cn("h-3 w-3", locationFilter !== "all" && "text-primary")} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-48">
                                                    <DropdownMenuItem onClick={() => setLocationFilter("all")}>All Locations</DropdownMenuItem>
                                                    {locations.map(loc => (
                                                        <DropdownMenuItem key={loc} onClick={() => setLocationFilter(loc)}>
                                                            {loc}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableHead>

                                    {/* Status Filter Dropdown */}
                                    <TableHead className="text-zinc-900 py-4">
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
                                                    <DropdownMenuItem onClick={() => setStatusFilter("live")}>Live</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setStatusFilter("not_enabled")}>Upcoming</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableHead>

                                    <TableHead className="text-right text-zinc-900 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="font-bold">Action</span>
                                            {(nameFilter || dateFilter || locationFilter !== "all" || statusFilter !== "all") && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-primary hover:bg-primary/5"
                                                    onClick={() => {
                                                        setNameFilter("");
                                                        setDateFilter("");
                                                        setLocationFilter("all");
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
                                {sortedEvents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-zinc-900">
                                            No completed events found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedEvents.map((event) => (
                                        <TableRow key={event.id} className="hover:bg-muted/30 border-border transition-colors">
                                            <TableCell className="font-medium text-foreground">
                                                {event.title}
                                                <div className="text-xs text-zinc-900">{event.topic}</div>
                                            </TableCell>
                                            <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                                            <TableCell>{event.location}</TableCell>
                                            <TableCell>
                                                {event.attendanceClosed ? (
                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">Closed</Badge>
                                                ) : event.attendanceEnabled ? (
                                                    <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 animate-pulse">Live</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-gray-500/10 text-gray-400 border-gray-500/20">Not Enabled</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => navigate(`/teacher/attendance/${event.id}`)}
                                                    disabled={!event.attendanceEnabled || event.attendanceClosed}
                                                    className={event.attendanceEnabled && !event.attendanceClosed
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                        : "bg-muted text-zinc-900 hover:bg-muted"}
                                                >
                                                    Mark Attendance
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
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
