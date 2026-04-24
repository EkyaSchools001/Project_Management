import React from "react";
import GrowthAnalyticsView from "@/components/growth/GrowthAnalyticsView";
import { GrowthLayout } from "@/components/growth/GrowthLayout";

const ManagementGrowthAnalyticsPage = () => {
    return (
        <GrowthLayout allowedRoles={['MANAGEMENT', 'SUPERADMIN']}>
            <div className="p-0 animate-in fade-in duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Organization Growth Analytics</h1>
                    <p className="text-muted-foreground">Strategic overview of Teacher Development impacts and participation trends across all campuses.</p>
                </div>

                <GrowthAnalyticsView />
            </div>
        </GrowthLayout>
    );
};

export default ManagementGrowthAnalyticsPage;
