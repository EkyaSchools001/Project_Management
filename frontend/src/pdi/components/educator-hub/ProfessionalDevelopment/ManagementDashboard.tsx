import React from "react";
import { 
  ChartLineUp, 
  TrendUp, 
  Globe, 
  Buildings,
  ChartPie
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Progress } from "@pdi/components/ui/progress";

export function ManagementProfDev() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Network Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">54.2%</div>
            <Progress value={54.2} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">PDI ROI Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.4/10</div>
            <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
              <TrendUp /> +0.4 improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Active Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,842</div>
            <p className="text-[10px] text-muted-foreground mt-1">Across 4 regions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campus Comparison</CardTitle>
            <CardDescription>PDI completion rates by school</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {[
               { name: "Whitefield Campus", val: 88 },
               { name: "Koramangala Global", val: 72 },
               { name: "JP Nagar Heritage", val: 45 },
               { name: "JS Nagar Future", val: 38 },
             ].map((item, i) => (
               <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.name}</span>
                    <span>{item.val}%</span>
                  </div>
                  <Progress value={item.val} className={`h-1.5 ${item.val < 50 ? '[&>div]:bg-destructive' : ''}`} />
               </div>
             ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global Skills Radar</CardTitle>
            <CardDescription>Teacher proficiency growth trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center bg-muted/10 border border-dashed border-border rounded-lg">
             <ChartPie className="w-10 h-10 text-muted-foreground/20" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
