import { MaintenanceQueue } from '../components/MaintenanceQueue';

interface MaintenancePageProps {
  schoolId?: string;
}

export function MaintenancePage({ schoolId }: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-[#18181b] p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Maintenance</h1>
        <p className="text-foreground/50">IoT device maintenance requests</p>
      </div>
      <MaintenanceQueue schoolId={schoolId} />
    </div>
  );
}