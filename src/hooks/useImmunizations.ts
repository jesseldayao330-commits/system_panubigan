import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImmunizationRecord } from '@/types/patient';

function mapRow(row: any): ImmunizationRecord {
  return {
    id: row.id,
    patientId: row.patient_id,
    vaccineId: row.vaccine_id,
    vaccineName: row.vaccine_name,
    doseNumber: row.dose_number,
    scheduledDate: row.scheduled_date,
    administeredDate: row.administered_date || undefined,
    status: row.status as 'completed' | 'pending' | 'overdue',
    remarks: row.remarks || undefined,
    administeredBy: row.administered_by || undefined,
  };
}

export function useImmunizations() {
  const [records, setRecords] = useState<ImmunizationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    const { data, error } = await supabase
      .from('immunization_records')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setRecords(data.map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (data: Omit<ImmunizationRecord, 'id'>) => {
    const { error } = await supabase.from('immunization_records').insert({
      patient_id: data.patientId,
      vaccine_id: data.vaccineId,
      vaccine_name: data.vaccineName,
      dose_number: data.doseNumber,
      scheduled_date: data.scheduledDate,
      status: data.status,
    });
    if (!error) await fetchRecords();
    return { error };
  };

  const administerRecord = async (id: string, data: { administeredDate: string; administeredBy: string; remarks?: string }) => {
    const { error } = await supabase.from('immunization_records').update({
      administered_date: data.administeredDate,
      administered_by: data.administeredBy,
      remarks: data.remarks || null,
      status: 'completed',
    }).eq('id', id);
    if (!error) await fetchRecords();
    return { error };
  };

  return { records, loading, addRecord, administerRecord, refetch: fetchRecords };
}
