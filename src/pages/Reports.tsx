import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { User, Calendar, Package, Activity, ChevronRight, Printer, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { vaccines } from '@/data/mockData';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { downloadCsv } from '@/utils/exportCsv';

const reportItems = [
  {
    title: 'Patient Immunization Record',
    description: 'View individual patient vaccination history and status',
    icon: User,
    path: '/reports/patient-record',
  },
  {
    title: 'Monthly Immunization Coverage Report',
    description: 'Monthly breakdown of immunization coverage by vaccine',
    icon: Calendar,
    path: '/reports/monthly-coverage',
  },
  {
    title: 'Vaccine Inventory Status Report',
    description: 'Overview of all tracked vaccines and their usage statistics',
    icon: Package,
    path: '/reports/vaccine-inventory',
  },
  {
    title: 'System Evaluation Results Summary',
    description: 'System performance metrics and immunization evaluation',
    icon: Activity,
    path: '/reports/system-evaluation',
  },
];

const COLORS = ['hsl(var(--primary))', 'hsl(340, 80%, 60%)'];
const BAR_COLORS = ['hsl(var(--primary))', 'hsl(142, 71%, 45%)', 'hsl(48, 96%, 53%)', 'hsl(0, 84%, 60%)'];

export default function Reports() {
  const { patients } = usePatients();
  const { records } = useImmunizations();

  const completedCount = records.filter(r => r.status === 'completed').length;
  const pendingCount = records.filter(r => r.status === 'pending').length;
  const overdueCount = records.filter(r => r.status === 'overdue').length;

  const genderData = useMemo(() => {
    const male = patients.filter(p => p.gender === 'Male').length;
    const female = patients.filter(p => p.gender === 'Female').length;
    return [
      { name: 'Male', value: male },
      { name: 'Female', value: female },
    ];
  }, [patients]);

  const vaccineCoverageData = useMemo(() => {
    return vaccines.slice(0, 10).map(v => {
      const total = records.filter(r => r.vaccineId === v.id).length;
      const completed = records.filter(r => r.vaccineId === v.id && r.status === 'completed').length;
      return {
        name: v.name,
        total,
        completed,
      };
    });
  }, [records]);

  const handleExportData = () => {
    const headers = ['Vaccine', 'Total Records', 'Completed', 'Pending', 'Overdue'];
    const rows = vaccines.map(v => {
      const vRecords = records.filter(r => r.vaccineId === v.id);
      return [
        v.name,
        String(vRecords.length),
        String(vRecords.filter(r => r.status === 'completed').length),
        String(vRecords.filter(r => r.status === 'pending').length),
        String(vRecords.filter(r => r.status === 'overdue').length),
      ];
    });
    downloadCsv('reports-summary.csv', headers, rows);
  };

  return (
    <MainLayout title="Reports" subtitle="View immunization statistics and reports">
      <div className="space-y-6">
        {/* Report Links - Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportItems.map(item => (
            <Link key={item.path} to={item.path}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground mt-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={handleExportData}>
            <Download className="w-4 h-4" /> Export Data
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>

        {/* Dashboard Charts - Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Immunization Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Immunization Status</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No immunization data yet. Add patients to see statistics.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold text-green-600">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-semibold text-yellow-600">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Overdue</span>
                    <span className="font-semibold text-red-600">{overdueCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold">{records.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Patient Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No patient data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {genderData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vaccine Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Vaccine Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No immunization data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vaccineCoverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" />
                  <Bar dataKey="completed" fill="hsl(142, 71%, 45%)" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
