
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Search, MapPin, Filter, Clock, Users, ArrowRight,
  TrendingUp, Calendar as CalendarIcon, Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { trainingService } from "@/services/trainingService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PDCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const campuses = [
    { id: "all", name: "All Campuses" },
    { id: "EBTM", name: "Ekya BTM Layout" },
    { id: "EJPN", name: "Ekya JP Nagar" },
    { id: "EITPL", name: "Ekya ITPL" },
    { id: "ENICE", name: "Ekya NICE Road" },
    { id: "EKRP", name: "Ekya Kanakapura Road" },
    { id: "CMRPU", name: "CMRPU (All)" }
  ];

  const topics = [
    { id: "all", name: "All Topics" },
    { id: "Pedagogy", name: "Pedagogy" },
    { id: "Technology", name: "Technology" },
    { id: "Assessment", name: "Assessment" },
    { id: "Culture", name: "Culture" },
    { id: "Soft Skills", name: "Soft Skills" }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await trainingService.getAllEvents();
      setEvents(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch training events");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchesCampus = selectedCampus === "all" || ev.schoolId === selectedCampus || ev.location?.includes(selectedCampus);
    const matchesTopic = selectedTopic === "all" || (ev.topic || ev.type) === selectedTopic;
    const matchesDate = !date || ev.date === format(date, "MMM d, yyyy");
    return matchesSearch && matchesCampus && matchesTopic && matchesDate;
  });

  const getTopicColor = (topic: string) => {
    switch (topic) {
        case "Pedagogy": return "bg-blue-500";
        case "Technology": return "bg-green-500";
        case "Assessment": return "bg-rose-500";
        default: return "bg-amber-500";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Calendar & Filters */}
      <Card className="lg:col-span-4 border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Training Schedule
            </CardTitle>
            <CardDescription>Select a date to view available sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-gray-100 p-3 mx-auto"
                modifiers={{
                    hasEvent: events.map(e => new Date(e.date || ""))
                }}
                modifiersStyles={{
                    hasEvent: { fontWeight: 'bold', border: '1px solid #EA104A', borderRadius: '50%' }
                }}
            />

            <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campus</Label>
                    <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                        <SelectTrigger className="rounded-xl h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {campuses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topic / Domain</Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger className="rounded-xl h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative pt-2">
                    <Search className="absolute left-3 top-5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search title..." 
                        className="pl-9 h-10 rounded-xl"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground hover:bg-rose-50 hover:text-rose-600 rounded-xl h-9"
                    onClick={() => { setDate(undefined); setSelectedCampus("all"); setSelectedTopic("all"); setSearch(""); }}
                >
                    Clear All Filters
                </Button>
            </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card className="lg:col-span-8 border-gray-100 shadow-sm bg-gray-50/30">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-xl">
                        {date ? `Sessions for ${format(date, "MMM d, yyyy")}` : "All Upcoming Sessions"}
                    </CardTitle>
                    <CardDescription>{filteredEvents.length} events matching your criteria</CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold">
                    {filteredEvents.length} Sessions
                </Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                    <Clock className="w-8 h-8 animate-spin opacity-50" />
                    <p className="font-medium">Loading session data...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 bg-white rounded-3xl border border-dashed">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-200" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-gray-900">No sessions found</p>
                        <p className="text-sm">Try adjusting your filters or selecting another date</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredEvents.map(ev => (
                        <Card key={ev.id} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-all group">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Event Meta side */}
                                    <div className={cn("w-full md:w-2 px-1 group-hover:w-3 transition-all shrink-0", getTopicColor(ev.topic || ev.type))} />
                                    
                                    <div className="flex-1 p-5 space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                                                        {ev.title}
                                                    </h3>
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-gray-50">
                                                        {ev.topic || ev.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {ev.time} • {ev.duration || "1.5 hours"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" className="bg-primary hover:bg-primary/90 h-9 rounded-xl px-5 text-xs font-bold">
                                                    Register Session
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium bg-gray-100/50 px-3 py-1.5 rounded-lg">
                                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                {ev.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium bg-gray-100/50 px-3 py-1.5 rounded-lg">
                                                <Users className="w-3.5 h-3.5 text-emerald-500" />
                                                {ev.registered || 0} / {ev.capacity || 30} Staff
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 ml-auto group-hover:gap-3 transition-all cursor-pointer">
                                                View Resources <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* PD Snapshot Promo */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#EA104A] to-rose-400 rounded-[2rem] text-white overflow-hidden relative group">
                <TrendingUp className="absolute -right-4 -bottom-4 w-40 h-40 text-white/10 -rotate-12 group-hover:scale-110 transition-transform" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-xl font-black">Track Your Learning Journey</h4>
                        <p className="text-white/80 text-sm max-w-md">
                            Your professional development snapshot is updated in real-time. Review your hours and skills mapped to the Ekya Danielson Framework.
                        </p>
                    </div>
                    <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-2xl h-12 px-8 font-black backdrop-blur-sm">
                        View Summary
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
