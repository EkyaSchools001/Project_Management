import React from "react";
import { 
  ChartLineUp, 
  TrendUp, 
  Users, 
  FileText,
  ChartBarHorizontal
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ManagementPedagogyLearning() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">ELC Adoption Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">76%</div>
            <Progress value={76} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Content Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,240</div>
            <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
              <TrendUp /> +14% growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Top Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">Inquiry Templates</div>
            <p className="text-[10px] text-muted-foreground mt-1">42% of all downloads</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Most utilized instructional frameworks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {[
               { name: "IB Framework Hub", usage: "High", trend: "increasing" },
               { name: "Assessment Rubrics", usage: "Medium", trend: "stable" },
               { name: "Reflective Peer Obs", usage: "Low", trend: "increasing" }
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{item.usage} utilization</div>
                  </div>
                  <ChartBarHorizontal className="w-5 h-5 text-primary/40" />
               </div>
             ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adoption Metrics</CardTitle>
            <CardDescription>Adoption per campus category</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center bg-muted/10 border border-dashed border-border rounded-lg">
             <ChartLineUp className="w-10 h-10 text-muted-foreground/20" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
