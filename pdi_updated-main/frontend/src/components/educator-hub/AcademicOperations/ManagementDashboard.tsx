import React from "react";
import { 
  ChartBar, 
  TrendUp, 
  UsersThree, 
  Lightning,
  DownloadSimple
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ManagementAcademicOps() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Academic Analytics</h2>
          <p className="text-sm text-muted-foreground">Strategic overview of campus operations</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <DownloadSimple className="w-4 h-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-primary uppercase">Classes Running</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">412</div>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
              <TrendUp weight="bold" /> 12% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Staff Utilization</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">88.4%</div>
            <p className="text-[10px] text-muted-foreground">Average across all campsues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Attendance Gap</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">-1.2%</div>
            <p className="text-[10px] text-muted-foreground text-orange-600 font-medium">Action required in JP Nagar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Operational Slats</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">0.8ms</div>
            <p className="text-[10px] text-muted-foreground">Sync latency</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Consolidated student & staff attendance trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border m-4">
            <div className="text-center space-y-2">
              <ChartBar className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground italic font-light">Advanced visualization engine loading...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key KPIs</CardTitle>
            <CardDescription>Priority Operational Metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: 'Campus Safety Compliance', val: '98%', color: 'bg-green-500' },
                { label: 'Resource Allocation Index', val: '72%', color: 'bg-blue-500' },
                { label: 'Timetable Stability', val: '91%', color: 'bg-orange-500' },
              ].map((kpi, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{kpi.label}</span>
                    <span className="font-bold">{kpi.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${kpi.color}`} style={{ width: kpi.val }} />
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
