import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ObservationReview } from "@/components/observation/ObservationReview";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/RoleBadge";

const ObservationReviewPage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) return <div>Invalid Observation ID</div>;

    return (
        <DashboardLayout role={(user?.role?.toLowerCase() || 'leader') as Role} userName={user?.fullName || ""}>
            <div className="py-6">
                <ObservationReview observationId={id} />
            </div>
        </DashboardLayout>
    );
};

export default ObservationReviewPage;
