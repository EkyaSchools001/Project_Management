import { VisitorManagement } from '../components/VisitorManagement';

interface VisitorPageProps {
  schoolId?: string;
}

export function VisitorPage({ schoolId }: VisitorPageProps) {
  return (
    <div className="min-h-screen bg-[#18181b] p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Visitor Management</h1>
        <p className="text-white/50">Check-in and manage visitors</p>
      </div>
      <VisitorManagement schoolId={schoolId} />
    </div>
  );
}