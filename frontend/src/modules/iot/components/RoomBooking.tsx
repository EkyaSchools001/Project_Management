import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, X, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface Room {
  id: string;
  name: string;
  building?: string;
  capacity: number;
  amenities?: string;
}

interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
  purpose?: string;
  room?: Room;
}

interface RoomBookingProps {
  schoolId?: string;
  userId?: string;
}

export function RoomBooking({ schoolId, userId }: RoomBookingProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    purpose: '',
  });

  useEffect(() => {
    loadRooms();
    loadBookings();
  }, [schoolId]);

  const loadRooms = async () => {
    try {
      const response = await fetch(`/api/v1/iot/rooms?schoolId=${schoolId || ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  };

  const loadBookings = async () => {
    try {
      const start = new Date().toISOString();
      const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const response = await fetch(`/api/v1/iot/bookings?startDate=${start}&endDate=${end}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleBooking = async () => {
    if (!formData.roomId || !formData.date || !formData.startTime || !formData.endTime) return;
    setLoading(true);
    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;

      await fetch('/api/v1/iot/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          roomId: formData.roomId,
          userId: userId || 'current',
          startTime: startDateTime,
          endTime: endDateTime,
          purpose: formData.purpose,
        }),
      });
      setShowDialog(false);
      setFormData({ roomId: '', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', purpose: '' });
      loadBookings();
    } catch (err) {
      console.error('Failed to create booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-red-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">Room Booking</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#ef4444] text-black hover:bg-[#a8e600]">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1d29] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">Book a Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground/70">Room</Label>
                <Select value={formData.roomId} onValueChange={(v) => setFormData({ ...formData, roomId: v })}>
                  <SelectTrigger className="bg-[#0d1117] border-white/10 text-foreground">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1d29] border-white/10">
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id} className="text-foreground">
                        {room.name} ({room.building})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground/70">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground/70">Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="bg-[#0d1117] border-white/10 text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground/70">End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="bg-[#0d1117] border-white/10 text-foreground"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground/70">Purpose (Optional)</Label>
                <Input
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="bg-[#0d1117] border-white/10 text-foreground"
                />
              </div>
              <Button
                onClick={handleBooking}
                disabled={loading || !formData.roomId}
                className="w-full bg-[#ef4444] text-black hover:bg-[#a8e600]"
              >
                {loading ? 'Booking...' : 'Book Room'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const roomBookings = bookings.filter((b) => b.roomId === room.id);
          return (
            <Card key={room.id} className="bg-[#1a1d29] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#ef4444]" />
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-foreground/50">
                    <MapPin className="w-3 h-3" />
                    {room.building || 'No building'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/50">
                    <Users className="w-3 h-3" />
                    Capacity: {room.capacity}
                  </div>
                  {room.amenities && (
                    <p className="text-xs text-foreground/50">{room.amenities}</p>
                  )}
                  {roomBookings.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-foreground/50">Upcoming bookings: {roomBookings.length}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {bookings.length > 0 && (
        <Card className="bg-[#1a1d29] border-white/10">
          <CardHeader>
            <CardTitle className="text-foreground">My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-2 rounded bg-[#0d1117]">
                  <div>
                    <p className="text-sm text-foreground">{booking.room?.name}</p>
                    <p className="text-xs text-foreground/50">
                      {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}