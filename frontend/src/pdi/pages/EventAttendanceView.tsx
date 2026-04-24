import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@pdi/lib/api";
import { trainingService } from "@pdi/services/trainingService";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pdi/components/ui/table";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pdi/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Download, UserCheck, Users, CheckCircle2, Award } from "lucide-react";


export default function EventAttendanceView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState<any[]>([]);
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("attendance");

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const handleUpdate = (e: any) => {
            if (e.detail?.eventId === id) {
                fetchData();
            }
        };
        window.addEventListener('attendance-updated', handleUpdate);
        return () => window.removeEventListener('attendance-updated', handleUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [attendanceRes, eventData] = await Promise.all([
                api.get(`/attendance/${id}`),
                trainingService.getEvent(id!)
            ]);

            if (attendanceRes.data.status === "success") {
                setAttendance(attendanceRes.data.data.attendance);
            }
            if (eventData) {
                setEvent(eventData);
            }
        } catch (error: any) {
            console.error("Failed to fetch data", error);
            const msg = error.response?.data?.message || error.message || "Failed to load records";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (activeTab === "attendance") {
            if (!attendance.length) return;
            const headers = ["Teacher Name", "Email", "School", "Submitted At", "Employee ID", "Department"];
            const rows = attendance.map(a => [
                a.teacherName,
                a.teacherEmail,
                a.schoolId || "N/A",
                format(new Date(a.submittedAt), "yyyy-MM-dd HH:mm:ss"),
                a.employeeId || "N/A",
                a.department || "N/A"
            ]);
            downloadCSV(headers, rows, `Attendance_${event?.title || id}.csv`);
        } else {
            const registrants = event?.registrants || [];
            if (!registrants.length) return;
            const headers = ["Name", "Email", "Role", "Campus", "Department", "Date Registered"];
            const rows = registrants.map((r: any) => [
                r.name,
                r.email,
                r.role || "N/A",
                r.campusId || "N/A",
                r.department || "N/A",
                r.dateRegistered
            ]);
            downloadCSV(headers, rows, `Registrants_${event?.title || id}.csv`);
        }
    };

    const downloadCSV = (headers: string[], rows: any[][], fileName: string) => {
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(c => `"${c}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {event?.title || "Event Attendance"}
                    </h1>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-muted-foreground">
                            {attendance.length} attended
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-muted-foreground">
                            {event?.registrants?.length || 0} registered
                        </p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Button
                        variant="default"
                        className="bg-primary hover:bg-primary/90 text-white font-bold"
                        onClick={async () => {
                            try {
                                const response = await api.post(`/attendance/${id}/award`);
                                if (response.data.status === "success") {
                                    toast.success(response.data.message || `Successfully awarded ${event?.trainingHours || 2} Training Hours!`);
                                    fetchData(); // Refresh to update event.hoursAwarded
                                }
                            } catch (error: any) {
                                console.error("Failed to award hours", error);
                                toast.error(error.response?.data?.message || "Failed to award training hours");
                            }
                        }}
                        disabled={attendance.length === 0 || event?.hoursAwarded}
                    >
                        <Award className="w-4 h-4 mr-2" />
                        {event?.hoursAwarded ? "Hours Awarded" : `Award Training Hours (${attendance.length})`}
                    </Button>
                    <Button variant="outline" onClick={handleExport} disabled={activeTab === "attendance" ? attendance.length === 0 : !event?.registrants?.length}>
                        <Download className="w-4 h-4 mr-2" />
                        Export {activeTab === "attendance" ? "Attendance" : "Registrants"} CSV
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="attendance" className="gap-2">
                        <UserCheck className="w-4 h-4" />
                        Recorded Attendance
                    </TabsTrigger>
                    <TabsTrigger value="registrants" className="gap-2">
                        <Users className="w-4 h-4" />
                        Registered Participants
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="attendance">
                    <Card className="  shadow-sm bg-card">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px] text-center">S.No.</TableHead>
                                        <TableHead>Teacher Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendance.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                No attendance records found yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendance.map((record, index) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="font-medium text-slate-500 text-center">{index + 1}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-primary/10 rounded-full">
                                                            <UserCheck className="w-3 h-3 text-primary" />
                                                        </div>
                                                        {record.teacherName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{record.teacherEmail}</TableCell>
                                                <TableCell>{format(new Date(record.submittedAt), "MMM d, h:mm a")}</TableCell>
                                                <TableCell>{record.department || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Present</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="registrants">
                    <Card className="  shadow-sm bg-card">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px] text-center">S.No.</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Reg. Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(!event?.registrants || event.registrants.length === 0) ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                No registrants found for this event.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        event.registrants.map((registrant: any, index: number) => (
                                            <TableRow key={registrant.id}>
                                                <TableCell className="font-medium text-slate-500 text-center">{index + 1}</TableCell>
                                                <TableCell className="font-medium">
                                                    {registrant.name}
                                                </TableCell>
                                                <TableCell>{registrant.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{registrant.role || "Teacher"}</Badge>
                                                </TableCell>
                                                <TableCell>{registrant.department || "-"}</TableCell>
                                                <TableCell>{registrant.dateRegistered}</TableCell>
                                                <TableCell className="text-right">
                                                    {attendance.some(a => a.teacherEmail === registrant.email) ? (
                                                        <Badge className="bg-green-100 text-green-700 border-none">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Recorded
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 text-primary hover:bg-primary/10 font-bold"
                                                            onClick={async () => {
                                                                try {
                                                                    await api.post(`/attendance/mark`, {
                                                                        eventId: id,
                                                                        teacherId: registrant.id,
                                                                        teacherName: registrant.name,
                                                                        teacherEmail: registrant.email
                                                                    });
                                                                    toast.success(`${registrant.name} marked as present`);
                                                                    fetchData();
                                                                } catch (err) {
                                                                    toast.error("Failed to mark attendance");
                                                                }
                                                            }}
                                                        >
                                                            Mark Present
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
