export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  motherName: string;
  fatherName?: string;
  address: string;
  contactNumber: string;
  assignedBNS: string;
  registeredDate: string;
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  doses: number;
  ageInMonths: number; // recommended age in months
}

export interface ImmunizationRecord {
  id: string;
  patientId: string;
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  scheduledDate: string;
  administeredDate?: string;
  status: 'completed' | 'pending' | 'overdue';
  remarks?: string;
  administeredBy?: string;
}

export interface DashboardStats {
  totalPatients: number;
  completedVaccinations: number;
  pendingVaccinations: number;
  overdueVaccinations: number;
}
