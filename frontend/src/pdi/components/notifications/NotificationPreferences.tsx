import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Clock, Save } from 'lucide-react';
import { Button } from '@pdi/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@pdi/components/ui/card';
import { Switch } from '@pdi/components/ui/switch';
import { Label } from '@pdi/components/ui/label';
import { Input } from '@pdi/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pdi/components/ui/select';
import { toast } from 'sonner';
import { notificationService } from '@pdi/services/notificationService';

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  taskNotifications: boolean;
  projectNotifications: boolean;
  messageNotifications: boolean;
  systemNotifications: boolean;
  alertNotifications: boolean;
  reminderNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: string;
}

export const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    taskNotifications: true,
    projectNotifications: true,
    messageNotifications: true,
    systemNotifications: true,
    alertNotifications: true,
    reminderNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    digestFrequency: 'realtime',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await notificationService.getPreferences();
      if (prefs) {
        setPreferences({
          emailEnabled: prefs.emailEnabled ?? true,
          pushEnabled: prefs.pushEnabled ?? true,
          smsEnabled: prefs.smsEnabled ?? false,
          taskNotifications: prefs.taskNotifications ?? true,
          projectNotifications: prefs.projectNotifications ?? true,
          messageNotifications: prefs.messageNotifications ?? true,
          systemNotifications: prefs.systemNotifications ?? true,
          alertNotifications: prefs.alertNotifications ?? true,
          reminderNotifications: prefs.reminderNotifications ?? true,
          quietHoursEnabled: prefs.quietHoursEnabled ?? false,
          quietHoursStart: prefs.quietHoursStart ?? '22:00',
          quietHoursEnd: prefs.quietHoursEnd ?? '07:00',
          digestFrequency: prefs.digestFrequency ?? 'realtime',
        });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await notificationService.updatePreferences(preferences);
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50">Loading preferences...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notification Preferences</h2>
          <p className="text-foreground/50">Manage how you receive notifications</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#ef4444] text-black hover:bg-[#ef4444]/80"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⟳</span> Saving...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bell className="w-5 h-5 text-[#ef4444]" />
              Delivery Methods
            </CardTitle>
            <CardDescription className="text-foreground/50">
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-foreground/50" />
                <Label htmlFor="email" className="text-foreground">Email Notifications</Label>
              </div>
              <Switch
                id="email"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) => updatePreference('emailEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-foreground/50" />
                <Label htmlFor="push" className="text-foreground">Push Notifications</Label>
              </div>
              <Switch
                id="push"
                checked={preferences.pushEnabled}
                onCheckedChange={(checked) => updatePreference('pushEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-foreground/50" />
                <Label htmlFor="sms" className="text-foreground">SMS Notifications</Label>
              </div>
              <Switch
                id="sms"
                checked={preferences.smsEnabled}
                onCheckedChange={(checked) => updatePreference('smsEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground">Notification Types</CardTitle>
            <CardDescription className="text-foreground/50">
              Choose which types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tasks" className="text-foreground">Task Assignments</Label>
              <Switch
                id="tasks"
                checked={preferences.taskNotifications}
                onCheckedChange={(checked) => updatePreference('taskNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="projects" className="text-foreground">Project Updates</Label>
              <Switch
                id="projects"
                checked={preferences.projectNotifications}
                onCheckedChange={(checked) => updatePreference('projectNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="messages" className="text-foreground">Messages</Label>
              <Switch
                id="messages"
                checked={preferences.messageNotifications}
                onCheckedChange={(checked) => updatePreference('messageNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="system" className="text-foreground">System Notifications</Label>
              <Switch
                id="system"
                checked={preferences.systemNotifications}
                onCheckedChange={(checked) => updatePreference('systemNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="alerts" className="text-foreground">Alerts</Label>
              <Switch
                id="alerts"
                checked={preferences.alertNotifications}
                onCheckedChange={(checked) => updatePreference('alertNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminders" className="text-foreground">Reminders</Label>
              <Switch
                id="reminders"
                checked={preferences.reminderNotifications}
                onCheckedChange={(checked) => updatePreference('reminderNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-[#ef4444]" />
              Quiet Hours
            </CardTitle>
            <CardDescription className="text-foreground/50">
              Set a time when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quietHours" className="text-foreground">Enable Quiet Hours</Label>
              <Switch
                id="quietHours"
                checked={preferences.quietHoursEnabled}
                onCheckedChange={(checked) => updatePreference('quietHoursEnabled', checked)}
              />
            </div>

            {preferences.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/70">Start Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHoursStart}
                    onChange={(e) => updatePreference('quietHoursStart', e.target.value)}
                    className="bg-white/5 border-white/10 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/70">End Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHoursEnd}
                    onChange={(e) => updatePreference('quietHoursEnd', e.target.value)}
                    className="bg-white/5 border-white/10 text-foreground"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground">Email Digest Frequency</Label>
              <Select
                value={preferences.digestFrequency}
                onValueChange={(value) => updatePreference('digestFrequency', value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="realtime" className="text-foreground">Real-time</SelectItem>
                  <SelectItem value="hourly" className="text-foreground">Hourly</SelectItem>
                  <SelectItem value="daily" className="text-foreground">Daily Digest</SelectItem>
                  <SelectItem value="weekly" className="text-foreground">Weekly Digest</SelectItem>
                  <SelectItem value="never" className="text-foreground">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPreferences;