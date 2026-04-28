import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';

function mapRow(row: any): Patient {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    middleName: row.middle_name || '',
    birthDate: row.birth_date,
    gender: row.gender as 'Male' | 'Female',
    motherName: row.mother_name,
    fatherName: row.father_name || '',
    address: row.address,
    contactNumber: row.contact_number,
    assignedBNS: row.assigned_bns,
    registeredDate: row.registered_date,
  };
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setPatients(data.map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const addPatient = async (data: Omit<Patient, 'id' | 'registeredDate'>) => {
    console.log('Adding patient with data:', data);
    const { data: rows, error } = await supabase.from('patients').insert({
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName || null,
      birth_date: data.birthDate,
      gender: data.gender,
      mother_name: data.motherName,
      father_name: data.fatherName || null,
      address: data.address,
      contact_number: data.contactNumber,
      assigned_bns: data.assignedBNS,
    }).select();
    if (error) {
      console.error('Error adding patient:', error);
      return { error, data: null };
    }
    await fetchPatients();
    const newPatient = rows && rows.length > 0 ? mapRow(rows[0]) : null;
    return { error: null, data: newPatient };
  };

  const updatePatient = async (id: string, data: Omit<Patient, 'id' | 'registeredDate'>) => {
    const { error } = await supabase.from('patients').update({
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName || null,
      birth_date: data.birthDate,
      gender: data.gender,
      mother_name: data.motherName,
      father_name: data.fatherName || null,
      address: data.address,
      contact_number: data.contactNumber,
      assigned_bns: data.assignedBNS,
    }).eq('id', id);
    if (!error) await fetchPatients();
    return { error };
  };

  const deletePatient = async (id: string) => {
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (!error) await fetchPatients();
    return { error };
  };

  return { patients, loading, addPatient, updatePatient, deletePatient, refetch: fetchPatients };
}
