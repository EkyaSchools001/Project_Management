import React from "react";
import { 
  ChartPie, 
  TrendUp, 
  Users, 
  Funnel,
  DownloadSimple
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";

export function ManagementMgmtSupport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Support & Efficiency Analytics</h2>
          <p className="text-sm text-muted-foreground">Operational efficiency across the network</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <DownloadSimple className="w-4 h-4" /> Export Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-primary uppercase">Avg. Resolution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-[10px] text-green-600 flex items-center gap-0.5">
              <TrendUp /> 12% faster
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Ticket Volume</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold">142/wk</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Staff Sat.</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold">4.8/5</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold text-blue-600">99.1%</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Regional Support Trends</CardTitle>
            <CardDescription>Support requests by campus cluster</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center bg-muted/10 border border-dashed border-border m-4">
             <div className="flex flex-col items-center gap-2">
                <ChartPie className="w-12 h-12 text-muted-foreground/20" />
                <p className="text-xs text-muted-foreground">Trend analysis engine initializing...</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>Efficiency KPIs</CardTitle>
             <CardDescription>Core Operational Metrics</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6 mt-4">
                {[
                  { label: "SLA Adherence", val: 94 },
                  { label: "First Contact Res.", val: 68 },
                  { label: "Self-Service Usage", val: 42 },
                ].map((kpi, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-muted-foreground">{kpi.label}</span>
                      <span className="font-bold">{kpi.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full">
                       <div className="h-full bg-primary" style={{ width: `${kpi.val}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
