import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ObservationScheduler } from "@/components/observation/ObservationScheduler";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/RoleBadge";

const ObservationSchedulerPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout role={(user?.role?.toLowerCase() || 'leader') as Role} userName={user?.fullName || ""}>
            <div className="py-8">
                <ObservationScheduler />
            </div>
        </DashboardLayout>
    );
};

export default ObservationSchedulerPage;
