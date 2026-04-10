import React, { useState } from 'react';
import { Clock, Mail, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Checkbox } from '../../../components/ui/checkbox';
import reportService from '../../../services/report.service';

interface ScheduleReportModalProps {
  reportId: string | null;
  onClose: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily', description: 'Every day at the specified time' },
  { value: 'weekly', label: 'Weekly', description: 'Once a week on the selected day' },
  { value: 'monthly', label: 'Monthly', description: 'Once a month on the selected date' },
];

const TIME_OPTIONS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function ScheduleReportModal({ reportId, onClose }: ScheduleReportModalProps) {
  const [frequency, setFrequency] = useState('weekly');
  const [time, setTime] = useState('09:00');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [format, setFormat] = useState('pdf');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRecipient = () => {
    if (newRecipient && newRecipient.includes('@')) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSubmit = async () => {
    if (!reportId) {
      setError('Please save the report first before scheduling');
      return;
    }
    if (recipients.length === 0) {
      setError('Please add at least one recipient');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reportService.scheduleReport({
        reportId,
        frequency,
        time,
        recipients,
        format,
        enabled
      });
      alert('Report scheduled successfully!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule Report
          </DialogTitle>
          <DialogDescription>
            Set up automated report delivery
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="mb-2 block">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Delivery Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Recipients</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
              />
              <Button type="button" variant="outline" onClick={handleAddRecipient}>
                Add
              </Button>
            </div>
            {recipients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recipients.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(email)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recipients added</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setEnabled(checked as boolean)}
            />
            <Label htmlFor="enabled" className="cursor-pointer">
              Enable schedule immediately
            </Label>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}