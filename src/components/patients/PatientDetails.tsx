import { Patient, ImmunizationRecord } from '@/types/patient';
import { format, differenceInMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PatientDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  immunizationRecords: ImmunizationRecord[];
}

export function PatientDetails({ open, onOpenChange, patient, immunizationRecords }: PatientDetailsProps) {
  if (!patient) return null;

  const patientRecords = immunizationRecords.filter(r => r.patientId === patient.id);
  const ageInMonths = differenceInMonths(new Date(), new Date(patient.birthDate));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center justify-between">
            Patient Details
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl font-bold">
                  {patient.firstName[0]}{patient.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  {patient.firstName} {patient.middleName || ''} {patient.lastName}
                </h3>
                <p className="text-muted-foreground">
                  {ageInMonths < 12 
                    ? `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''} old` 
                    : `${Math.floor(ageInMonths / 12)} year${Math.floor(ageInMonths / 12) !== 1 ? 's' : ''} old`
                  } • {patient.gender}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Birth Date</p>
                <p className="font-medium">{format(new Date(patient.birthDate), 'MMMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium">{patient.contactNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mother's Name</p>
                <p className="font-medium">{patient.motherName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Father's Name</p>
                <p className="font-medium">{patient.fatherName || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </div>
          </div>

          {/* Immunization Records */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Immunization Records</h4>
            <div className="space-y-2">
              {patientRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No immunization records found</p>
              ) : (
                patientRecords.map((record) => (
                  <div 
                    key={record.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium">{record.vaccineName}</p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled: {format(new Date(record.scheduledDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`status-badge status-${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                      {record.administeredDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Given: {format(new Date(record.administeredDate), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
