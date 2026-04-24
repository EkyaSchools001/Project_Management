import React from "react";
import GrowthAnalyticsView from "@pdi/components/growth/GrowthAnalyticsView";


import { useAuth } from "@pdi/hooks/useAuth";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";

import { Button } from "@pdi/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AdminGrowthAnalyticsPage = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (

        <GrowthLayout allowedRoles={['ADMIN', 'SUPERADMIN', 'LEADER', 'MANAGEMENT']}>
            <div className="p-0 animate-in fade-in duration-500">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System-Wide Observation Analytics</h1>
                        <p className="text-muted-foreground">Monitor Teacher Development impacts and participation trends across academic types.</p>
                    </div>
                    <Link to="/leader/growth">
                        <Button className="font-bold">
                            Observation Module
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                <GrowthAnalyticsView />
            </div>
        </GrowthLayout>

    );
};

export default AdminGrowthAnalyticsPage;
