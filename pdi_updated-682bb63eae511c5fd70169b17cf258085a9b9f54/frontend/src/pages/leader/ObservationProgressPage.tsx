import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ObservationProgress } from "@/components/observation/ObservationProgress";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/RoleBadge";

const ObservationProgressPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout role={(user?.role?.toLowerCase() || 'leader') as Role} userName={user?.fullName || ""}>
            <div className="py-8">
                <ObservationProgress />
            </div>
        </DashboardLayout>
    );
};

export default ObservationProgressPage;
