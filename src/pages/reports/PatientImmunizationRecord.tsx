import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { vaccines } from '@/data/mockData';
import { format, differenceInMonths } from 'date-fns';
import { Printer, Search, User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function PatientImmunizationRecord() {
  const { patients } = usePatients();
  const { records } = useImmunizations();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientRecords = records.filter(r => r.patientId === selectedPatientId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const completedCount = patientRecords.filter(r => r.status === 'completed').length;
  const pendingCount = patientRecords.filter(r => r.status === 'pending').length;
  const overdueCount = patientRecords.filter(r => r.status === 'overdue').length;

  const ageInMonths = selectedPatient
    ? differenceInMonths(new Date(), new Date(selectedPatient.birthDate))
    : 0;

  return (
    <MainLayout title="Patient Immunization Record" subtitle="Individual patient vaccination history">
      <div className="space-y-6">
        {/* Patient Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pumili ng pasyente..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Hanapin..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredPatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.lastName}, {p.firstName} {p.middleName || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPatient && (
                <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" /> Print Record
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedPatient && (
          <>
            {/* Patient Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Buong Pangalan</p>
                      <p className="font-semibold">{selectedPatient.lastName}, {selectedPatient.firstName} {selectedPatient.middleName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Petsa ng Kapanganakan</p>
                      <p className="font-semibold">{format(new Date(selectedPatient.birthDate), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Edad</p>
                      <p className="font-semibold">{ageInMonths} buwan ({Math.floor(ageInMonths / 12)} taon)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kasarian</p>
                      <p className="font-semibold">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ina</p>
                      <p className="font-semibold">{selectedPatient.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-semibold">{selectedPatient.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{patientRecords.length}</p>
                  <p className="text-sm text-muted-foreground">Total Vaccines</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-green-600">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-red-500">{overdueCount}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </CardContent>
              </Card>
            </div>

            {/* Immunization Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Vaccination History</CardTitle>
              </CardHeader>
              <CardContent>
                {patientRecords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Walang immunization record para sa pasyenteng ito.</p>
                ) : (
                  <div className="table-container">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vaccine</TableHead>
                          <TableHead>Dose</TableHead>
                          <TableHead>Scheduled Date</TableHead>
                          <TableHead>Administered Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Administered By</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.vaccineName}</TableCell>
                            <TableCell>Dose {record.doseNumber}</TableCell>
                            <TableCell>{format(new Date(record.scheduledDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              {record.administeredDate
                                ? format(new Date(record.administeredDate), 'MMM dd, yyyy')
                                : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(record.status)}
                                <span className="capitalize">{record.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>{record.administeredBy || '-'}</TableCell>
                            <TableCell>{record.remarks || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!selectedPatientId && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Pumili ng pasyente para makita ang immunization record.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
