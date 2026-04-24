import React from "react";
import { 
  Building, 
  Ticket, 
  Users, 
  Clock,
  Eye
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";

export function LeaderMgmtSupport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Building className="w-4 h-4" /> Campus Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Normal</div>
            <p className="text-xs text-green-600">All systems operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Ticket className="w-4 h-4" /> Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 pending resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" /> Leave Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-orange-600">Requires your review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Ticket Overview</CardTitle>
          <CardDescription>Local issues tracked at Whitefield Campus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {[
               { id: 'T-102', user: 'Sarah J.', issue: 'Projector Bulb', status: 'Pending' },
               { id: 'T-105', user: 'Mike R.', issue: 'AC Leaking', status: 'In Progress' }
             ].map((ticket, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">{ticket.id}</span>
                    <div>
                      <div className="text-sm font-medium">{ticket.issue}</div>
                      <div className="text-[10px] text-muted-foreground">Raised by: {ticket.user}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px]">{ticket.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
