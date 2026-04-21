import { AttendanceTracker } from '../components/AttendanceTracker';

interface AttendancePageProps {
  schoolId?: string;
}

export function AttendancePage({ schoolId }: AttendancePageProps) {
  return (
    <div className="min-h-screen bg-[#18181b] p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Attendance Tracking</h1>
        <p className="text-foreground/50">Track student check-ins and check-outs</p>
      </div>
      <AttendanceTracker schoolId={schoolId} />
    </div>
  );
}