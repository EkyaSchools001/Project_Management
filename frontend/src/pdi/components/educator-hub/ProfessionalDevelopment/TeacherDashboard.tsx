import React from "react";
import { 
  RocketLaunch, 
  TrendUp, 
  Calendar,
  Certificate,
  Notebook
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Progress } from "@pdi/components/ui/progress";

export function TeacherProfDev() {
  const myModules = [
    { title: "Inclusive Classroom Strategies", progress: 85, status: "Active" },
    { title: "Digital Literacy in Early Years", progress: 20, status: "Active" },
    { title: "Advanced Formative Assessment", progress: 0, status: "Not Started" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RocketLaunch className="w-4 h-4 text-primary" /> Active PDI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Modules</div>
            <p className="text-xs text-muted-foreground">85% average progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Certificate className="w-4 h-4 text-orange-500" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Total</div>
            <p className="text-xs text-muted-foreground">3 expiring soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> Upcoming TD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">March 28</div>
            <p className="text-xs text-muted-foreground">Workshop: AI in Education</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Learning Path</CardTitle>
            <CardDescription>Professional Development Institute (PDI) progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {myModules.map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.title}</span>
                  <span className="text-muted-foreground">{m.progress}%</span>
                </div>
                <Progress value={m.progress} className="h-2" />
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-muted-foreground">{m.status}</span>
                   <Button variant="link" size="sm" className="h-auto p-0 text-xs">Continue</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Notebook className="w-5 h-5 text-indigo-500" />
                Reflective Journal
              </CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-[10px]">New Entry</Button>
            </div>
            <CardDescription>Your personal pedagogical reflection space</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="p-3 bg-muted/20 border-l-4 border-primary rounded-r-md">
                   <div className="text-xs font-bold">Week 12: Inquiry Reflections</div>
                   <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                     Today's lesson on quadratic equations went better than expected. The students really responded to the visual...
                   </p>
                   <div className="text-[9px] text-muted-foreground mt-2 italic">Updated Yesterday</div>
                </div>
                <Button variant="ghost" className="w-full text-[10px] text-muted-foreground">View All Entries</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
