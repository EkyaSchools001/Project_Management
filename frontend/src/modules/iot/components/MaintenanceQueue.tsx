import { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface MaintenanceRequest {
  id: string;
  deviceId: string;
  device?: { name: string; location?: string };
  description: string;
  status: 'Open' | 'InProgress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

interface MaintenanceQueueProps {
  schoolId?: string;
}

export function MaintenanceQueue({ schoolId }: MaintenanceQueueProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    deviceId: '',
    description: '',
    priority: 'Medium',
  });

  useEffect(() => {
    loadRequests();
    loadDevices();
  }, [schoolId]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/iot/maintenance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const response = await fetch(`/api/v1/iot/devices?schoolId=${schoolId || ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setDevices(data);
    } catch (err) {
      console.error('Failed to load devices:', err);
    }
  };

  const handleCreateRequest = async () => {
    if (!formData.deviceId || !formData.description) return;
    setLoading(true);
    try {
      await fetch('/api/v1/iot/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      setShowDialog(false);
      setFormData({ deviceId: '', description: '', priority: 'Medium' });
      loadRequests();
    } catch (err) {
      console.error('Failed to create request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: string) => {
    setLoading(true);
    try {
      await fetch(`/api/v1/iot/maintenance/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      loadRequests();
    } catch (err) {
      console.error('Failed to update request:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-400 bg-red-500/10';
      case 'High': return 'text-orange-400 bg-orange-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-blue-400 bg-violet-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-400';
      case 'InProgress': return 'text-yellow-400';
      case 'Completed': return 'text-violet-400';
      default: return 'text-gray-400';
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'open') return r.status === 'Open';
    if (filter === 'inprogress') return r.status === 'InProgress';
    return true;
  });

  const openCount = requests.filter((r) => r.status === 'Open').length;
  const inProgressCount = requests.filter((r) => r.status === 'InProgress').length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-foreground">{openCount} Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Wrench className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-foreground">{inProgressCount} In Progress</span>
          </div>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#8b5cf6] text-black hover:bg-[#a8e600]">
              <Wrench className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1d29] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">Maintenance Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground/70">Device</Label>
                <Select value={formData.deviceId} onValueChange={(v) => setFormData({ ...formData, deviceId: v })}>
                  <SelectTrigger className="bg-[#0d1117] border-white/10 text-foreground">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d29] border-white/10">
                    {devices.map((device) => (
                      <SelectItem key={device.id} value={device.id} className="text-foreground">
                        {device.name} ({device.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground/70">Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue"
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground/70">Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger className="bg-[#0d1117] border-white/10 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d29] border-white/10">
                    <SelectItem value="Low" className="text-blue-400">Low</SelectItem>
                    <SelectItem value="Medium" className="text-yellow-400">Medium</SelectItem>
                    <SelectItem value="High" className="text-orange-400">High</SelectItem>
                    <SelectItem value="Urgent" className="text-red-400">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreateRequest}
                disabled={loading || !formData.deviceId || !formData.description}
                className="w-full bg-[#8b5cf6] text-black hover:bg-[#a8e600]"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#1a1d29] border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Maintenance Queue</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40 bg-[#0d1117] border-white/10 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1d29] border-white/10">
                <SelectItem value="all" className="text-foreground">All</SelectItem>
                <SelectItem value="open" className="text-foreground">Open</SelectItem>
                <SelectItem value="inprogress" className="text-foreground">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-3 rounded-lg bg-[#0d1117] border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                      <span className={`text-sm ${getStatusColor(request.status)}`}>{request.status}</span>
                    </div>
                    <p className="text-foreground mt-1">{request.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-foreground/50">
                      <span>{request.device?.name}</span>
                      {request.assignedTo && <span>Assigned: {request.assignedTo}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {request.status === 'Open' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(request.id, 'InProgress')}
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Wrench className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {request.status === 'InProgress' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(request.id, 'Completed')}
                        className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <div className="text-center text-foreground/50 py-8">
                No maintenance requests
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}