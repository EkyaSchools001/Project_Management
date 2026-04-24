import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@pdi/components/ui/dialog';
import { PTILWizardForm } from './PTILWizardForm';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentUserRole: string;
  currentUserId: string;
  currentUserEmail: string;
}

export function PTILWizardModal({ open, onOpenChange, onSuccess, currentUserRole, currentUserId, currentUserEmail }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Parent-Teacher Interaction Log</DialogTitle>
        </DialogHeader>

        <PTILWizardForm 
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          currentUserEmail={currentUserEmail}
          isPublic={false}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
