import React from "react";
import { 
  Users, 
  TrendUp, 
  Calendar,
  Certificate,
  ArrowRight
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Progress } from "@pdi/components/ui/progress";
import { Badge } from "@pdi/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LeaderProfDev() {
  const navigate = useNavigate();
  const staffProgress = [
    { id: "anita-desai", name: "Anita Desai", dept: "Math", progress: 92, status: "On Track" },
    { id: "john-weaver", name: "John Weaver", dept: "Science", progress: 45, status: "At Risk" },
    { id: "meera-nair", name: "Meera Nair", dept: "English", progress: 78, status: "On Track" },
  ];

  const handleDownloadCSV = () => {
    try {
      const headers = ["Name", "Department", "Progress", "Status"];
      const rows = staffProgress.map(s => [s.name, s.dept, `${s.progress}%`, s.status]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `staff_progress_report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Staff progress report downloaded successfully!");
    } catch (err) {
      console.error("CSV Download Error:", err);
      toast.error("Failed to generate CSV report.");
    }
  };

  const handleStaffClick = (staffId: string) => {
    toast.info(`Navigating to profile...`);
    navigate(`/portfolio/${staffId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Team Participation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">Active in PDI modules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendUp className="w-4 h-4 text-green-500" /> Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Certificate className="w-4 h-4 text-orange-500" /> Certifications Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-destructive font-medium">Expiring in 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Progress Tracking</CardTitle>
              <CardDescription>Monitor PDI engagement across your campus</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {staffProgress.map((staff, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-48 text-sm font-medium">{staff.name}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">{staff.dept}</span>
                    <span>{staff.progress}%</span>
                  </div>
                  <Progress value={staff.progress} className="h-1.5" />
                </div>
                <Badge variant={staff.status === 'At Risk' ? 'destructive' : 'secondary'} className="text-[10px] w-20 justify-center">
                  {staff.status}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => handleStaffClick(staff.id)}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
