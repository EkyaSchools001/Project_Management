import React from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  ClipboardText,
  BookmarkSimple,
  ArrowRight
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";

export function TeacherAcademicOps() {
  const schedule = [
    { time: "08:30 - 09:20", subject: "Mathematics", class: "Grade 10-A", room: "F-102" },
    { time: "09:30 - 10:20", subject: "Physics", class: "Grade 11-C", room: "S-204" },
    { time: "11:00 - 11:50", subject: "Computer Science", class: "Grade 12-B", room: "Lab-2" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Classes</div>
            <p className="text-xs text-muted-foreground">Next: Mathematics at 08:30</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Duty Roster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Lunch Break</div>
            <p className="text-xs text-muted-foreground">Location: Main Cafeteria</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardText className="w-4 h-4 text-blue-500" /> Pending Substitution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">None</div>
            <p className="text-xs text-muted-foreground">All schedules are clear</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Timetable</CardTitle>
              <CardDescription>Tuesday, March 24, 2026</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              Full Schedule <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-muted-foreground">{item.time}</div>
                  <div>
                    <div className="font-semibold">{item.subject}</div>
                    <div className="text-xs text-muted-foreground">{item.class} • {item.room}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <BookmarkSimple className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
