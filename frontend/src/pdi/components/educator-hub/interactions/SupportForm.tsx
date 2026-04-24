import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pdi/components/ui/card';
import { Button } from '@pdi/components/ui/button';
import { Input } from '@pdi/components/ui/input';
import { Label } from '@pdi/components/ui/label';
import { Textarea } from '@pdi/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { toast } from 'sonner';
import api from '@pdi/lib/api';
import { PaperPlaneTilt, CaretLeft } from '@phosphor-icons/react';

const supportSchema = z.object({
  parentName: z.string().min(2, 'Name is required'),
  parentEmail: z.string().email('Invalid email'),
  parentMobile: z.string().min(10, '10-digit mobile number required'),
  studentName: z.string().min(2, 'Student name is required'),
  grade: z.string().min(1, 'Grade is required'),
  campus: z.string().min(1, 'Campus/School is required'),
  concernCategory: z.string().min(1, 'Category is required'),
  concernIssue: z.string().min(10, 'Please provide more details (min 10 characters)'),
  teacherEmail: z.string().email('Associated staff email is required'),
});

type SupportFormData = z.infer<typeof supportSchema>;

export function SupportForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded options matching PTIL schema
  const grades = ["Early Years", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  const campuses = ["Ekya BTM Layout", "Ekya JP Nagar", "Ekya ITPL", "Ekya Byrathi", "Ekya NICE Road", "CMR NPS"];
  const categories = ["Academic", "Logistics/Transport", "Fee/Finance", "Technical Support", "Admissions", "Other"];
  
  // Default support routing emails (mocked)
  const staffByCampus: Record<string, { name: string, email: string }[]> = {
    "Ekya BTM Layout": [{ name: "BTM Layout Support", email: "btm.support@ekya.edu" }, { name: "Principal", email: "principal.btm@ekya.edu" }],
    "Ekya JP Nagar": [{ name: "JP Nagar Support", email: "jpn.support@ekya.edu" }],
    "Ekya ITPL": [{ name: "ITPL Support", email: "itpl.support@ekya.edu" }],
    "Ekya Byrathi": [{ name: "Byrathi Support", email: "byrathi.support@ekya.edu" }],
    "Ekya NICE Road": [{ name: "NICE Road Support", email: "niceroad.support@ekya.edu" }],
    "CMR NPS": [{ name: "CMR NPS Support", email: "nps.support@cmr.edu" }],
  };

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      concernCategory: "Other",
      teacherEmail: "support@ekya.edu", // Fallback
    }
  });

  const selectedCampus = watch('campus');
  const availableStaff = selectedCampus ? (staffByCampus[selectedCampus] || []) : [];

  const onSubmit = async (data: SupportFormData) => {
    try {
      setIsSubmitting(true);
      
      // Mapping to PTIL Record Schema
      const ptilData = {
        meetingRequestedBy: 'SUPPORT_PORTAL',
        meetingDate: new Date().toISOString().split('T')[0], // Today
        meetingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        team: data.campus, // Mapping campus to team
        teacherId: data.teacherEmail, 
        teacherEmail: data.teacherEmail,
        multipleAttendees: false,
        grade: data.grade,
        studentName: `${data.studentName} (Support Request)`,
        concernCategory: data.concernCategory,
        concernIssue: `${data.concernIssue}\n\n[Contact Number: ${data.parentMobile}]`,
        remarks: "Raised via Public Support Portal",
        status: 'UNRESOLVED', // New support requests start as unresolved/new
        informationPassedTo: [],
      };

      await api.post('/ptil/public/submit', ptilData);
      toast.success('Support ticket raised successfully!');
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit support request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
      {/* Parent Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          Parent Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentName">Full Name</Label>
            <Input id="parentName" placeholder="Enter your full name" {...register('parentName')} />
            {errors.parentName && <p className="text-xs text-red-500 font-medium">{errors.parentName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentEmail">Email Address</Label>
            <Input id="parentEmail" type="email" placeholder="your@email.com" {...register('parentEmail')} />
            {errors.parentEmail && <p className="text-xs text-red-500 font-medium">{errors.parentEmail.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentMobile">Mobile Number</Label>
            <Input id="parentMobile" placeholder="10-digit number" {...register('parentMobile')} />
            {errors.parentMobile && <p className="text-xs text-red-500 font-medium">{errors.parentMobile.message}</p>}
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          Student & School Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input id="studentName" placeholder="Enter student's name" {...register('studentName')} />
            {errors.studentName && <p className="text-xs text-red-500 font-medium">{errors.studentName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select onValueChange={(val) => setValue('grade', val)}>
              <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
              <SelectContent>
                {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-xs text-red-500 font-medium">{errors.grade.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Campus / School</Label>
            <Select onValueChange={(val) => {
                 setValue('campus', val);
                 setValue('teacherEmail', '');
            }}>
              <SelectTrigger><SelectValue placeholder="Select Campus" /></SelectTrigger>
              <SelectContent>
                {campuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.campus && <p className="text-xs text-red-500 font-medium">{errors.campus.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Department/Staff to Notify</Label>
            <Select onValueChange={(val) => setValue('teacherEmail', val)} disabled={!selectedCampus}>
              <SelectTrigger><SelectValue placeholder={selectedCampus ? "Select Staff" : "Select Campus First"} /></SelectTrigger>
              <SelectContent>
                {availableStaff.map(s => <SelectItem key={s.email} value={s.email}>{s.name} ({s.email})</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.teacherEmail && <p className="text-xs text-red-500 font-medium">{errors.teacherEmail.message}</p>}
          </div>
        </div>
      </div>

      {/* Support Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          How can we help?
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Category of Issue</Label>
            <Select onValueChange={(val) => setValue('concernCategory', val)}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="concernIssue">Description of the Problem</Label>
            <Textarea 
              id="concernIssue" 
              placeholder="Tell us more about the issue you are facing..." 
              className="min-h-[120px] resize-none"
              {...register('concernIssue')}
            />
            {errors.concernIssue && <p className="text-xs text-red-500 font-medium">{errors.concernIssue.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2">
          {isSubmitting ? "Raising Request..." : (
            <>
              Submit Support Request
              <PaperPlaneTilt weight="bold" size={20} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
