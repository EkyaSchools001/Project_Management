import { useState, useEffect } from 'react';
import { UserPlus, User, Clock, MapPin, Phone, Mail, QrCode, Printer, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';

interface Visitor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  purpose?: string;
  checkInTime: string;
  checkOutTime?: string;
  badgeNumber?: string;
}

interface VisitorManagementProps {
  schoolId?: string;
}

export function VisitorManagement({ schoolId }: VisitorManagementProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
  });

  useEffect(() => {
    loadVisitors();
  }, [schoolId]);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/iot/visitors?schoolId=${schoolId || ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setVisitors(data);
    } catch (err) {
      console.error('Failed to load visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!formData.name.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/v1/iot/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          schoolId,
        }),
      });
      setShowDialog(false);
      setFormData({ name: '', email: '', phone: '', purpose: '' });
      loadVisitors();
    } catch (err) {
      console.error('Failed to check in visitor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    setLoading(true);
    try {
      await fetch(`/api/v1/iot/visitors/${visitorId}/checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      loadVisitors();
    } catch (err) {
      console.error('Failed to check out visitor:', err);
    } finally {
      setLoading(false);
    }
  };

  const todayVisitors = visitors.filter((v) => {
    const today = new Date().toDateString();
    return new Date(v.checkInTime).toDateString() === today;
  });

  const currentVisitors = todayVisitors.filter((v) => !v.checkOutTime);
  const checkedOut = todayVisitors.filter((v) => v.checkOutTime);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#BAFF00]/10">
                <User className="w-5 h-5 text-[#BAFF00]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentVisitors.length}</p>
                <p className="text-xs text-foreground/50">Currently Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-backgroundlue-500/10">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{todayVisitors.length}</p>
                <p className="text-xs text-foreground/50">Today's Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <LogOut className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{checkedOut.length}</p>
                <p className="text-xs text-foreground/50">Checked Out</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">Visitor Check-in</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#BAFF00] text-black hover:bg-[#a8e600]">
              <UserPlus className="w-4 h-4 mr-2" />
              Check In Visitor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1d29] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">Visitor Check-in</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground/70">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Visitor name"
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground/70">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="visitor@email.com"
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground/70">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground/70">Purpose of Visit</Label>
                <Input
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Meeting with..."
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <Button
                onClick={handleCheckIn}
                disabled={loading || !formData.name.trim()}
                className="w-full bg-[#BAFF00] text-black hover:bg-[#a8e600]"
              >
                {loading ? 'Checking in...' : 'Check In'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#1a1d29] border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Current Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117] border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{visitor.name}</p>
                    {visitor.badgeNumber && (
                      <Badge className="bg-[#BAFF00]/20 text-[#BAFF00]">
                        {visitor.badgeNumber}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-foreground/50">
                    {visitor.purpose && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {visitor.purpose}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Checked in: {new Date(visitor.checkInTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVisitor(visitor)}
                    className="border-white/20 text-foreground hover:bg-white/10"
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    Badge
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckOut(visitor.id)}
                    className="border-white/20 text-foreground hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {currentVisitors.length === 0 && (
              <div className="text-center text-foreground/50 py-8">
                No visitors currently checked in
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}