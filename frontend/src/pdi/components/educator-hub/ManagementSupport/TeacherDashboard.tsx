import React from "react";
import { 
  UserCircle, 
  Ticket, 
  FileText, 
  Question,
  ChatCircleDots
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";

export function TeacherMgmtSupport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 transition-colors border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" weight="duotone" />
              Employee Self Service (ESS)
            </CardTitle>
            <CardDescription>Access your payroll, leaves, and personal records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText className="w-4 h-4" /> View Payslips
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <ChatCircleDots className="w-4 h-4" /> Apply for Leave
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-500/50 transition-colors border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" weight="duotone" />
              IT & Facilities Support
            </CardTitle>
            <CardDescription>Raise a ticket for any equipment or infrastructure issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" /> New Support Ticket
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Question className="w-4 h-4" /> Help Center / FAQs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Policy Updates</CardTitle>
          <CardDescription>Important institutional documents for your reference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
             {['Travel Policy 2026', 'Code of Conduct', 'IT Acceptable Use'].map((p, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                 <span className="text-sm font-medium">{p}</span>
                 <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Fixed import for Plus in the same file if needed or just use standard Plus
import { Plus } from "@phosphor-icons/react";
