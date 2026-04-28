import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentPatients } from '@/components/dashboard/RecentPatients';
import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';
import { Users, Syringe, Clock, AlertTriangle } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';

export default function Dashboard() {
  const { patients } = usePatients();
  const { records } = useImmunizations();

  const stats = {
    totalPatients: patients.length,
    completedVaccinations: records.filter(r => r.status === 'completed').length,
    pendingVaccinations: records.filter(r => r.status === 'pending').length,
    overdueVaccinations: records.filter(r => r.status === 'overdue').length,
  };

  return (
    <MainLayout title="Dashboard" subtitle="Welcome to Barangay Panubigan Immunization System">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          variant="default"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Completed Vaccinations"
          value={stats.completedVaccinations}
          icon={Syringe}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Pending Vaccinations"
          value={stats.pendingVaccinations}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Overdue Vaccinations"
          value={stats.overdueVaccinations}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPatients patients={patients} />
        <UpcomingSchedule records={records} patients={patients} />
      </div>
    </MainLayout>
  );
}
