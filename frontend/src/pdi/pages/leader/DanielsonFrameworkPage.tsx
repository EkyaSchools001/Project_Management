import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { User, userService } from "@pdi/services/userService";

import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Button } from "@pdi/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { UnifiedObservationForm } from "@pdi/components/UnifiedObservationForm";
import { useAuth } from "@pdi/hooks/useAuth";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import api from "@pdi/lib/api";
import { toast } from "sonner";
import { Observation } from "@pdi/types/observation";
import { useFormFlow } from "@pdi/hooks/useFormFlow";
import { NotesReferencePanel } from "@pdi/components/growth/NotesReferencePanel";

const DanielsonFrameworkPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getRedirectionPath } = useFormFlow();
    const location = useLocation();
    const { teacherId: paramTeacherId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isViewMode = searchParams.get("mode") === "view";
    const teacherId = paramTeacherId || searchParams.get("teacherId");


    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [initialData, setInitialData] = useState<Partial<Observation>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedTeachers = await userService.getTeachers();
                setTeachers(fetchedTeachers);

                const obsId = searchParams.get("id");
                if (obsId) {
                    setFetching(true);
                    const res = await api.get(`/growth/observations/${obsId}`);
                    const obs = res.data?.data?.observation;
                    if (obs) {
                        const payload = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;
                        setInitialData({
                            ...(payload || obs),
                            id: obs.id,
                            teacherId: obs.teacherId,
                            teacher: obs.teacher?.fullName || payload?.teacher || obs.teacherName || "",
                            teacherEmail: obs.teacher?.email || payload?.teacherEmail || obs.teacherEmail || "",
                            campus: obs.teacher?.campusId || payload?.campus || obs.campus
                        });
                        setLoading(false);
                        return; // Skip teacher selection logic
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
                setFetching(false);
            }
        };
        fetchData();
    }, [teacherId, searchParams]);

    const formattedTeachers = React.useMemo(() => teachers.map(t => ({
        id: t.id,
        name: t.fullName,
        role: t.role,
        email: t.email,
        academics: t.academics
    })), [teachers]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (

        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            {(location.state?.observationNotes || (initialData as any)?.observationNotes) && (
                <NotesReferencePanel notes={location.state?.observationNotes || (initialData as any).observationNotes} />
            )}
            <div className="space-y-6 animate-in fade-in duration-500 relative">
                {fetching && (
                    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <p className="font-bold text-amber-900">Loading observation data...</p>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-4 mb-8">
                    <PageHeader
                        title="Ekya Danielson Framework"
                        subtitle="Unified Observation, Feedback & Improvement Form"
                    />
                </div>

                <div className="max-w-5xl mx-auto">
                    <UnifiedObservationForm
                        teachers={formattedTeachers}
                        initialData={initialData}
                        readOnly={isViewMode}
                        onCancel={() => navigate(teacherId ? `/leader/danielson-framework?teacherId=${teacherId}` : "/leader/danielson-framework")}
                        onAutoSave={async (data) => {
                            try {
                                const obsId = searchParams.get("id");
                                const payload = {
                                    teacherId: data.teacherId,
                                    moduleType: "DANIELSON",
                                    academicYear: "AY 25-26",
                                    formPayload: data,
                                    status: "DRAFT"
                                };

                                if (obsId) {
                                    await api.patch(`/growth/observations/${obsId}`, payload);
                                } else {
                                    const res = await api.post('/growth/observations', payload);
                                    if (res.data?.data?.observation?.id) {
                                        setSearchParams(prev => {
                                            const next = new URLSearchParams(prev);
                                            next.set("id", res.data.data.observation.id);
                                            return next;
                                        }, { replace: true });
                                    }
                                }
                            } catch (error) {
                                console.error("Auto-save failed:", error);
                            }
                        }}
                        onSubmit={async (data) => {
                            try {
                                const obsId = searchParams.get("id");
                                const payload = {
                                    teacherId: data.teacherId,
                                    moduleType: "DANIELSON",
                                    academicYear: "AY 25-26",
                                    formPayload: data,
                                    status: "SUBMITTED"
                                };

                                if (obsId) {
                                    await api.patch(`/growth/observations/${obsId}`, payload);
                                    toast.success("Observation updated successfully!");
                                } else {
                                    await api.post('/growth/observations', payload);
                                    toast.success(`Observation for ${data.teacher} recorded successfully!`);
                                }
                                if (user?.role) {
                                    const redirectPath = getRedirectionPath('OBSERVATION', user.role);
                                    if (redirectPath) {
                                        navigate(redirectPath);
                                        return;
                                    }
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

export default DanielsonFrameworkPage;
