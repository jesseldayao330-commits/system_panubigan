import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useImmunizations } from '@/hooks/useImmunizations';
import { vaccines } from '@/data/mockData';
import { Printer, Download, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { downloadCsv } from '@/utils/exportCsv';
import { toast } from 'sonner';

export default function VaccineInventoryStatus() {
  const { records } = useImmunizations();

  const vaccineStats = useMemo(() =>
    vaccines.map(v => {
      const vRecords = records.filter(r => r.vaccineId === v.id);
      const administered = vRecords.filter(r => r.status === 'completed').length;
      const pending = vRecords.filter(r => r.status === 'pending').length;
      const overdue = vRecords.filter(r => r.status === 'overdue').length;
      return {
        id: v.id,
        name: v.name,
        description: v.description,
        ageInMonths: v.ageInMonths,
        administered,
        pending,
        overdue,
        total: vRecords.length,
      };
    }),
    [records]
  );

  const totalAdministered = vaccineStats.reduce((s, v) => s + v.administered, 0);
  const totalPending = vaccineStats.reduce((s, v) => s + v.pending, 0);
  const totalOverdue = vaccineStats.reduce((s, v) => s + v.overdue, 0);

  const statusPie = [
    { name: 'Administered', value: totalAdministered, color: 'hsl(142, 70%, 40%)' },
    { name: 'Pending', value: totalPending, color: 'hsl(38, 92%, 50%)' },
    { name: 'Overdue', value: totalOverdue, color: 'hsl(0, 72%, 51%)' },
  ];

  const handleExport = () => {
    const headers = ['Vaccine', 'Description', 'Age (months)', 'Administered', 'Pending', 'Overdue', 'Total'];
    const rows = vaccineStats.map(v => [v.name, v.description, String(v.ageInMonths), String(v.administered), String(v.pending), String(v.overdue), String(v.total)]);
    downloadCsv(`vaccine-inventory-status-${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    toast.success('Vaccine inventory exported');
  };

  return (
    <MainLayout title="Vaccine Inventory Status Report" subtitle="Overview of all tracked vaccines and their usage">
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{vaccines.length}</p>
              <p className="text-sm text-muted-foreground">Total Vaccines</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold text-green-600">{totalAdministered}</p>
              <p className="text-sm text-muted-foreground">Administered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-3xl font-bold text-yellow-500">{totalPending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-3xl font-bold text-red-500">{totalOverdue}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        {records.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Overall Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusPie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {statusPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Vaccine Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">All Vaccines Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Target Age</TableHead>
                    <TableHead className="text-center">Administered</TableHead>
                    <TableHead className="text-center">Pending</TableHead>
                    <TableHead className="text-center">Overdue</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccineStats.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.description}</TableCell>
                      <TableCell className="text-center">
                        {v.ageInMonths >= 12 ? `${Math.floor(v.ageInMonths / 12)} yr` : `${v.ageInMonths} mo`}
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-semibold">{v.administered}</TableCell>
                      <TableCell className="text-center text-yellow-500 font-semibold">{v.pending}</TableCell>
                      <TableCell className="text-center text-red-500 font-semibold">{v.overdue}</TableCell>
                      <TableCell className="text-center font-semibold">{v.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
