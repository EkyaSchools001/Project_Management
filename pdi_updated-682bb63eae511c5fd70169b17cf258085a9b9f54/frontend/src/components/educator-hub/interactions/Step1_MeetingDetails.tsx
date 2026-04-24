import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PTILWizardData } from './PTILWizardForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { toast } from 'sonner';

export function Step1MeetingDetails() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<PTILWizardData>();
  
  const requestedBy = watch('meetingRequestedBy');
  const grade = watch('grade');
  const multipleAttendees = watch('multipleAttendees');

  const [staffList, setStaffList] = React.useState<{ id: string, fullName: string, email: string, role: string, campusId: string }[]>([]);
  const [loadingStaff, setLoadingStaff] = React.useState(true);

  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoadingStaff(true);
        const res = await api.get('/users');
        const users = res.data.data.users;
        // Map to standard structure and remove sensitive fields if any
        setStaffList(users.map((u: any) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            role: u.role,
            campusId: u.campusId
        })));
      } catch (err) {
        toast.error('Failed to load staff list');
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  const selectedTeam = watch('team');
  
  // Group staff by their campus or role for the dropdown
  // For the 'Team' select, we'll now filter the available staff by campus if a team is selected as a proxy for campus/dep
  const filteredStaff = React.useMemo(() => {
    if (!selectedTeam) return [];
    // If Admin/Leadership is selected, show leaders. If Teaching Staff, show teachers.
    if (selectedTeam === 'School Leadership') {
      return staffList.filter(s => ['LEADER', 'ADMIN', 'COORDINATOR'].includes(s.role));
    }
    return staffList.filter(s => s.role === 'TEACHER');
  }, [staffList, selectedTeam]);

  const handleStaffSelect = (staffId: string) => {
    const staff = filteredStaff.find(s => s.id === staffId);
    if (staff) {
      setValue('teacherId', staff.id);
      setValue('teacherEmail', staff.email);
    }
  };

  const grades = ["Early Years", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 10", "Grade 11", "Grade 12"];
  const sections = grade ? [`${grade} - Section A`, `${grade} - Section B`, `${grade} - Section C`] : [];

  return (
    <div className="space-y-8 pb-4">
      {/* SECTION: Meeting Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Meeting Info</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Meeting Requested By</Label>
            <RadioGroup 
              value={requestedBy} 
              onValueChange={(val) => setValue('meetingRequestedBy', val as any)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PARENT" id="parent" />
                <Label htmlFor="parent" className="font-normal">Parent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TEACHER_LEADER" id="teacher" />
                <Label htmlFor="teacher" className="font-normal">Teacher / Leader</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register('meetingDate')} />
              {errors.meetingDate && <p className="text-xs text-destructive">{errors.meetingDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" {...register('meetingTime')} />
              {errors.meetingTime && <p className="text-xs text-destructive">{errors.meetingTime.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Parent Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Parent Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Parent Name <span className="text-destructive">*</span></Label>
            <Input placeholder="Enter parent name" {...register('parentName')} />
            {errors.parentName && <p className="text-xs text-destructive">{errors.parentName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Parent Email <span className="text-destructive">*</span></Label>
            <Input type="email" placeholder="parent@example.com" {...register('parentEmail')} />
            {errors.parentEmail && <p className="text-xs text-destructive">{errors.parentEmail.message}</p>}
          </div>
        </div>
      </div>

      {/* SECTION: Staff Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Staff Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Team</Label>
            <Select 
                onValueChange={(val) => {
                    setValue('team', val);
                    setValue('teacherId', '');
                    setValue('teacherEmail', '');
                }} 
                value={watch('team')}
            >
              <SelectTrigger><SelectValue placeholder="Select Team" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                <SelectItem value="School Leadership">School Leadership</SelectItem>
              </SelectContent>
            </Select>
            {errors.team && <p className="text-xs text-destructive">{errors.team.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Staff Member (Teacher/Leader)</Label>
            <Select onValueChange={handleStaffSelect} value={watch('teacherId')} disabled={!selectedTeam || loadingStaff}>
              <SelectTrigger><SelectValue placeholder={loadingStaff ? "Loading staff..." : selectedTeam ? "Select Staff Member" : "Select Team First"} /></SelectTrigger>
              <SelectContent>
                {filteredStaff.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             {errors.teacherId && <p className="text-xs text-destructive">{errors.teacherId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Staff Email</Label>
            <Input type="email" {...register('teacherEmail')} readOnly placeholder="Auto-populated" className="bg-muted" />
            {errors.teacherEmail && <p className="text-xs text-destructive">{errors.teacherEmail.message}</p>}
          </div>
          
          <div className="space-y-2 flex flex-col justify-center">
            <Label>More than one attendee?</Label>
            <RadioGroup 
              value={multipleAttendees ? 'YES' : 'NO'} 
              onValueChange={(val) => setValue('multipleAttendees', val === 'YES')}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="YES" id="mult_yes" />
                <Label htmlFor="mult_yes" className="font-normal">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NO" id="mult_no" />
                <Label htmlFor="mult_no" className="font-normal">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* SECTION: Section Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Section Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Grade <span className="text-destructive">*</span></Label>
            <Select onValueChange={(val) => { setValue('grade', val); setValue('studentName', ''); }} value={grade}>
              <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
              <SelectContent>
                {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-xs text-destructive">{errors.grade.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Section Name <span className="text-destructive">*</span></Label>
            <Select onValueChange={(val) => setValue('studentName', val)} value={watch('studentName')} disabled={!grade}>
              <SelectTrigger><SelectValue placeholder={grade ? "Select Section" : "Select Grade First"} /></SelectTrigger>
              <SelectContent>
                {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.studentName && <p className="text-xs text-destructive">{errors.studentName.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
