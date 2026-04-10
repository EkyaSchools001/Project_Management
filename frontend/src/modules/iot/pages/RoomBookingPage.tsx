import { RoomBooking } from '../components/RoomBooking';

interface RoomBookingPageProps {
  schoolId?: string;
  userId?: string;
}

export function RoomBookingPage({ schoolId, userId }: RoomBookingPageProps) {
  return (
    <div className="min-h-screen bg-[#0B0E14] p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Room Booking</h1>
        <p className="text-white/50">Book meeting rooms and facilities</p>
      </div>
      <RoomBooking schoolId={schoolId} userId={userId} />
    </div>
  );
}