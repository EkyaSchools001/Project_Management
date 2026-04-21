import { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, Calendar, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  deviceId: string;
  timestamp: string;
  type: 'CheckIn' | 'CheckOut';
}

interface AttendanceTrackerProps {
  schoolId?: string;
  onCheckIn?: (studentId: string) => void;
  onCheckOut?: (studentId: string) => void;
}

export function AttendanceTracker({ schoolId, onCheckIn, onCheckOut }: AttendanceTrackerProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    loadAttendance();
  }, [schoolId]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/iot/attendance/today?schoolId=${schoolId || ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!studentId.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/v1/iot/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ studentId, deviceId: 'manual', type: 'CheckIn' }),
      });
      setStudentId('');
      loadAttendance();
      onCheckIn?.(studentId);
    } catch (err) {
      console.error('Failed to check in:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (record: AttendanceRecord) => {
    setLoading(true);
    try {
      await fetch('/api/v1/iot/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ studentId: record.studentId, deviceId: record.deviceId, type: 'CheckOut' }),
      });
      loadAttendance();
      onCheckOut?.(record.studentId);
    } catch (err) {
      console.error('Failed to check out:', err);
    } finally {
      setLoading(false);
    }
  };

  const todayRecords = records.filter((r) => {
    const today = new Date().toDateString();
    return new Date(r.timestamp).toDateString() === today;
  });

  const checkIns = todayRecords.filter((r) => r.type === 'CheckIn').length;
  const checkOuts = todayRecords.filter((r) => r.type === 'CheckOut').length;
  const present = checkIns - checkOuts;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#BAFF00]/10">
                <UserCheck className="w-5 h-5 text-[#BAFF00]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{checkIns}</p>
                <p className="text-xs text-foreground/50">Check-ins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-backgroundlue-500/10">
                <UserX className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{checkOuts}</p>
                <p className="text-xs text-foreground/50">Check-outs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{present}</p>
                <p className="text-xs text-foreground/50">Currently Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{records.length}</p>
                <p className="text-xs text-foreground/50">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a1d29] border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
              className="bg-[#0d1117] border-white/10 text-foreground"
            />
            <Button
              onClick={handleCheckIn}
              disabled={loading || !studentId.trim()}
              className="bg-[#BAFF00] text-black hover:bg-[#a8e600]"
            >
              Check In
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1d29] border-white/10">
        <CardHeader>
          <CardTitle className="text-foreground">Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground/70">Student ID</TableHead>
                <TableHead className="text-foreground/70">Time</TableHead>
                <TableHead className="text-foreground/70">Type</TableHead>
                <TableHead className="text-foreground/70">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.slice(0, 20).map((record) => (
                <TableRow key={record.id} className="border-white/10">
                  <TableCell className="text-foreground">{record.studentId}</TableCell>
                  <TableCell className="text-foreground/70">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={record.type === 'CheckIn' ? 'default' : 'secondary'}
                      className={record.type === 'CheckIn' ? 'bg-green-500' : 'bg-backgroundlue-500'}
                    >
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.type === 'CheckIn' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCheckOut(record)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Check Out
                      </Button>
                    ) : (
                      <span className="text-green-400">Complete</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-foreground/50 py-8">
                    No attendance records today
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}