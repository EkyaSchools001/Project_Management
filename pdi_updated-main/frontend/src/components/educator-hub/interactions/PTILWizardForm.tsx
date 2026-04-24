import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Step1MeetingDetails } from './Step1_MeetingDetails';
import { Step2ConcernDetails } from './Step2_ConcernDetails';
import api from '@/lib/api';
import { toast } from 'sonner';

// The combined Zod schema for both steps
export const wizardSchema = z.object({
  meetingRequestedBy: z.enum(['PARENT', 'TEACHER_LEADER']),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  meetingTime: z.string().min(1, 'Meeting time is required'),
  parentName: z.string().min(2, 'Parent name is required'),
  parentEmail: z.string().email('Invalid email address'),
  team: z.string().min(1, 'Team is required'),
  teacherId: z.string().min(1, 'Teacher (ID or Name) is required'),
  teacherEmail: z.string().email('Invalid teacher email address'),
  multipleAttendees: z.boolean().default(false),
  grade: z.string().min(1, 'Grade is required'),
  studentName: z.string().min(1, 'Section name is required'),
  
  concernCategory: z.string().min(1, 'Category is required'),
  concernIssue: z.string().min(5, 'Please provide details for the issue'),
  remarks: z.string().optional(),
  status: z.enum(['RESOLVED', 'IN_PROGRESS', 'PARKED', 'UNRESOLVED']).default('IN_PROGRESS'),
  informationPassedTo: z.array(z.string()).default([]),
});

export type PTILWizardData = z.infer<typeof wizardSchema>;

interface Props {
  onSuccess: () => void;
  currentUserRole?: string;
  currentUserId?: string;
  currentUserEmail?: string;
  isPublic?: boolean;
  onCancel?: () => void;
}

export function PTILWizardForm({ 
  onSuccess, 
  currentUserRole = 'TEACHER', 
  currentUserId = '', 
  currentUserEmail = '',
  isPublic = false,
  onCancel
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<PTILWizardData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      meetingRequestedBy: 'PARENT',
      multipleAttendees: false,
      status: 'IN_PROGRESS',
      informationPassedTo: [],
      teacherId: !isPublic && ['TEACHER'].includes(currentUserRole) ? currentUserId : '',
      teacherEmail: !isPublic && ['TEACHER'].includes(currentUserRole) ? currentUserEmail : '',
      team: !isPublic && ['TEACHER'].includes(currentUserRole) ? 'Teaching Staff' : '',
    },
    mode: 'onChange',
  });

  const handleNext = async () => {
    const step1Valid = await methods.trigger([
      'meetingRequestedBy', 'meetingDate', 'meetingTime', 
      'parentName', 'parentEmail', 'team', 'teacherId', 
      'teacherEmail', 'multipleAttendees', 'grade', 'studentName'
    ]);
    if (step1Valid) {
      setStep(2);
    } else {
      toast.error('Please complete all mandatory Meeting Details before proceeding.');
    }
  };

  const onSubmit = async (data: PTILWizardData) => {
    try {
      setIsSubmitting(true);
      const endpoint = isPublic ? '/ptil/public/submit' : '/ptil';
      await api.post(endpoint, data);
      toast.success('Interaction Logged Successfully!');
      methods.reset();
      setStep(1);
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit interaction log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stepper Header */}
      <div className="px-6 py-4 border-b shrink-0 bg-muted/5">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>1</div>
            <span className="text-sm font-medium">Meeting Details</span>
          </div>
          <div className="h-px bg-border flex-1" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</div>
            <span className="text-sm font-medium">Concern Details & Outcome</span>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form id="ptil-form" onSubmit={methods.handleSubmit(onSubmit, (errs) => {
            console.log("Validation errors:", errs);
            toast.error('Please fix errors in fields: ' + Object.keys(errs).join(', '));
            if (Object.keys(errs).some(k => ['meetingRequestedBy', 'meetingDate', 'meetingTime', 'parentName', 'parentEmail', 'team', 'teacherId', 'teacherEmail', 'grade', 'studentName'].includes(k))) {
                setStep(1);
            }
        })} className="flex-1 overflow-y-auto px-6 py-4">
          {/* Always render both steps but hide the inactive one to prevent React Hook Form from unregistering unmounted fields */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <Step1MeetingDetails />
          </div>
          <div className={step === 2 ? 'block' : 'hidden'}>
             <Step2ConcernDetails />
          </div>
        </form>
      </FormProvider>

      <div className="px-6 py-4 border-t shrink-0 flex justify-between items-center bg-muted/20">
        <div className="flex gap-2">
          {step === 2 ? (
            <Button variant="outline" onClick={() => setStep(1)} type="button">Back</Button>
          ) : (
             onCancel && <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
          )}
        </div>
        
        {step === 1 ? (
          <Button onClick={handleNext} type="button">Next: Concern Details</Button>
        ) : (
          <Button type="submit" form="ptil-form" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Log'}
          </Button>
        )}
      </div>
    </div>
  );
}
