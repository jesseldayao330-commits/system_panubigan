import { Patient } from '@/types/patient';
import { format, differenceInMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PatientTableProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientTable({ patients, onView, onEdit, onDelete }: PatientTableProps) {
  const calculateAge = (birthDate: string) => {
    const months = differenceInMonths(new Date(), new Date(birthDate));
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Mother's Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {patient.lastName}, {patient.firstName} {patient.middleName || ''}
                    </p>
                    <p className="text-xs text-muted-foreground">{patient.address}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(patient.birthDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{calculateAge(patient.birthDate)}</TableCell>
              <TableCell>
                <span className={`status-badge ${patient.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                  {patient.gender}
                </span>
              </TableCell>
              <TableCell>{patient.motherName}</TableCell>
              <TableCell>{patient.contactNumber}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(patient)}>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(patient)}>
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(patient)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
