import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { DynamicObservationForm } from "@/components/observation/DynamicObservationForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/RoleBadge";
import api from "@/lib/api";
import { toast } from "sonner";

const ObservationFormPage = () => {
    const { user } = useAuth();
    const { clusterId, teacherId, mode } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const scheduleId = searchParams.get("scheduleId");

    const handleSubmit = async (payload: any) => {
        try {
            await api.post('/observations/submit-structured', payload);
            toast.success("Observation submitted successfully!");
            navigate("/leader/danielson-framework"); // Redirect to dashboard
        } catch (err) {
            toast.error("Failed to submit observation");
        }
    };

    return (
        <DashboardLayout role={(user?.role?.toLowerCase() || 'leader') as Role} userName={user?.fullName || ""}>
            <div className="py-6">
                <DynamicObservationForm 
                    clusterNumber={parseInt(clusterId || "1")} 
                    scheduleId={scheduleId || undefined}
                    preselectedTeacherId={teacherId === 'select' ? undefined : teacherId}
                    mode={mode as 'scheduled' | 'unscheduled' | 'quick-feedback'}
                    onCancel={() => navigate(-1)}
                    onSubmit={handleSubmit}
                />
            </div>
        </DashboardLayout>
    );
};

export default ObservationFormPage;
