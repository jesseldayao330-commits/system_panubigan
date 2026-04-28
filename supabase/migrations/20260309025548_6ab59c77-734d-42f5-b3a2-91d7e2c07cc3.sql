
-- Drop restrictive policies and recreate as permissive
DROP POLICY "Allow all access to patients" ON public.patients;
DROP POLICY "Allow all access to records" ON public.immunization_records;

CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to records" ON public.immunization_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
