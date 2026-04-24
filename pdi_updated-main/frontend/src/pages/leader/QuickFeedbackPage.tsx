import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { User, userService } from "@/services/userService";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, MessageSquare } from "lucide-react";
import { QuickFeedbackForm } from "@/components/QuickFeedbackForm";
import { useAuth } from "@/hooks/useAuth";
import { GrowthLayout } from "@/components/growth/GrowthLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import { Observation } from "@/types/observation";
import { NotesReferencePanel } from "@/components/growth/NotesReferencePanel";

const QuickFeedbackPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { teacherId: paramTeacherId } = useParams();
    const [searchParams] = useSearchParams();
    const teacherId = paramTeacherId || searchParams.get("teacherId");

    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<Partial<Observation>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedTeachers = await userService.getTeachers();
                setTeachers(fetchedTeachers);

                const obsId = searchParams.get("id");
                if (obsId) {
                    const res = await api.get(`/growth/observations/${obsId}`);
                    const obs = res.data?.data?.observation;
                    if (obs) {
                        const payload = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;
                        setInitialData({
                            ...(payload || obs),
                            id: obs.id, // Keep track of ID for potential updates
                            teacherId: obs.teacherId,
                            teacher: obs.teacher?.fullName || payload?.teacher || obs.teacherName || "",
                            teacherEmail: obs.teacher?.email || payload?.teacherEmail || obs.teacherEmail || "",
                        });
                        setLoading(false);
                        return;
                    }
                }

                if (teacherId) {
                    const selectedTeacher = fetchedTeachers.find(t => t.id === teacherId);
                    if (selectedTeacher) {
                        setInitialData({
                            teacherId: selectedTeacher.id,
                            teacher: selectedTeacher.fullName,
                            teacherEmail: selectedTeacher.email,
                            campus: selectedTeacher.campus,
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                toast.error("Failed to load required data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [teacherId, searchParams]);


    if (!user) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const formattedTeachers = teachers.map(t => ({
        id: t.id,
        name: t.fullName,
        email: t.email
    }));

    return (

        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            {(location.state?.observationNotes || (initialData as any)?.observationNotes) && (
                <NotesReferencePanel notes={location.state?.observationNotes || (initialData as any).observationNotes} />
            )}
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <PageHeader
                        title="Quick Feedback Master"
                        subtitle="Fast, actionable feedback loops for academic subjects"
                    />
                </div>

                <div className="max-w-5xl mx-auto">
                    <QuickFeedbackForm
                        teachers={formattedTeachers}
                        initialData={initialData}
                        onCancel={() => navigate(teacherId ? `/leader/quick-feedback?teacherId=${teacherId}` : "/leader/quick-feedback")}
                        onSubmit={async (data) => {
                            try {
                                const payload = {
                                    teacherId: data.teacherId,
                                    moduleType: "QUICK_FEEDBACK",
                                    academicYear: "AY 25-26",
                                    formPayload: data,
                                    status: "SUBMITTED"
                                };

                                const obsId = searchParams.get("id");
                                if (obsId) {
                                    await api.patch(`/growth/observations/${obsId}`, payload);
                                    toast.success(`Quick feedback for ${data.teacher} updated successfully!`);
                                } else {
                                    await api.post('/growth/observations', payload);
                                    toast.success(`Quick feedback for ${data.teacher} recorded successfully!`);
                                }
                                navigate(`/leader/growth/${data.teacherId}`);
                            } catch (error) {
                                console.error("Failed to save observation:", error);
                                toast.error("Failed to save observation");
                            }
                        }}
                    />
                </div>
            </div>
        </GrowthLayout>

    );
};

export default QuickFeedbackPage;
