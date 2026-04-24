import React, { useState, useEffect } from "react";
import { InstructionList } from "@pdi/components/educator-hub/OurTeams/InstructionList";
import { ekyaItplTeam } from "@pdi/data/teams/ekya-itpl";
import { CampusPageLayout } from "@pdi/components/educator-hub/OurTeams/CampusPageLayout";
import { useAuth } from "@pdi/hooks/useAuth";
import { settingsService } from "@pdi/services/settingsService";
import api from "@pdi/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@pdi/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pdi/components/ui/select";
import { Input } from "@pdi/components/ui/input";
import { Button } from "@pdi/components/ui/button";
import { Label } from "@pdi/components/ui/label";
import { toast } from "sonner";
import { Users, ShieldCheck, Calendar, Clock, Palette, PencilLine, Trash } from "@phosphor-icons/react";

interface DutyAssignment {
  uid: string;
  dutyId: string;
  teacherId: string;
  teacherName: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  grade?: string;
  floor?: string;
  block?: string;
  eventName?: string;
  day?: string;
  theme?: string;
  houseColor?: string;
  houseName?: string;
  clubName?: string;
  subject?: string;
  leadLA?: string;
  leadGeneral?: string;
  menteesLA1?: string;
  menteesLA2?: string;
  menteesGen1?: string;
  menteesGen2?: string;
}

const EkyaItplDutiesPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<DutyAssignment[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<{ id: string; title: string } | null>(null);
  const [editingUid, setEditingUid] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    teacherId: "",
    startDate: "",
    endDate: "",
    month: "",
    grade: "",
    floor: "",
    block: "",
    eventName: "",
    day: "",
    theme: "",
    houseColor: "",
    houseName: "",
    clubName: "",
    subject: "",
    leadLA: "",
    leadGeneral: "",
    menteesLA1: "",
    menteesLA2: "",
    menteesGen1: "",
    menteesGen2: ""
  });

  const [isLoading, setIsLoading] = useState(true);

  const SETTING_KEY = "duty_assignments_eitpl_list";
  const hasCampusAccess = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' || user?.campusId === 'EITPL' || user?.campusAccess?.includes('EITPL');
  const isLeader = hasCampusAccess && (user?.role === "LEADER" || user?.role === "SCHOOL_LEADER" || user?.role === "SUPERADMIN" || user?.role === "ADMIN" || user?.role === "COORDINATOR");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await settingsService.getSetting(SETTING_KEY);
        if (result && result.value) {
          setAssignments(Array.isArray(result.value) ? result.value : []);
        }
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadTeachers = async () => {
      if (!isLeader) return;
      try {
        const response = await api.get("/users?role=TEACHER&campusId=EITPL");
        if (response.data.status === "success") {
          setTeachers(response.data.data.users);
        }
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };

    loadData();
    loadTeachers();
  }, [isLeader]);

  const handleAssignClick = (id: string, title: string, existing?: DutyAssignment) => {
    setSelectedDuty({ id, title });
    if (existing) {
      setEditingUid(existing.uid);
      setFormData({
        teacherId: existing.teacherId,
        startDate: existing.startDate || "",
        endDate: existing.endDate || "",
        month: existing.month || "",
        grade: existing.grade || "",
        floor: existing.floor || "",
        block: existing.block || "",
        eventName: existing.eventName || "",
        day: existing.day || "",
        theme: existing.theme || "",
        houseColor: existing.houseColor || "",
        houseName: existing.houseName || "",
        clubName: existing.clubName || "",
        subject: existing.subject || "",
        leadLA: existing.leadLA || "",
        leadGeneral: existing.leadGeneral || "",
        menteesLA1: existing.menteesLA1 || "",
        menteesLA2: existing.menteesLA2 || "",
        menteesGen1: existing.menteesGen1 || "",
        menteesGen2: existing.menteesGen2 || ""
      });
    } else {
      setEditingUid(null);
      setFormData({
        teacherId: "",
        startDate: "",
        endDate: "",
        month: "",
        grade: "",
        floor: "",
        block: "",
        eventName: "",
        day: "",
        theme: "",
        houseColor: "",
        houseName: "",
        clubName: "",
        subject: "",
        leadLA: "",
        leadGeneral: "",
        menteesLA1: "",
        menteesLA2: "",
        menteesGen1: "",
        menteesGen2: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedDuty) return;

    let tId = formData.teacherId;
    let tName = "";

    if (selectedDuty.id === 'buddy-group') {
      tId = "buddy-" + Math.random().toString(36).substr(2, 9);
      tName = formData.leadLA || "Lead Coordinator";
    } else if (selectedDuty.id === 'room-allocation') {
      tId = "room-" + Math.random().toString(36).substr(2, 9);
      tName = formData.teacherId || "Room Assignment";
    } else {
      const teacher = teachers.find(t => t.id === formData.teacherId);
      if (!teacher) {
        toast.error("Please select a teacher");
        return;
      }
      tId = teacher.id;
      tName = teacher.fullName;
    }

    const assignmentData: DutyAssignment = {
      uid: editingUid || Math.random().toString(36).substr(2, 9),
      dutyId: selectedDuty.id,
      teacherId: tId,
      teacherName: tName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      month: formData.month,
      grade: formData.grade,
      floor: formData.floor,
      block: formData.block,
      eventName: formData.eventName,
      day: formData.day,
      theme: formData.theme,
      houseColor: formData.houseColor,
      houseName: formData.houseName,
      clubName: formData.clubName,
      subject: formData.subject,
      leadLA: formData.leadLA,
      leadGeneral: formData.leadGeneral,
      menteesLA1: formData.menteesLA1,
      menteesLA2: formData.menteesLA2,
      menteesGen1: formData.menteesGen1,
      menteesGen2: formData.menteesGen2
    };

    let newAssignments: DutyAssignment[];
    if (editingUid) {
      newAssignments = assignments.map(a => a.uid === editingUid ? assignmentData : a);
    } else {
      newAssignments = [...assignments, assignmentData];
    }

    try {
      await settingsService.upsertSetting(SETTING_KEY, newAssignments);
      setAssignments(newAssignments);
      setIsDialogOpen(false);
      setEditingUid(null);
      toast.success(`Assignment saved successfully`);
    } catch (error) {
      toast.error("Failed to save assignment");
    }
  };

  const handleDeleteAssignment = async (uid: string) => {
    const newAssignments = assignments.filter(a => a.uid !== uid);
    try {
      await settingsService.upsertSetting(SETTING_KEY, newAssignments);
      setAssignments(newAssignments);
      toast.success("Assignment removed");
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const myDuties = assignments.filter(a => a.teacherId === user?.id).map(a => ({
    ...a,
    title: ekyaItplTeam.instructions.find(i => i.id === a.dutyId)?.title || a.dutyId
  }));

  if (!hasCampusAccess) {
    return (
      <CampusPageLayout
        schoolName={ekyaItplTeam.schoolName}
        breadcrumbPath="/campuses/ekya-itpl/duties"
        accentColor={ekyaItplTeam.accentColor}
      >
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
            <ShieldCheck size={48} weight="duotone" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4">Access Restricted</h2>
          <p className="text-slate-500 font-medium max-w-md">
            This duty portal is restricted to the staff and leadership of {ekyaItplTeam.schoolName}.
          </p>
        </div>
      </CampusPageLayout>
    );
  }

  return (
    <CampusPageLayout
      schoolName={ekyaItplTeam.schoolName}
      breadcrumbPath="/campuses/ekya-itpl/duties"
      accentColor={ekyaItplTeam.accentColor}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col relative px-4 text-left">
        {/* Leadership Banner */}
        {isLeader && (
          <div className="max-w-7xl mx-auto w-full mb-12 mt-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <ShieldCheck size={24} weight="bold" />
                </div>
                <div>
                  <h3 className="font-black text-amber-900 leading-tight uppercase tracking-tight">Leadership Mode</h3>
                  <p className="text-xs text-amber-700 font-medium">You can assign and manage duty rosters directly on the cards below.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Assigned Duties Section */}
        {!isLoading && myDuties.length > 0 && (
          <div className="max-w-7xl mx-auto w-full mb-10">
            <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Users size={180} />
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">My Assigned Duties</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myDuties.map((duty) => (
                  <div key={duty.uid} className="bg-white rounded-3xl p-6 border border-primary/20 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 flex items-center justify-center rotate-12 translate-x-8 -translate-y-8">
                      <ShieldCheck className="w-12 h-12 text-primary opacity-20" />
                    </div>

                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                      {duty.eventName || duty.title}
                    </h4>

                    <div className="space-y-3 relative z-10">
                      {duty.startDate && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                            <Calendar size={16} weight="duotone" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Duration / Date</span>
                            <span className="text-sm font-bold text-slate-600">
                              {duty.startDate} {duty.endDate ? `— ${duty.endDate}` : ""}
                            </span>
                          </div>
                        </div>
                      )}

                      {duty.day && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                            <Calendar size={16} weight="duotone" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Day</span>
                            <span className="text-sm font-bold text-slate-600">{duty.day}</span>
                          </div>
                        </div>
                      )}

                      {duty.grade && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                            <Users size={16} weight="duotone" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Grade / Section</span>
                            <span className="text-sm font-bold text-slate-600">{duty.grade} {duty.floor && !isNaN(Number(duty.floor)) ? `Sec ${duty.floor}` : ""}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <InstructionList
          instructions={(ekyaItplTeam.instructions || []).filter(i => isLeader || i.id !== 'staff-list')}
          accentColor={ekyaItplTeam.accentColor}
          title="CAMPUS DUTIES"
          className="flex-1"
          integrated={isLeader}
          allAssignments={assignments}
          onAssign={isLeader ? handleAssignClick : undefined}
          onEdit={isLeader ? handleAssignClick : undefined}
          onDelete={isLeader ? handleDeleteAssignment : undefined}
        />

        {/* Assignment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(val) => {
          setIsDialogOpen(val);
          if (!val) {
            setSelectedDuty(null);
            setEditingUid(null);
          }
        }}>
          <DialogContent key={editingUid || "new"} className="sm:max-w-[500px] rounded-3xl shadow-2xl border-none p-0 overflow-hidden text-left">
            <div className="bg-primary/5 p-8 border-b">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-6 h-6" weight="bold" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black text-slate-800 text-left">
                      {editingUid ? "Edit Assignment" : "New Duty Assignment"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-left">
                      Configure details for <strong>{selectedDuty?.title}</strong>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-8 space-y-6 text-left overflow-y-auto max-h-[60vh]">
              {selectedDuty?.id !== 'buddy-group' && selectedDuty?.id !== 'room-allocation' && (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Teacher Name</Label>
                  <Select
                    value={formData.teacherId}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, teacherId: val }))}
                  >
                    <SelectTrigger className="h-14 rounded-2xl focus:ring-primary/20 border-slate-200 bg-white">
                      <SelectValue placeholder="Search or select teacher" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id} className="py-3 rounded-lg focus:bg-primary/10 data-[highlighted]:bg-primary/10 group">
                          <div className="flex flex-col text-left group-focus:text-slate-900 text-slate-800">
                            <span className="font-bold">{teacher.fullName}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider group-focus:text-slate-500">{teacher.department || "Teacher"}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Duty Specialized Forms */}
              {selectedDuty?.id === 'assembly-duty' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Month</Label>
                      <Select value={formData.month} onValueChange={(val) => setFormData(prev => ({ ...prev, month: val }))}>
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Month" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-2xl">
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                            <SelectItem key={m} value={m} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Grade / Section</Label>
                      <Input placeholder="e.g. 5 A" value={formData.grade} onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : (selectedDuty?.id === 'dispersal-duty' || selectedDuty?.id === 'gate-duty' || selectedDuty?.id === 'lunch-duty') ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Day of the Week</Label>
                    <Select value={formData.day} onValueChange={(val) => setFormData(prev => ({ ...prev, day: val }))}>
                      <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Day" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                          <SelectItem key={d} value={d} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedDuty?.id !== 'gate-duty' && selectedDuty?.id !== 'dispersal-duty' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Location / Floor</Label>
                      <Select value={formData.floor} onValueChange={(val) => setFormData(prev => ({ ...prev, floor: val }))}>
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Location" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {["Ground Floor", "First Floor", "Second Floor", "Third Floor", "Cafeteria", "Playground", "Gate 1", "Gate 2"].map(l => (
                            <SelectItem key={l} value={l} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ) : selectedDuty?.id === 'house-mistress' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Select House</Label>
                    <Select value={formData.houseName} onValueChange={(val) => setFormData(prev => ({ ...prev, houseName: val, houseColor: ({ Agni: 'Yellow', Bhoomi: 'Orange', Jal: 'Green', Vayu: 'Blue' } as Record<string, string>)[val] }))}>
                      <SelectTrigger className="h-14 rounded-2xl font-bold"><SelectValue placeholder="Select House" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {["Agni", "Bhoomi", "Jal", "Vayu"].map(h => <SelectItem key={h} value={h} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">House Color</Label>
                    <Input value={formData.houseColor || ''} onChange={(e) => setFormData(prev => ({ ...prev, houseColor: e.target.value }))} placeholder="Color will auto-populate" className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'club-in-charge' ? (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Club Name</Label>
                  <Select value={formData.clubName} onValueChange={(val) => setFormData(prev => ({ ...prev, clubName: val }))}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Club" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["Visual Arts Club", "Table Tennis (Wrap-Around)", "Basketball (Wrap-Around)", "Clubs 2-12", "Other"].map(c => (
                        <SelectItem key={c} value={c} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : selectedDuty?.id === 'events-competitions' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Event Name</Label>
                      <Input value={formData.eventName} onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Grade</Label>
                      <Input value={formData.grade} onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'teacher-talk' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Theme</Label>
                    <Input value={formData.theme} onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'floor-in-charge' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Floor</Label>
                    <Input placeholder="e.g. Ground Floor" value={formData.floor} onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Block Covered</Label>
                    <Input placeholder="e.g. EY to PY" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'teacher-blog' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Month</Label>
                    <Select value={formData.month} onValueChange={(val) => setFormData(prev => ({ ...prev, month: val }))}>
                      <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Month" /></SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl">
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                          <SelectItem key={m} value={m} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Status / Subject</Label>
                    <Input placeholder="e.g. ✅ or subject" value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'buddy-group' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Subject</Label>
                    <Input placeholder="e.g. Mathematics" value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Lead (LA)</Label>
                      <Select value={formData.leadLA} onValueChange={(val) => setFormData(prev => ({ ...prev, leadLA: val }))}>
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Lead" /></SelectTrigger>
                        <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.fullName} className="py-2 focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{t.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Lead (General)</Label>
                      <Select value={formData.leadGeneral} onValueChange={(val) => setFormData(prev => ({ ...prev, leadGeneral: val }))}>
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Lead" /></SelectTrigger>
                        <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.fullName} className="py-2 focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{t.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Mentees (LA)</Label>
                      <Select value={formData.menteesLA1} onValueChange={(val) => setFormData(prev => ({ ...prev, menteesLA1: val }))}>
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Mentee" /></SelectTrigger>
                        <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.fullName} className="py-2 focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{t.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Mentees (General)</Label>
                      <Select value={formData.menteesGen1} onValueChange={(val) => setFormData(prev => ({ ...prev, menteesGen1: val }))}>
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Mentee" /></SelectTrigger>
                        <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.fullName} className="py-2 focus:bg-primary/10 data-[highlighted]:bg-primary/10 focus:text-slate-900 text-slate-800 font-bold">{t.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : selectedDuty?.id === 'room-allocation' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Room Name</Label>
                    <Input placeholder="e.g. Chemistry Lab" value={formData.teacherId} onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Floor / Level</Label>
                    <Input placeholder="e.g. Level 0" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Room Code</Label>
                    <Input placeholder="e.g. L3111" value={formData.floor} onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'class-teacher-lists' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Grade & Section</Label>
                      <Input placeholder="e.g. Grade X - A" value={formData.grade} onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Block</Label>
                      <Input placeholder="e.g. MS, SS" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Non-Class Teachers List (Optional)</Label>
                    <Input placeholder="e.g. Shashikumara R, Prashanth..." value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'staff-list' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Block</Label>
                      <Input placeholder="e.g. MS, SS" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Grade</Label>
                      <Input placeholder="e.g. I to X" value={formData.grade} onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Subject</Label>
                    <Input value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Start Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">End Date</Label>
                    <Input type="date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-8 bg-slate-50 border-t gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 px-8 rounded-xl font-bold text-slate-500 hover:bg-slate-200">Cancel</Button>
              <Button onClick={handleSaveAssignment} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">Save Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CampusPageLayout>
  );
};

export default EkyaItplDutiesPage;
