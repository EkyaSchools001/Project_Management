import React, { useState, useEffect } from "react";
import { 
  Users, 
  Warning, 
  MapPin, 
  TrendUp,
  CaretRight,
  DotsThreeVertical,
  MagnifyingGlass
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userService, User } from "@/services/userService";

export function LeaderAcademicOps() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      loadStaff();
    }
  }, [isModalOpen]);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setStaff(data || []);
    } catch (error) {
      console.error("Failed to load staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staff.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alerts = [
    { title: "Staff Shortage", campus: "Whitefield", priority: "High" },
    { title: "Missing Attendance", campus: "Whitefield", priority: "Medium" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Staff Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendUp className="w-3 h-3" /> +2% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48/50</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 wings</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-destructive">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-destructive/80 mt-1">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Substitution Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">4 pending assignment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Availability</CardTitle>
            <CardDescription>Real-time status of all academic staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Sarah Jenkins', 'Robert Chen', 'Priya Sharma'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{name}</div>
                      <div className="text-xs text-muted-foreground">Senior Secondary • Math</div>
                    </div>
                  </div>
                  <Badge variant={i === 1 ? "secondary" : "outline"} className="text-[10px]">
                    {i === 1 ? "On Leave" : "In Class"}
                  </Badge>
                </div>
              ))}
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-xs" 
                onClick={() => setIsModalOpen(true)}
              >
                View All Staff
              </Button>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-black tracking-tight">Staff Directory</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500">
                    Real-time availability across the campus
                  </DialogDescription>
                </DialogHeader>
                
                <div className="px-6 py-4">
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search by name, role or department..." 
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="h-[400px] px-6 pb-6">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span className="text-xs font-bold tracking-widest uppercase">Fetching Directory...</span>
                      </div>
                    ) : filteredStaff.length > 0 ? (
                      filteredStaff.map((person) => (
                        <div key={person.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200/60">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary group-hover:scale-110 transition-transform">
                              {person.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900">{person.fullName}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {person.role} • {person.department || "General"}
                              </div>
                            </div>
                          </div>
                          <Badge variant={person.status === 'Active' ? "outline" : "secondary"} className="text-[10px] rounded-lg font-bold">
                            {person.status === 'Active' ? "In Class" : "Available"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No staff members found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campus Overview</CardTitle>
            <CardDescription>Whitefield Main Campus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                <Warning className={`w-5 h-5 shrink-0 ${alert.priority === 'High' ? 'text-destructive' : 'text-orange-500'}`} weight="fill" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{alert.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {alert.campus}
                  </div>
                </div>
                <Badge variant={alert.priority === 'High' ? 'destructive' : 'outline'}>{alert.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
