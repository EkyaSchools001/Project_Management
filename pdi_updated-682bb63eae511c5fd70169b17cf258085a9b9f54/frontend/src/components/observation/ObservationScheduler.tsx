import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, User, BookOpen, Layers, Plus, Search, Eye, Filter, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Teacher {
    id: string;
    fullName: string;
}

interface Schedule {
    id: string;
    teacherId: string;
    teacher: Teacher;
    observerId: string;
    observer: { fullName: string };
    cluster: number;
    scheduledDate: string;
    status: string;
    subject: string;
}

export const ObservationScheduler: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCluster = searchParams.get("cluster") || "1";

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [observers, setObservers] = useState<{ id: string; fullName: string }[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        teacherId: "",
        observerId: "",
        cluster: initialCluster,
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        grade: "",
        subject: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersRes, usersRes, schedulesRes] = await Promise.all([
                    api.get('/users?role=TEACHER'),
                    api.get('/users?role=LEADER,SCHOOL_LEADER,ADMIN'),
                    api.get('/observations/schedules')
                ]);
                setTeachers(teachersRes.data.data);
                setObservers(usersRes.data.data);
                setSchedules(schedulesRes.data.data);
            } catch (err) {
                toast.error("Failed to load scheduler data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateSchedule = async () => {
        if (!formData.teacherId || !formData.observerId || !formData.date) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const payload = {
                teacherId: formData.teacherId,
                observerId: formData.observerId,
                cluster: parseInt(formData.cluster),
                scheduledDate: `${formData.date}T${formData.time}:00Z`,
                subject: formData.subject,
                status: 'SCHEDULED'
            };
            const response = await api.post('/observations/schedules', payload);
            toast.success("Observation scheduled successfully");
            setSchedules([response.data.data, ...schedules]);
            
            // Redirect to form
            navigate(`/leader/observations/form/${formData.cluster}/${formData.teacherId}/scheduled?scheduleId=${response.data.data.id}`);
        } catch (err) {
            toast.error("Failed to create schedule");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1F2839]">Observation Scheduler</h1>
                    <p className="text-slate-500 font-medium">Plan and manage teacher observations across clusters.</p>
                </div>
            </div>

            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b p-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-rose-500" />
                        </div>
                        <CardTitle className="text-xl font-bold text-[#1F2839]">Schedule New Observation</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Teacher</Label>
                            <Select value={formData.teacherId} onValueChange={(v) => setFormData({...formData, teacherId: v})}>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                    <SelectValue placeholder="Select Teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Observer</Label>
                            <Select value={formData.observerId} onValueChange={(v) => setFormData({...formData, observerId: v})}>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                    <SelectValue placeholder="Select Observer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {observers.map(o => <SelectItem key={o.id} value={o.id}>{o.fullName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cluster</Label>
                            <Select value={formData.cluster} onValueChange={(v) => setFormData({...formData, cluster: v})}>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-rose-200 focus:ring-rose-500">
                                    <SelectValue placeholder="Select Cluster" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>Cluster {n}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date</Label>
                            <div className="relative">
                                <Input 
                                    type="date" 
                                    className="h-12 rounded-xl bg-slate-50 border-none pl-4" 
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Time</Label>
                            <div className="relative">
                                <Input 
                                    type="time" 
                                    className="h-12 rounded-xl bg-slate-50 border-none pl-4" 
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Grade</Label>
                            <Input 
                                placeholder="Grade" 
                                className="h-12 rounded-xl bg-slate-50 border-none" 
                                value={formData.grade}
                                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</Label>
                            <Input 
                                placeholder="Subject" 
                                className="h-12 rounded-xl bg-slate-50 border-none" 
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button 
                                onClick={handleCreateSchedule}
                                className="h-12 w-full rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold gap-2 shadow-lg shadow-rose-100"
                            >
                                <Plus className="w-5 h-5" /> Schedule
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="p-8 border-b">
                    <CardTitle className="text-xl font-bold text-[#1F2839]">Upcoming Observations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b">
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Teacher</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Observer</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cluster</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.filter(s => s.status === 'SCHEDULED').map((s) => (
                                    <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-[#1F2839]">{format(new Date(s.scheduledDate), "MMM d, yyyy")}</div>
                                            <div className="text-xs text-slate-500 font-medium">{format(new Date(s.scheduledDate), "hh:mm a")}</div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-[#1F2839]">{s.teacher?.fullName}</td>
                                        <td className="px-8 py-5 text-slate-600 font-medium">{s.observer?.fullName}</td>
                                        <td className="px-8 py-5">
                                            <Badge variant="outline" className="font-bold border-rose-200 text-rose-600 bg-rose-50">
                                                Cluster {s.cluster}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5">
                                            <Badge className="bg-emerald-50 text-emerald-600 font-black tracking-tighter text-[10px] uppercase border-emerald-100">
                                                {s.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="font-black text-[10px] uppercase rounded-lg border-slate-200"
                                                onClick={() => navigate(`/leader/observations/form/${s.cluster}/${s.teacherId}/scheduled?scheduleId=${s.id}`)}
                                            >
                                                Start Session
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {schedules.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium italic">
                                            No upcoming observations scheduled.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
