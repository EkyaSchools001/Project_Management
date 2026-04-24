import React from "react";
import { 
  Warning, 
  Ticket, 
  Gear, 
  ShieldCheck,
  CheckCircle,
  Clock
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";

export function AdminMgmtSupport() {
  const tickets = [
    { title: "Smartboard Failure", campus: "Whitefield", priority: "High", status: "Open" },
    { title: "Network Latency", campus: "JP Nagar", priority: "Medium", status: "In Progress" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Admin Support Oversight</h2>
          <p className="text-sm text-muted-foreground">Manage global policies and resolve escalated tickets</p>
        </div>
        <Button className="gap-2">
          <Gear className="w-4 h-4" /> Global Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
             <CardTitle className="text-xs uppercase text-muted-foreground">Active Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold">24</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
             <CardTitle className="text-xs uppercase text-muted-foreground">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold">12</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
             <CardTitle className="text-xs uppercase text-muted-foreground">Policy Compl.</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold text-green-600">92%</CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
             <CardTitle className="text-xs uppercase text-muted-foreground">SLA Breach</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-2xl font-bold text-destructive">2</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Ticket Queue</CardTitle>
            <CardDescription>Escalated issues requiring central intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {tickets.map((t, i) => (
                 <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/10">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-destructive/5 rounded-full">
                         <Warning className={`w-4 h-4 ${t.priority === 'High' ? 'text-destructive' : 'text-orange-500'}`} weight="fill" />
                       </div>
                       <div>
                         <div className="text-sm font-semibold">{t.title}</div>
                         <div className="text-[10px] text-muted-foreground">{t.campus}</div>
                       </div>
                    </div>
                    <Badge variant={t.status === 'Open' ? 'destructive' : 'secondary'}>{t.status}</Badge>
                 </div>
               ))}
               <Button variant="ghost" className="w-full text-xs">Access Servicedesk</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>Policy Repository</CardTitle>
             <CardDescription>Published institutional guidelines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer">
                <span className="text-sm">HR Manual 2026</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
             </div>
             <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer">
                <span className="text-sm">Financial Delegation</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
             </div>
             <Button variant="outline" size="sm" className="w-full mt-2 dashed border-dashed h-8">Upload New Policy</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
