import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { vaccines } from '@/data/mockData';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Printer, Download, Calendar } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { downloadCsv } from '@/utils/exportCsv';
import { toast } from 'sonner';

export default function MonthlyCoverageReport() {
  const { patients } = usePatients();
  const { records } = useImmunizations();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const monthStart = startOfMonth(parseISO(selectedMonth + '-01'));
  const monthEnd = endOfMonth(monthStart);
  const monthLabel = format(monthStart, 'MMMM yyyy');

  const monthRecords = useMemo(() =>
    records.filter(r => {
      const d = r.administeredDate ? parseISO(r.administeredDate) : null;
      const s = parseISO(r.scheduledDate);
      return (d && isWithinInterval(d, { start: monthStart, end: monthEnd })) ||
        isWithinInterval(s, { start: monthStart, end: monthEnd });
    }),
    [records, selectedMonth]
  );

  const completedThisMonth = monthRecords.filter(r => r.status === 'completed').length;
  const pendingThisMonth = monthRecords.filter(r => r.status === 'pending').length;
  const overdueThisMonth = monthRecords.filter(r => r.status === 'overdue').length;
  const totalThisMonth = monthRecords.length;
  const coverageRate = totalThisMonth > 0 ? Math.round((completedThisMonth / totalThisMonth) * 100) : 0;

  const vaccineBreakdown = useMemo(() =>
    vaccines.map(v => {
      const vRecords = monthRecords.filter(r => r.vaccineId === v.id);
      return {
        name: v.name,
        completed: vRecords.filter(r => r.status === 'completed').length,
        pending: vRecords.filter(r => r.status === 'pending').length,
        overdue: vRecords.filter(r => r.status === 'overdue').length,
        total: vRecords.length,
      };
    }).filter(v => v.total > 0),
    [monthRecords]
  );

  const handleExport = () => {
    const headers = ['Vaccine', 'Completed', 'Pending', 'Overdue', 'Total'];
    const rows = vaccineBreakdown.map(v => [v.name, String(v.completed), String(v.pending), String(v.overdue), String(v.total)]);
    downloadCsv(`monthly-coverage-${selectedMonth}.csv`, headers, rows);
    toast.success('Monthly coverage report exported');
  };

  return (
    <MainLayout title="Monthly Immunization Coverage Report" subtitle={monthLabel}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-48"
            />
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{totalThisMonth}</p>
              <p className="text-sm text-muted-foreground">Total Vaccinations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{completedThisMonth}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-yellow-500">{pendingThisMonth}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-red-500">{overdueThisMonth}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{coverageRate}%</p>
              <p className="text-sm text-muted-foreground">Coverage Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {vaccineBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Vaccine Coverage Chart – {monthLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vaccineBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="hsl(142, 70%, 40%)" name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill="hsl(38, 92%, 50%)" name="Pending" />
                  <Bar dataKey="overdue" stackId="a" fill="hsl(0, 72%, 51%)" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Vaccine Breakdown – {monthLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            {vaccineBreakdown.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Walang data para sa buwan na ito.</p>
            ) : (
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead className="text-center">Pending</TableHead>
                      <TableHead className="text-center">Overdue</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Coverage %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccineBreakdown.map(v => (
                      <TableRow key={v.name}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell className="text-center text-green-600 font-semibold">{v.completed}</TableCell>
                        <TableCell className="text-center text-yellow-500 font-semibold">{v.pending}</TableCell>
                        <TableCell className="text-center text-red-500 font-semibold">{v.overdue}</TableCell>
                        <TableCell className="text-center font-semibold">{v.total}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {v.total > 0 ? Math.round((v.completed / v.total) * 100) : 0}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
