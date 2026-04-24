import React from "react";
import { 
  Layout, 
  Files, 
  Plus, 
  ArrowUpRight,
  Eye,
  BookmarkSimple
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";

export function TeacherPedagogyLearning() {
  const templates = [
    { title: "Weekly Lesson Plan (IB)", class: "All" },
    { title: "Unit Reflection Prompt", class: "Secondary" },
    { title: "Assessment Rubric Builder", class: "All" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" weight="duotone" />
              Classroom Templates
            </CardTitle>
            <CardDescription>Ready-to-use frameworks for your lessons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-all group cursor-pointer">
                <div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <Badge variant="outline" className="text-[10px] mt-1">{t.class}</Badge>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-primary">Browse Full Library</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Files className="w-5 h-5 text-blue-500" weight="duotone" />
                Assessment Tracker
              </CardTitle>
              <Button size="sm" className="gap-2 h-8 text-xs">
                <Plus className="w-3 h-3" /> New Tracker
              </Button>
            </div>
            <CardDescription>Track and manage your upcoming assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Grade 10 Math Mid-term", date: "April 12", status: "In Progress" },
                { name: "Physics Unit Quiz", date: "April 05", status: "Scheduled" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-border/50">
                   <div className="space-y-1">
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">Due: {item.date}</div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Badge className="text-[9px]">{item.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <BookmarkSimple className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ELC Repository Highlights</CardTitle>
          <CardDescription>Recently added resources from the central team</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[200px] p-4 bg-muted/10 border border-border rounded-xl space-y-3">
                   <div className="w-full h-24 bg-muted/50 rounded-lg flex items-center justify-center">
                     <Eye className="w-8 h-8 text-muted-foreground/30" />
                   </div>
                   <div className="text-xs font-semibold">Inquiry Strategy v.{i}.2</div>
                   <Button variant="outline" size="sm" className="w-full h-7 text-[10px]">Preview</Button>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
