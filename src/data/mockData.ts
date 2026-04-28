import { Patient, Vaccine, ImmunizationRecord } from '@/types/patient';

export const vaccines: Vaccine[] = [
  { id: 'bcg', name: 'BCG', description: 'Bacillus Calmette-Guérin (Tuberculosis)', doses: 1, ageInMonths: 0 },
  { id: 'hepb', name: 'Hepatitis B', description: 'Hepatitis B Vaccine (Birth Dose)', doses: 1, ageInMonths: 0 },
  { id: 'penta1', name: 'Pentavalent 1', description: 'DPT-HepB-Hib (1st dose)', doses: 1, ageInMonths: 1.5 },
  { id: 'penta2', name: 'Pentavalent 2', description: 'DPT-HepB-Hib (2nd dose)', doses: 1, ageInMonths: 2.5 },
  { id: 'penta3', name: 'Pentavalent 3', description: 'DPT-HepB-Hib (3rd dose)', doses: 1, ageInMonths: 3.5 },
  { id: 'opv1', name: 'OPV 1', description: 'Oral Polio Vaccine (1st dose)', doses: 1, ageInMonths: 1.5 },
  { id: 'opv2', name: 'OPV 2', description: 'Oral Polio Vaccine (2nd dose)', doses: 1, ageInMonths: 2.5 },
  { id: 'opv3', name: 'OPV 3', description: 'Oral Polio Vaccine (3rd dose)', doses: 1, ageInMonths: 3.5 },
  { id: 'ipv1', name: 'IPV 1', description: 'Inactivated Polio Vaccine (1st dose)', doses: 1, ageInMonths: 3.5 },
  { id: 'ipv2', name: 'IPV 2', description: 'Inactivated Polio Vaccine (2nd dose)', doses: 1, ageInMonths: 9 },
  { id: 'pcv1', name: 'PCV 1', description: 'Pneumococcal Conjugate Vaccine (1st dose)', doses: 1, ageInMonths: 1.5 },
  { id: 'pcv2', name: 'PCV 2', description: 'Pneumococcal Conjugate Vaccine (2nd dose)', doses: 1, ageInMonths: 2.5 },
  { id: 'pcv3', name: 'PCV 3', description: 'Pneumococcal Conjugate Vaccine (3rd dose)', doses: 1, ageInMonths: 3.5 },
  { id: 'mmr1', name: 'MMR 1', description: 'Measles, Mumps, Rubella (1st dose)', doses: 1, ageInMonths: 9 },
  { id: 'mmr2', name: 'MMR 2', description: 'Measles, Mumps, Rubella (2nd dose)', doses: 1, ageInMonths: 12 },
  { id: 'rota1', name: 'Rotavirus 1', description: 'Rotavirus Vaccine (1st dose)', doses: 1, ageInMonths: 1.5 },
  { id: 'rota2', name: 'Rotavirus 2', description: 'Rotavirus Vaccine (2nd dose)', doses: 1, ageInMonths: 2.5 },
  { id: 'je', name: 'JE', description: 'Japanese Encephalitis Vaccine', doses: 1, ageInMonths: 9 },
  { id: 'mcv1', name: 'MCV 1', description: 'Measles-Containing Vaccine (1st dose)', doses: 1, ageInMonths: 9 },
  { id: 'mcv2', name: 'MCV 2', description: 'Measles-Containing Vaccine (2nd dose)', doses: 1, ageInMonths: 12 },
  { id: 'vita1', name: 'Vitamin A (1st)', description: 'Vitamin A Supplementation (1st dose)', doses: 1, ageInMonths: 6 },
  { id: 'vita2', name: 'Vitamin A (2nd)', description: 'Vitamin A Supplementation (2nd dose)', doses: 1, ageInMonths: 12 },
  { id: 'deworming', name: 'Deworming', description: 'Deworming Treatment', doses: 1, ageInMonths: 12 },
  { id: 'td1', name: 'Td 1', description: 'Tetanus-Diphtheria (1st dose - School Age)', doses: 1, ageInMonths: 84 },
  { id: 'td2', name: 'Td 2', description: 'Tetanus-Diphtheria (2nd dose - School Age)', doses: 1, ageInMonths: 85 },
  { id: 'hpv1', name: 'HPV 1', description: 'Human Papillomavirus Vaccine (1st dose)', doses: 1, ageInMonths: 108 },
  { id: 'hpv2', name: 'HPV 2', description: 'Human Papillomavirus Vaccine (2nd dose)', doses: 1, ageInMonths: 114 },
];

export const mockPatients: Patient[] = [];

export const mockImmunizationRecords: ImmunizationRecord[] = [];
