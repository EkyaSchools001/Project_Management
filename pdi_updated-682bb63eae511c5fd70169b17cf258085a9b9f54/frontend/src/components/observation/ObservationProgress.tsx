import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User, Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

export const ObservationProgress: React.FC = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await api.get('/observations/schedules');
                setSchedules(res.data.data.schedules);
            } catch (err) {
                console.error("Failed to load schedules");
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    const inProgressSchedules = schedules.filter(s => s.status === 'SCHEDULED' || s.status === 'DRAFT');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1F2839]">Observations in Progress</h1>
                    <p className="text-slate-500 font-medium">Manage your active evaluation sessions and pending schedules.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressSchedules.map((s) => (
                    <Card key={s.id} className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b p-6">
                            <div className="flex justify-between items-start">
                                <Badge className={s.status === 'SCHEDULED' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"}>
                                    {s.status === 'SCHEDULED' ? 'Upcoming' : 'Draft'}
                                </Badge>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Cluster {s.clusterNumber || s.cluster}
                                </div>
                            </div>
                            <CardTitle className="text-lg font-bold text-[#1F2839] mt-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> {s.teacher?.fullName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">{format(new Date(s.scheduledDate), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">{format(new Date(s.scheduledDate), "hh:mm a")}</span>
                            </div>
                            
                            <div className="pt-4 flex gap-2">
                                <Button 
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                                    onClick={() => navigate(`/leader/observations/form/${s.clusterNumber || s.cluster}/${s.teacherId}/scheduled?scheduleId=${s.id}`)}
                                >
                                    {s.status === 'SCHEDULED' ? 'Begin Session' : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {inProgressSchedules.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-600">No sessions in progress</h3>
                        <p className="text-slate-400 font-medium mt-2">All observations are completed or not yet scheduled.</p>
                        <Button 
                            variant="outline" 
                            className="mt-6 font-bold border-primary text-primary hover:bg-primary/5"
                            onClick={() => navigate('/leader/observations/schedule')}
                        >
                            Schedule New
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
