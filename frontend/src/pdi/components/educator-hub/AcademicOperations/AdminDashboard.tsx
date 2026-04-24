import React from "react";
import { 
  Buildings, 
  Files, 
  Eye, 
  Info,
  Clock
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { Button } from "@pdi/components/ui/button";

export function AdminAcademicOps() {
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border p-4 rounded-lg flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" weight="fill" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Administrative Oversight Mode</p>
          <p className="text-xs text-muted-foreground">
            Academic data is owned by the respective campus leaders. As an Administrator, you have view-only access to summaries and system settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Buildings className="w-4 h-4" /> Global Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">Average across 12 campuses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timetable Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Synced</div>
            <p className="text-xs text-green-600 font-medium">Updated 42 mins ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Files className="w-4 h-4" /> Academic Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2k</div>
            <p className="text-xs text-muted-foreground">Digital logs this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Summary</CardTitle>
          <CardDescription>Academic operations health across the network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Whitefield', 'Koramangala', 'JS Nagar'].map((campus, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/20">
                <span className="text-sm font-medium">{campus}</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-background">Normal Operations</Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
