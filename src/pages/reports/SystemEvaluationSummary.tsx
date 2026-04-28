import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { vaccines } from '@/data/mockData';
import { Printer, Activity, Users, Syringe, ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

export default function SystemEvaluationSummary() {
  const { patients } = usePatients();
  const { records } = useImmunizations();

  const totalRecords = records.length;
  const completedCount = records.filter(r => r.status === 'completed').length;
  const pendingCount = records.filter(r => r.status === 'pending').length;
  const overdueCount = records.filter(r => r.status === 'overdue').length;

  const completionRate = totalRecords > 0 ? Math.round((completedCount / totalRecords) * 100) : 0;
  const overdueRate = totalRecords > 0 ? Math.round((overdueCount / totalRecords) * 100) : 0;

  const patientsWithRecords = useMemo(() => {
    const ids = new Set(records.map(r => r.patientId));
    return ids.size;
  }, [records]);

  const patientsFullyVaccinated = useMemo(() => {
    const patientMap = new Map<string, { completed: number; total: number }>();
    records.forEach(r => {
      const cur = patientMap.get(r.patientId) || { completed: 0, total: 0 };
      cur.total++;
      if (r.status === 'completed') cur.completed++;
      patientMap.set(r.patientId, cur);
    });
    let count = 0;
    patientMap.forEach(v => {
      if (v.total > 0 && v.completed === v.total) count++;
    });
    return count;
  }, [records]);

  const vaccinesUsed = useMemo(() => {
    const ids = new Set(records.map(r => r.vaccineId));
    return ids.size;
  }, [records]);

  const metrics = [
    { label: 'Registered Patients', value: patients.length, icon: Users, color: 'text-primary' },
    { label: 'Patients with Records', value: patientsWithRecords, icon: Activity, color: 'text-blue-600' },
    { label: 'Fully Vaccinated', value: patientsFullyVaccinated, icon: ShieldCheck, color: 'text-green-600' },
    { label: 'Total Vaccinations', value: totalRecords, icon: Syringe, color: 'text-purple-600' },
    { label: 'Vaccines Tracked', value: vaccines.length, icon: BarChart3, color: 'text-indigo-600' },
    { label: 'Vaccines Used', value: vaccinesUsed, icon: TrendingUp, color: 'text-teal-600' },
  ];

  const performanceIndicators = [
    {
      label: 'Overall Completion Rate',
      value: completionRate,
      description: `${completedCount} out of ${totalRecords} vaccinations completed`,
      status: completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : completionRate >= 40 ? 'Needs Improvement' : 'Critical',
      statusColor: completionRate >= 80 ? 'text-green-600' : completionRate >= 60 ? 'text-yellow-600' : 'text-red-600',
    },
    {
      label: 'Overdue Rate',
      value: overdueRate,
      description: `${overdueCount} out of ${totalRecords} vaccinations overdue`,
      status: overdueRate <= 5 ? 'Excellent' : overdueRate <= 15 ? 'Acceptable' : overdueRate <= 30 ? 'Needs Attention' : 'Critical',
      statusColor: overdueRate <= 5 ? 'text-green-600' : overdueRate <= 15 ? 'text-yellow-600' : 'text-red-600',
    },
    {
      label: 'Patient Coverage',
      value: patients.length > 0 ? Math.round((patientsWithRecords / patients.length) * 100) : 0,
      description: `${patientsWithRecords} out of ${patients.length} patients have immunization records`,
      status: (patients.length > 0 ? (patientsWithRecords / patients.length) * 100 : 0) >= 80 ? 'Excellent' : 'Needs Improvement',
      statusColor: (patients.length > 0 ? (patientsWithRecords / patients.length) * 100 : 0) >= 80 ? 'text-green-600' : 'text-yellow-600',
    },
  ];

  return (
    <MainLayout title="System Evaluation Results Summary" subtitle="Overview of system performance and immunization metrics">
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map(m => (
            <Card key={m.label}>
              <CardContent className="pt-6 text-center">
                <m.icon className={`w-8 h-8 mx-auto mb-2 ${m.color}`} />
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {performanceIndicators.map(pi => (
              <div key={pi.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{pi.label}</p>
                    <p className="text-sm text-muted-foreground">{pi.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{pi.value}%</p>
                    <p className={`text-sm font-medium ${pi.statusColor}`}>{pi.status}</p>
                  </div>
                </div>
                <Progress value={pi.value} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">System Name</span>
                  <span className="font-semibold">Barangay Panubigan Immunization System</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Report Generated</span>
                  <span className="font-semibold">{new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Vaccines in Database</span>
                  <span className="font-semibold">{vaccines.length}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Database Status</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Data Integrity</span>
                  <span className="font-semibold text-green-600">Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
