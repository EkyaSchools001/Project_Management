import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@pdi/components/ui/label';
import { Textarea } from '@pdi/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@pdi/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { PTILWizardData } from './PTILWizardForm';
import { Badge } from '@pdi/components/ui/badge';
import { X } from '@phosphor-icons/react';

export function Step2ConcernDetails() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<PTILWizardData>();
  
  const status = watch('status');
  const passedTo = watch('informationPassedTo') || [];

  const CATEGORIES = [
    "Academic Performance", "Behavioral Issues", "Attendance", 
    "Health and Well-being", "Special Educational Needs", 
    "Logistics/Transport", "Fee/Finance", "General Query/Feedback"
  ];

  const ROLES_TO_PASS = [
    "HOS", "Coordinator - Early Years", "Academic Coordinator - Primary",
    "Academic Coordinator - Middle", "Academic Coordinator - Senior",
    "Campus AM", "CCA Coordinator", "CCA - Primary", "Class Teacher", 
    "LA Teacher", "School Counsellor", "Campus Manager", "Campus Supervisor",
    "Transport Manager", "Vendor", "NA"
  ];

  const handleTogglePassedTo = (role: string) => {
    if (passedTo.includes(role)) {
      setValue('informationPassedTo', passedTo.filter(r => r !== role));
    } else {
      setValue('informationPassedTo', [...passedTo, role]);
    }
  };

  return (
    <div className="space-y-8 pb-4">
      {/* SECTION: Concern Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Concern Details</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Concern Category <span className="text-destructive">*</span></Label>
            <Select onValueChange={(val) => setValue('concernCategory', val)} value={watch('concernCategory')}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.concernCategory && <p className="text-xs text-destructive">{errors.concernCategory.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Concern / Issue Details <span className="text-destructive">*</span></Label>
            <Textarea 
              className="min-h-[120px]" 
              placeholder="Provide a detailed objective description of the parent's concern..."
              {...register('concernIssue')} 
            />
            {errors.concernIssue && <p className="text-xs text-destructive">{errors.concernIssue.message}</p>}
          </div>
        </div>
      </div>

      {/* SECTION: Meeting Outcome */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Meeting Outcome</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Remarks / Action Taken</Label>
            <Textarea 
              className="min-h-[80px]" 
              placeholder="What was decided? What are the next steps?"
              {...register('remarks')} 
            />
          </div>

          <div className="space-y-2">
            <Label>Current Status</Label>
            <RadioGroup 
              value={status} 
              onValueChange={(val) => setValue('status', val as any)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 justify-center text-center cursor-pointer data-[state=checked]:border-green-500 data-[state=checked]:bg-green-50" data-state={status === 'RESOLVED' ? 'checked' : 'unchecked'} onClick={() => setValue('status', 'RESOLVED')}>
                 <RadioGroupItem value="RESOLVED" id="resolved" className="sr-only" />
                 <Label htmlFor="resolved" className="cursor-pointer text-green-700 font-semibold mb-0">Resolved</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 justify-center text-center cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50" data-state={status === 'IN_PROGRESS' ? 'checked' : 'unchecked'} onClick={() => setValue('status', 'IN_PROGRESS')}>
                 <RadioGroupItem value="IN_PROGRESS" id="in_progress" className="sr-only" />
                 <Label htmlFor="in_progress" className="cursor-pointer text-blue-700 font-semibold mb-0">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 justify-center text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50" data-state={status === 'PARKED' ? 'checked' : 'unchecked'} onClick={() => setValue('status', 'PARKED')}>
                 <RadioGroupItem value="PARKED" id="parked" className="sr-only" />
                 <Label htmlFor="parked" className="cursor-pointer text-orange-700 font-semibold mb-0">Parked</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 justify-center text-center cursor-pointer data-[state=checked]:border-red-500 data-[state=checked]:bg-red-50" data-state={status === 'UNRESOLVED' ? 'checked' : 'unchecked'} onClick={() => setValue('status', 'UNRESOLVED')}>
                 <RadioGroupItem value="UNRESOLVED" id="unresolved" className="sr-only" />
                 <Label htmlFor="unresolved" className="cursor-pointer text-red-700 font-semibold mb-0 text-sm">Unresolved</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Information Passed To (Email Notifications will be sent)</Label>
            
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-muted/20">
              {passedTo.length === 0 && <span className="text-muted-foreground text-sm italic py-1 px-2">No one selected</span>}
              {passedTo.map(role => (
                <Badge key={role} variant="secondary" className="flex items-center gap-1">
                  {role}
                  <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => handleTogglePassedTo(role)} />
                </Badge>
              ))}
            </div>

            <Select onValueChange={handleTogglePassedTo}>
              <SelectTrigger><SelectValue placeholder="Add roles to notify..." /></SelectTrigger>
              <SelectContent>
                {ROLES_TO_PASS.map(role => (
                  <SelectItem key={role} value={role} disabled={passedTo.includes(role)}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
