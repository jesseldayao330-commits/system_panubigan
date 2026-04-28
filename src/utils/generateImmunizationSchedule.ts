import { vaccines } from '@/data/mockData';
import { differenceInMonths, addMonths, format } from 'date-fns';

interface ScheduleEntry {
  patientId: string;
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  scheduledDate: string;
  status: 'pending' | 'overdue';
}

export function generateImmunizationSchedule(patientId: string, birthDate: string): ScheduleEntry[] {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = differenceInMonths(today, birth);

  return vaccines.map(vaccine => {
    const scheduledDate = addMonths(birth, Math.ceil(vaccine.ageInMonths));
    const isPast = scheduledDate < today;

    return {
      patientId,
      vaccineId: vaccine.id,
      vaccineName: vaccine.name,
      doseNumber: 1,
      scheduledDate: format(scheduledDate, 'yyyy-MM-dd'),
      status: isPast ? 'overdue' as const : 'pending' as const,
    };
  });
}
