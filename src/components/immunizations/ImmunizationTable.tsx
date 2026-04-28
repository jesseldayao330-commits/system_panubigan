import { ImmunizationRecord, Patient } from '@/types/patient';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ImmunizationTableProps {
  records: ImmunizationRecord[];
  patients: Patient[];
  onAdminister: (record: ImmunizationRecord) => void;
}

export function ImmunizationTable({ records, patients, onAdminister }: ImmunizationTableProps) {
  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge status-complete">Completed</span>;
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'overdue':
        return <span className="status-badge status-overdue">Overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Vaccine</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Administered Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Administered By</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const patient = getPatient(record.patientId);
            if (!patient) return null;

            return (
              <TableRow key={record.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <span className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{record.vaccineName}</TableCell>
                <TableCell>{format(new Date(record.scheduledDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  {record.administeredDate 
                    ? format(new Date(record.administeredDate), 'MMM dd, yyyy')
                    : '-'
                  }
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>{record.administeredBy || '-'}</TableCell>
                <TableCell className="text-right">
                  {record.status !== 'completed' ? (
                    <Button 
                      size="sm" 
                      onClick={() => onAdminister(record)}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Administer
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="w-4 h-4" />
                      Done
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
