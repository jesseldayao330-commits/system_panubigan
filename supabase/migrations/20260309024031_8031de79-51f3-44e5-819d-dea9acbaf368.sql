
-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  mother_name TEXT NOT NULL,
  father_name TEXT,
  address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  assigned_bns TEXT NOT NULL,
  registered_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create immunization_records table
CREATE TABLE public.immunization_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  vaccine_id TEXT NOT NULL,
  vaccine_name TEXT NOT NULL,
  dose_number INTEGER NOT NULL DEFAULT 1,
  scheduled_date DATE NOT NULL,
  administered_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'overdue')),
  remarks TEXT,
  administered_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immunization_records ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to CRUD patients
CREATE POLICY "Authenticated users can view patients" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update patients" ON public.patients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete patients" ON public.patients FOR DELETE TO authenticated USING (true);

-- Allow all authenticated users to CRUD immunization records
CREATE POLICY "Authenticated users can view records" ON public.immunization_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert records" ON public.immunization_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update records" ON public.immunization_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete records" ON public.immunization_records FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_immunization_patient ON public.immunization_records(patient_id);
CREATE INDEX idx_immunization_status ON public.immunization_records(status);
