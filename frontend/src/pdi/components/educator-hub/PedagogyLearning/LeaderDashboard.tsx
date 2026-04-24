import React from "react";
import { 
  Eye, 
  Info, 
  Quotes,
  BookOpen
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";

export function LeaderPedagogyLearning() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" weight="fill" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-900">Instructional Oversight</p>
          <p className="text-xs text-blue-800/70">
            You have view-only access to the ELC Repository and school-wide instructional frameworks. Content management is handled by the central ELC Admin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Active Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Inquiry-Based Learning v2', 'Metacognitive Journals', 'Differentiated Assessment'].map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-md border border-border/50">
                <span className="text-sm font-medium">{f}</span>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Quotes className="w-4 h-4 text-orange-500" /> Instructional Pillars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="p-3 bg-primary/5 rounded-lg text-xs leading-relaxed italic text-muted-foreground">
               "Student agency is the cornerstone of our pedagogical approach. Every lesson must empower the learner to take ownership of their path."
             </div>
             <div className="p-3 bg-primary/5 rounded-lg text-xs leading-relaxed italic text-muted-foreground">
               "Reflection is not an addon; it is the process by which experience becomes learning."
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
