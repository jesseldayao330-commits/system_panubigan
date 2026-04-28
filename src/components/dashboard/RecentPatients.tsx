import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentPatientsProps {
  patients: Patient[];
}

export function RecentPatients({ patients }: RecentPatientsProps) {
  return (
    <div className="table-container animate-fade-in">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Recently Registered</h3>
        <Link to="/patients">
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border">
        {patients.slice(0, 5).map((patient) => (
          <div key={patient.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {patient.firstName[0]}{patient.lastName[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {patient.firstName} {patient.middleName ? `${patient.middleName[0]}.` : ''} {patient.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(patient.birthDate), 'MMM dd, yyyy')} • {patient.gender}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Registered</p>
              <p className="text-sm font-medium text-foreground">
                {format(new Date(patient.registeredDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
