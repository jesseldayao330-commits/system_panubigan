import { ImmunizationRecord, Patient } from '@/types/patient';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingScheduleProps {
  records: ImmunizationRecord[];
  patients: Patient[];
}

export function UpcomingSchedule({ records, patients }: UpcomingScheduleProps) {
  const pendingRecords = records
    .filter(r => r.status === 'pending')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);

  return (
    <div className="table-container animate-fade-in">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Upcoming Vaccinations</h3>
        <Link to="/schedule">
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border">
        {pendingRecords.map((record) => {
          const patient = getPatient(record.patientId);
          if (!patient) return null;
          
          return (
            <div key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {record.vaccineName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="status-badge status-pending">
                  {format(new Date(record.scheduledDate), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          );
        })}
        {pendingRecords.length === 0 && (
          <div className="px-6 py-8 text-center text-muted-foreground">
            No upcoming vaccinations scheduled
          </div>
        )}
      </div>
    </div>
  );
}
