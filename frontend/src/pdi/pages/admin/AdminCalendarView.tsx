
import { useState, useEffect } from "react";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Button } from "@pdi/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Input } from "@pdi/components/ui/input";
import { Calendar as CalendarComponent } from "@pdi/components/ui/calendar";
import { Badge } from "@pdi/components/ui/badge";
import {
    Search, Plus, Filter, Clock, MapPin, Map, Users, Lock, Users2, CheckCircle2,
    Trash2, Trophy, Award, TrendingUp, AlertCircle, FileText, ChevronRight,
    Target
} from "lucide-react";
import { cn } from "@pdi/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@pdi/components/ui/dialog";
import { Label } from "@pdi/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@pdi/components/ui/popover";
import { Switch } from "@pdi/components/ui/switch";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@pdi/components/ui/table";
import { trainingService } from "@pdi/services/trainingService";
import { TIME_SLOTS } from "@pdi/lib/constants";

// Mock Data (Reusing structure for consistency)
const initialTrainingEvents = [
    {
        id: "1",
        title: "Differentiated Instruction Workshop",
        topic: "Pedagogy",
        type: "Pedagogy",
        date: "Feb 15, 2026",
        time: "09:00 AM",
        location: "Auditorium A",
        registered: 12,
        capacity: 20,
        status: "Approved",
        spotsLeft: 8,
        isAdminCreated: true,
        registrants: [
            { id: "u1", name: "Teacher One", email: "teacher1.btmlayout@pdi.com", dateRegistered: "Jan 12, 2026" },
            { id: "u2", name: "Teacher Two", email: "teacher2.jpnagar@pdi.com", dateRegistered: "Jan 14, 2026" },
            { id: "u3", name: "Teacher Three", email: "teacher3.itpl@pdi.com", dateRegistered: "Jan 15, 2026" },
        ]
    },
    {
        id: "2",
        title: "Digital Literacy in Classroom",
        topic: "Technology",
        type: "Technology",
        date: "Feb 18, 2026",
        time: "02:00 PM",
        location: "Computer Lab 1",
        registered: 18,
        capacity: 25,
        status: "Approved",
        spotsLeft: 7,
        isAdminCreated: true,
        registrants: [
            { id: "u4", name: "Teacher Three", email: "teacher3.itpl@pdi.com", dateRegistered: "Jan 20, 2026" },
            { id: "u5", name: "Teacher Two", email: "teacher2.jpnagar@pdi.com", dateRegistered: "Jan 21, 2026" },
        ]
    },
    { id: "3", title: "Social-Emotional Learning Hub", topic: "Culture", type: "Culture", date: "Feb 22, 2026", time: "11:00 AM", location: "Conference Room B", registered: 8, capacity: 15, status: "Approved", spotsLeft: 7, isAdminCreated: true, registrants: [] },
    { id: "4", title: "Advanced Formative Assessment", topic: "Assessment", type: "Assessment", date: "Feb 25, 2026", time: "03:30 PM", location: "Main Library", registered: 15, capacity: 20, status: "Pending", spotsLeft: 5, isAdminCreated: true, registrants: [] },
];

