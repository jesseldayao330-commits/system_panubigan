
-- Drop existing policies and recreate for anon access since app uses hardcoded auth
DROP POLICY "Authenticated users can view patients" ON public.patients;
DROP POLICY "Authenticated users can insert patients" ON public.patients;
DROP POLICY "Authenticated users can update patients" ON public.patients;
DROP POLICY "Authenticated users can delete patients" ON public.patients;
DROP POLICY "Authenticated users can view records" ON public.immunization_records;
DROP POLICY "Authenticated users can insert records" ON public.immunization_records;
DROP POLICY "Authenticated users can update records" ON public.immunization_records;
DROP POLICY "Authenticated users can delete records" ON public.immunization_records;

-- Allow anon access (app handles auth via hardcoded login)
CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to records" ON public.immunization_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
