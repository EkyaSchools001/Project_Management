import React, { useState } from "react";
import { 
  Gear, 
  Calendar, 
  Plus, 
  Certificate,
  ClipboardText,
  Clock,
  DownloadSimple
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@pdi/components/ui/dialog";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@pdi/components/ui/alert-dialog";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: string;
}

interface PDIModule {
  id: string;
  title: string;
  status: string;
}

export function AdminProfDev() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: "1", date: "Mar 28", title: "AI in Classroom", type: "Webinar" },
    { id: "2", date: "Apr 02", title: "Leadership Ethics", type: "On-site" }
  ]);

  const [modules, setModules] = useState<PDIModule[]>([
    { id: "m1", title: "Critical Thinking", status: "Draft" },
    { id: "m2", title: "Global Citizenship", status: "Draft" },
    { id: "m3", title: "Pastoral Care", status: "Draft" },
  ]);

  // Modal Visibility States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);

  // Form States
  const [activeModule, setActiveModule] = useState<Partial<PDIModule>>({});
  const [activeEvent, setActiveEvent] = useState<Partial<CalendarEvent>>({});

  // Handlers for Module Builder
  const openNewModule = () => {
    setActiveModule({ title: "", status: "Draft" });
    setIsModuleModalOpen(true);
  };

  const saveModule = () => {
    if (!activeModule.title) {
      toast.error("Module Title is required");
      return;
    }
    const newModule = {
      ...activeModule,
      id: `m${Date.now()}`
    } as PDIModule;
    setModules([...modules, newModule]);
    toast.success("New PDI Module created and staged");
    setIsModuleModalOpen(false);
  };

  // Handlers for Training Calendar
  const openNewEvent = () => {
    setActiveEvent({ title: "", date: "", type: "Webinar" });
    setIsCalendarModalOpen(true);
  };

  const saveEvent = () => {
    if (!activeEvent.title || !activeEvent.date) {
      toast.error("Event title and date are required");
      return;
    }
    const newEvent = {
      ...activeEvent,
      id: `e${Date.now()}`
    } as CalendarEvent;
    
    // Append to top for immediate visibility
    setCalendarEvents([newEvent, ...calendarEvents]);
    toast.success("Calendar Event scheduled successfully");
    setIsCalendarModalOpen(false);
  };

  // Handlers for Audit Report
  const openAuditReport = () => {
    setIsReportAlertOpen(true);
  };

  const downloadReport = () => {
    setIsReportAlertOpen(false);
    toast.success("Audit Report generated! Download starting...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">PDI Control Center</h2>
          <p className="text-sm text-muted-foreground">Manage modules, calendars, and certifications</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={openNewModule}>
            <Plus className="w-4 h-4" /> Create PDI Module
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Calendar className="w-5 h-5 text-primary" />
                Training Calendar
              </CardTitle>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={openNewEvent}>Manage Calendar</Button>
            </div>
            <CardDescription>Schedule global and campus-specific workshops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {calendarEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded-lg">
                   <div className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-primary/10 rounded text-[10px] font-bold text-primary">{event.date}</div>
                      <div className="text-xs font-semibold">{event.title}</div>
                   </div>
                   <Badge variant="secondary" className="text-[9px]">{event.type}</Badge>
                </div>
             ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-sm font-bold">
               <Certificate className="w-5 h-5 text-orange-500" />
               Certification Tracking
             </CardTitle>
             <CardDescription>Monitor compliance and renewals</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-xs">First Aid Compliance</span>
                   <span className="text-xs font-bold text-green-600">98%</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs">Safeguarding Level 2</span>
                   <span className="text-xs font-bold text-orange-600">72%</span>
                </div>
                <Button variant="ghost" className="w-full text-[10px] mt-2 group" onClick={openAuditReport}>
                  <DownloadSimple className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  View Audit Report
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <CardTitle className="text-sm font-bold">Active PDI Module Builder</CardTitle>
           <CardDescription>Content staging for upcoming releases</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modules.map((module) => (
                <div key={module.id} className="p-4 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:bg-muted/10 transition-colors">
                   <Clock className="w-6 h-6 text-muted-foreground" />
                   <div className="text-xs font-semibold">{module.title}</div>
                   <Badge variant="outline" className="text-[9px]">{module.status}</Badge>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>


      {/* --- MODALS --- */}

      {/* Create Module Modal */}
      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create PDI Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
             <div className="space-y-2">
                <Label>Module Title</Label>
                <Input 
                  value={activeModule.title || ""} 
                  onChange={(e) => setActiveModule({...activeModule, title: e.target.value})} 
                  placeholder="e.g., Advanced Pedagogy" 
                />
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsModuleModalOpen(false)}>Cancel</Button>
             <Button onClick={saveModule}>Create Module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Event Modal */}
      <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Schedule Training Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
             <div className="space-y-2">
                <Label>Event Title</Label>
                <Input 
                  value={activeEvent.title || ""} 
                  onChange={(e) => setActiveEvent({...activeEvent, title: e.target.value})} 
                  placeholder="e.g., Summer Workshop" 
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Date Label</Label>
                    <Input 
                      value={activeEvent.date || ""} 
                      onChange={(e) => setActiveEvent({...activeEvent, date: e.target.value})} 
                      placeholder="e.g., May 14" 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={activeEvent.type || "Webinar"} onValueChange={(val) => setActiveEvent({...activeEvent, type: val})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Webinar">Webinar</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsCalendarModalOpen(false)}>Cancel</Button>
             <Button onClick={saveEvent}>Schedule Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Report Alert */}
      <AlertDialog open={isReportAlertOpen} onOpenChange={setIsReportAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Audit Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to compile and download the full compliance audit report? This will aggregate data for the entire network.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={downloadReport}>
              Generate Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