export function AdminCalendarView() {
    const [training, setTraining] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const events = await trainingService.getAllEvents();
            setTraining(events || []);
        } catch (error) {
            console.error("Failed to fetch training events", error);
            toast.error("Failed to load events from server");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedCampus, setSelectedCampus] = useState<string>("all");
    const [date, setDate] = useState<Date | undefined>(new Date()); // Default to today
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isRegistrantsOpen, setIsRegistrantsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const [selectedRegistrants, setSelectedRegistrants] = useState<any[]>([]);
    const [newEvent, setNewEvent] = useState({
        title: "",
        type: "Pedagogy",
        date: new Date(),
        time: "09:00 AM",
        location: "",
        targetGroup: "All Staff",
        schoolId: "all",
        isRecurring: false,
        frequency: "Once"
    });

    // Helper to format Date object to "MMM d, yyyy" string
    const formatDateStr = (d: Date) => {
        return format(d, "MMM d, yyyy");
    };

    const handleScheduleEvent = async () => {
        if (!newEvent.title || !newEvent.date) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            const eventData = {
                title: newEvent.title,
                type: newEvent.type,
                topic: newEvent.type, // Backend uses both topic and type
                date: formatDateStr(newEvent.date),
                time: newEvent.time,
                location: newEvent.location,
                capacity: 30, // Default capacity
                status: "Approved",
                targetGroup: newEvent.targetGroup,
                schoolId: newEvent.schoolId === 'all' ? null : newEvent.schoolId,
                isRecurring: newEvent.isRecurring,
                frequency: newEvent.isRecurring ? newEvent.frequency : "Once"
            };

            await trainingService.createEvent(eventData);

            // Refresh list from server
            await fetchEvents();

            setIsScheduleOpen(false);
            setNewEvent({
                title: "",
                type: "Pedagogy",
                date: new Date(),
                time: "09:00 AM",
                location: "",
                targetGroup: "All Staff",
                schoolId: "all",
                isRecurring: false,
                frequency: "Once"
            });
            toast.success("Event scheduled successfully");
        } catch (error) {
            console.error("Error scheduling event:", error);
            toast.error("Failed to schedule event on server");
        }
    };

    const handleEditEvent = async () => {
        if (!currentEvent?.title || !currentEvent?.date) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            const updatedData = {
                ...currentEvent,
                date: typeof currentEvent.date === 'string' ? currentEvent.date : formatDateStr(currentEvent.date),
                topic: currentEvent.type // Sync topic with type
            };

            const savedEvent = await trainingService.updateEvent(currentEvent.id, updatedData);

            setTraining(training.map((t: any) => t.id === savedEvent.id ? savedEvent : t));
            setIsEditOpen(false);
            toast.success("Event updated successfully");
        } catch (error) {
            console.error("Failed to update event", error);
            toast.error("Failed to update event");
        }
    };

    const handleDeleteEvent = async () => {
        if (!currentEvent) return;
        try {
            await trainingService.deleteEvent(currentEvent.id);
            setTraining(training.filter(t => t.id !== currentEvent.id));
            setIsDeleteOpen(false);
            toast.success("Event deleted successfully");
        } catch (error) {
            console.error("Failed to delete event", error);
            toast.error("Failed to delete event");
        }
    };

    const handleToggleAttendance = async (eventId: string, action: 'enable' | 'close') => {
        try {
            const updatedEvent = await trainingService.toggleAttendance(eventId, action);
            setTraining(training.map((ev: any) => ev.id === eventId ? { ...ev, ...updatedEvent } : ev));
            if (currentEvent && currentEvent.id === eventId) {
                setCurrentEvent({ ...currentEvent, ...updatedEvent });
            }
            toast.success(`Attendance ${action === 'enable' ? 'enabled' : 'closed'} successfully`);
        } catch (error) {
            console.error(`Failed to ${action} attendance:`, error);
            toast.error(`Failed to ${action} attendance`);
        }
    };

    const handleManageSession = (event: any) => {
        setCurrentEvent({
            ...event,
            type: event.type || event.topic || "Pedagogy",
            topic: event.topic || event.type || "Pedagogy"
        });
        setIsEditOpen(true);
    }

    const handleViewRegistrants = (event: any) => {
        setSelectedRegistrants(event.registrants || []);
        setCurrentEvent(event);
        setIsRegistrantsOpen(true);
    }

    // Helper to parse "MMM d, yyyy" string to Date object
    const parseEventDate = (dateStr: string) => {
        try {
            const parts = dateStr.includes(',') ? dateStr : `${dateStr}, 2026`;
            return new Date(parts);
        } catch (e) {
            return new Date();
        }
    };

    const filteredEvents = training.filter((e: any) => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.topic || e.type || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === "all" || (e.topic || e.type || "").toLowerCase() === selectedType.toLowerCase();

        const matchesCampus = selectedCampus === "all" ||
            (e.schoolId === selectedCampus) ||
            (e.campusId === selectedCampus) ||
            (e.location?.toLowerCase().includes(selectedCampus.toLowerCase()));

        let matchesDate = true;
        if (date) {
            matchesDate = e.date === formatDateStr(date);
        }

        return matchesSearch && matchesType && matchesCampus && matchesDate;
    });

    const campuses = [
        { id: "all", name: "All Campuses" },
        { id: "EBTM", name: "BTM Layout" },
        { id: "EJPN", name: "JP Nagar" },
        { id: "EITPL", name: "ITPL" },
        { id: "ENICE", name: "NICE Road" },
        { id: "EKRP", name: "Kanakapura Road" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Training Calendar"
                subtitle="Schedule and manage Teacher Development sessions"
                actions={
                    <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule Training Event</DialogTitle>
                                <DialogDescription>Add a new session to the training calendar.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="event-title">Event Title</Label>
                                    <Input id="event-title" placeholder="Workshop Name" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-type">Type</Label>
                                        <Select value={newEvent.type} onValueChange={v => setNewEvent({ ...newEvent, type: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Assessment">Assessment</SelectItem>
                                                <SelectItem value="Culture">Culture</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !newEvent.date && "text-muted-foreground"
                                                    )}
                                                >
                                                    {newEvent.date ? (
                                                        formatDateStr(newEvent.date)
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={newEvent.date}
                                                    onSelect={(d) => d && setNewEvent({ ...newEvent, date: d })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-time">Time</Label>
                                        <Select
                                            value={newEvent.time}
                                            onValueChange={(val) => setNewEvent({ ...newEvent, time: val })}
                                        >
                                            <SelectTrigger id="event-time">
                                                <SelectValue placeholder="Select Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIME_SLOTS.map((slot) => (
                                                    <SelectItem key={slot} value={slot}>
                                                        {slot}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-location">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="event-location" className="pl-9" placeholder="Room/Lab" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-target">Target Group</Label>
                                        <Select value={newEvent.targetGroup} onValueChange={v => setNewEvent({ ...newEvent, targetGroup: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All Staff">All Staff</SelectItem>
                                                <SelectItem value="Early Years">Early Years</SelectItem>
                                                <SelectItem value="Primary">Primary</SelectItem>
                                                <SelectItem value="Middle School">Middle School</SelectItem>
                                                <SelectItem value="High School">High School</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-campus">Campus</Label>
                                        <Select value={newEvent.schoolId} onValueChange={v => setNewEvent({ ...newEvent, schoolId: v })}>
                                            <SelectTrigger id="event-campus">
                                                <SelectValue placeholder="Select Campus" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {campuses.map(campus => (
                                                    <SelectItem key={campus.id} value={campus.id}>{campus.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="event-recursion" className="flex items-center justify-between">
                                        Recurring Event
                                        <Switch
                                            checked={newEvent.isRecurring}
                                            onCheckedChange={v => setNewEvent({ ...newEvent, isRecurring: v })}
                                        />
                                    </Label>
                                    {newEvent.isRecurring && (
                                        <Select value={newEvent.frequency} onValueChange={v => setNewEvent({ ...newEvent, frequency: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                                <Button onClick={handleScheduleEvent}>Schedule</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="flex flex-col gap-8">
                {/* Calendar Widget - Refactored to Horizontal Layout */}
                <Card className="  shadow-2xl bg-zinc-950 text-white overflow-hidden relative">
                    {/* decorative gradient blob */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-20 -translate-x-20 pointer-events-none" />

                    <CardContent className="p-8 md:p-10 relative z-10">
                        <div className="flex flex-col gap-10">
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                                <div className="text-left">
                                    <h3 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent tracking-tighter">
                                        Activity Summary
                                    </h3>
                                    <p className="text-zinc-500 text-sm capitalize tracking-[0.3em] font-bold mt-2">
                                        {formatDateStr(new Date())}
                                    </p>
                                </div>

                                {/* Compact Legend Overlay */}
                                <div className="flex flex-wrap items-center gap-6 bg-zinc-900/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-zinc-800/50">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pedagogy</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Technology</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Assessment</span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Width Grid Calendar */}
                            <div className="w-full">
                                <CalendarComponent
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="p-0 w-full"
                                    formatters={{
                                        formatWeekdayName: (day) => format(day, 'EEEE')
                                    }}
                                    classNames={{
                                        months: "w-full",
                                        month: "space-y-0 w-full",
                                        caption: "hidden", 
                                        month_grid: "w-full border-collapse border border-zinc-800/50 rounded-[2rem] overflow-hidden bg-zinc-900/20",
                                        weekdays: "grid grid-cols-7 w-full bg-zinc-900/80 border-b border-zinc-800/50",
                                        weekday: "text-zinc-500 font-black text-[10px] uppercase tracking-[0.25em] py-6 border-r last:border-r-0 border-zinc-800/30 flex items-center justify-center",
                                        week: "grid grid-cols-7 w-full border-b border-zinc-800/30 last:border-b-0",
                                        day: "min-h-[140px] p-4 relative border-r last:border-r-0 border-zinc-800/30 hover:bg-zinc-800/20 transition-all cursor-pointer group [&:has([aria-selected])]:bg-primary/5",
                                        day_button: "h-10 w-10 flex items-center justify-center font-black text-sm text-zinc-400 group-hover:text-white aria-selected:bg-primary aria-selected:text-white rounded-xl transition-all shadow-sm mx-auto",
                                        selected: "bg-primary text-white shadow-lg shadow-primary/20 scale-110",
                                        today: "bg-zinc-800 text-white ring-2 ring-zinc-700/50 ring-offset-2 ring-offset-zinc-900",
                                        outside: "text-zinc-700 opacity-20",
                                    }}
                                    modifiers={{
                                        pedagogy: training.filter((e: any) => (e.topic || e.type) === "Pedagogy").map((e: any) => parseEventDate(e.date)),
                                        technology: training.filter((e: any) => (e.topic || e.type) === "Technology").map((e: any) => parseEventDate(e.date)),
                                        assessment: training.filter((e: any) => (e.topic || e.type) === "Assessment").map((e: any) => parseEventDate(e.date)),
                                        other: training.filter((e: any) => !["Pedagogy", "Technology", "Assessment"].includes(e.topic || e.type)).map((e: any) => parseEventDate(e.date)),
                                    }}
                                    modifiersStyles={{
                                        pedagogy: { borderLeft: '4px solid #3b82f6' },
                                        technology: { borderLeft: '4px solid #10b981' },
                                        assessment: { borderLeft: '4px solid #f43f5e' },
                                        other: { borderLeft: '4px solid #eab308' }
                                    }}
                                />
                            </div>

                            {/* Bottom Actions Bar */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                        Tip: Select a date to view scheduled sessions
                                    </div>
                                    {date && (
                                        <Button
                                            variant="ghost"
                                            className="text-primary hover:text-primary/80 hover:bg-primary/10 font-bold text-xs uppercase tracking-widest px-4"
                                            onClick={() => setDate(undefined)}
                                        >
                                            Clear Selection
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 py-1.5 px-4 rounded-xl font-bold">
                                        {training.length} Sessions Total
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Events List - Fixed duplication */}
                <Card className="  shadow-2xl bg-background/60 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-muted/20">
                    <CardHeader className="px-8 py-8 border-b bg-muted/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <CardTitle className="text-2xl font-black text-foreground tracking-tight">
                                    {date ? `Sessions for ${formatDateStr(date)}` : "Upcoming Training Sessions"}
                                </CardTitle>
                                <p className="text-sm font-medium text-muted-foreground mt-1">
                                    {filteredEvents.length} session{filteredEvents.length !== 1 && 's'} identified for this period
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                                    <SelectTrigger className="w-[180px] h-12 bg-muted/40 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <SelectValue placeholder="All Campuses" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campuses.map(campus => (
                                            <SelectItem key={campus.id} value={campus.id}>{campus.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-[180px] h-12 bg-muted/40 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all font-medium">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4" />
                                            <SelectValue placeholder="All Types" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Assessment">Assessment</SelectItem>
                                        <SelectItem value="Culture">Culture</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Search sessions..."
                                        className="pl-12 w-[280px] h-12 bg-muted/40 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/10 border-b">
                                        <th className="text-left px-8 py-5 text-xs font-black capitalize tracking-[0.2em] text-muted-foreground/70">Session Details</th>
                                        <th className="text-left px-8 py-5 text-xs font-black capitalize tracking-[0.2em] text-muted-foreground/70">Type</th>
                                        <th className="text-left px-8 py-5 text-xs font-black capitalize tracking-[0.2em] text-muted-foreground/70">Time & Location</th>
                                        <th className="text-left px-8 py-5 text-xs font-black capitalize tracking-[0.2em] text-muted-foreground/70">Status</th>
                                        <th className="text-right px-8 py-5 text-xs font-black capitalize tracking-[0.2em] text-muted-foreground/70">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted/10">
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map((session) => (
                                            <tr key={session.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                <td className="px-8 py-7">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{session.title}</span>
                                                        {!date && <span className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-1.5 capitalize tracking-wide">
                                                            <Clock className="w-3 h-3" /> {session.date}
                                                        </span>}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <Badge variant="outline" className="px-3 py-1 rounded-lg text-[10px] font-black capitalize tracking-widest bg-primary/5 text-primary border-primary/20">
                                                        {session.topic || session.type}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-bold text-foreground flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                                                <Clock className="w-4 h-4 text-orange-500" />
                                                            </div>
                                                            {session.time}
                                                        </div>
                                                        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2.5 pl-0.5">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            {session.location}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <span className={cn(
                                                        "inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black capitalize tracking-widest border shadow-sm",
                                                        session.status === "Approved"
                                                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                                                            : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                                                    )}>
                                                        {session.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-7 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 px-4 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold flex items-center gap-2"
                                                            onClick={() => handleViewRegistrants(session)}
                                                        >
                                                            <Users className="w-4 h-4" />
                                                            Registrants
                                                        </Button>
                                                        <Button variant="ghost" className="h-10 px-6 rounded-xl hover:bg-primary hover:text-white transition-all font-bold" onClick={() => handleManageSession(session)}>
                                                            Manage
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground">
                                                        <Users className="w-8 h-8" />
                                                    </div>
                                                    <p className="text-muted-foreground font-bold italic">No sessions found for this selection.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Event Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Training Event</DialogTitle>
                        <DialogDescription>Modify the details of this Teacher Development session.</DialogDescription>
                    </DialogHeader>
                    {currentEvent && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-event-title">Event Title</Label>
                                <Input id="edit-event-title" value={currentEvent.title} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-event-type">Type</Label>
                                    <Select
                                        value={currentEvent.type || currentEvent.topic}
                                        onValueChange={v => setCurrentEvent({ ...currentEvent, type: v, topic: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Assessment">Assessment</SelectItem>
                                            <SelectItem value="Culture">Culture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !currentEvent.date && "text-muted-foreground"
                                                )}
                                            >
                                                {currentEvent.date ? (
                                                    typeof currentEvent.date === 'string' ? currentEvent.date : formatDateStr(currentEvent.date)
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={typeof currentEvent.date === 'string' ? parseEventDate(currentEvent.date) : currentEvent.date}
                                                onSelect={(d) => d && setCurrentEvent({ ...currentEvent, date: d })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-event-time">Time</Label>
                                    <Select
                                        value={currentEvent.time}
                                        onValueChange={(val) => setCurrentEvent({ ...currentEvent, time: val })}
                                    >
                                        <SelectTrigger id="edit-event-time">
                                            <SelectValue placeholder="Select Time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_SLOTS.map((slot) => (
                                                <SelectItem key={slot} value={slot}>
                                                    {slot}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-event-location">Location</Label>
                                    <Input id="edit-event-location" value={currentEvent.location} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} />
                                </div>
                            </div>
                            <div className="pt-4 border-t mt-2">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/20 mb-4">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold flex items-center gap-2">
                                            <Users2 className="w-4 h-4 text-primary" />
                                            Attendance Control
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            Enable staff to mark their presence for this session.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 text-right">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "text-[10px] font-black capitalize tracking-tighter transition-colors",
                                                (currentEvent.attendanceEnabled && !currentEvent.attendanceClosed) ? "text-primary" : "text-muted-foreground"
                                            )}>
                                                {(currentEvent.attendanceEnabled && !currentEvent.attendanceClosed) ? "Live" : "Disabled"}
                                            </span>
                                            <Switch
                                                checked={currentEvent.attendanceEnabled && !currentEvent.attendanceClosed}
                                                onCheckedChange={(checked) => handleToggleAttendance(currentEvent.id, checked ? 'enable' : 'close')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="destructive" size="sm" className="w-full" onClick={() => { setIsEditOpen(false); setIsDeleteOpen(true); }}>
                                    Delete Event
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditEvent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Registrants Dialog */}
            <Dialog open={isRegistrantsOpen} onOpenChange={setIsRegistrantsOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-[2rem] overflow-hidden   shadow-2xl p-0">
                    <div className="bg-zinc-950 text-white p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                                Registered Participants
                            </h2>
                            <p className="text-zinc-400 font-medium text-sm mt-1 capitalize tracking-[0.2em]">
                                {currentEvent?.title}
                            </p>
                        </div>
                    </div>
                    <div className="p-8 bg-background">
                        <div className="rounded-2xl border border-muted/20 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/5">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-black capitalize tracking-widest text-[10px] py-4">Participant Name</TableHead>
                                        <TableHead className="font-black capitalize tracking-widest text-[10px] py-4">Contact Detail</TableHead>
                                        <TableHead className="font-black capitalize tracking-widest text-[10px] py-4 text-right">Registration Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedRegistrants.length > 0 ? (
                                        selectedRegistrants.map((registrant) => (
                                            <TableRow key={registrant.id} className="hover:bg-primary/5 transition-colors group">
                                                <TableCell className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                            {registrant.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </div>
                                                        <span className="font-bold text-foreground">{registrant.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-muted-foreground">{registrant.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 text-right font-medium text-muted-foreground">
                                                    {registrant.dateRegistered}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                    <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center">
                                                        <Users className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <p className="font-bold italic">No registrations for this event yet.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button
                                className="h-12 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black capitalize tracking-widest text-xs"
                                onClick={() => setIsRegistrantsOpen(false)}
                            >
                                Close View
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{currentEvent?.title}</strong>? This will remove it from the calendar for all staff members.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteEvent}>Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
