import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PatientTable } from '@/components/patients/PatientTable';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientDetails } from '@/components/patients/PatientDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { Patient } from '@/types/patient';
import { toast } from 'sonner';
import { downloadCsv } from '@/utils/exportCsv';
import { generateImmunizationSchedule } from '@/utils/generateImmunizationSchedule';
import { format } from 'date-fns';

export default function Patients() {
  const { patients, loading, addPatient, updatePatient, deletePatient } = usePatients();
  const { records, addRecord } = useImmunizations();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.middleName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.motherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditPatient(patient);
    setFormOpen(true);
  };

  const handleDelete = async (patient: Patient) => {
    if (confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
      const { error } = await deletePatient(patient.id);
      if (!error) toast.success('Patient deleted successfully');
      else toast.error('Failed to delete patient');
    }
  };

  const handleSave = async (data: Omit<Patient, 'id' | 'registeredDate'>): Promise<boolean> => {
    if (editPatient) {
      const { error } = await updatePatient(editPatient.id, data);
      if (!error) {
        toast.success('Patient updated successfully');
        setEditPatient(null);
        return true;
      } else {
        toast.error('Hindi na-save: ' + (error.message || 'May error sa pag-save'));
        return false;
      }
    } else {
      const { error, data: newPatient } = await addPatient(data);
      if (!error && newPatient) {
        toast.success('Patient registered successfully');
        // Auto-generate immunization schedule
        const schedule = generateImmunizationSchedule(newPatient.id, data.birthDate);
        for (const entry of schedule) {
          await addRecord(entry);
        }
        toast.success(`${schedule.length} immunization schedules created automatically`);
        return true;
      } else {
        toast.error('Hindi na-save: ' + (error?.message || 'May error sa pag-save'));
        return false;
      }
    }
  };

  const handleAddNew = () => {
    setEditPatient(null);
    setFormOpen(true);
  };

  const handleExport = () => {
    const headers = ['Last Name', 'First Name', 'Middle Name', 'Birth Date', 'Gender', 'Mother Name', 'Father Name', 'Address', 'Contact', 'Assigned BNS', 'Registered Date'];
    const rows = patients.map(p => [
      p.lastName, p.firstName, p.middleName || '', p.birthDate, p.gender,
      p.motherName, p.fatherName || '', p.address, p.contactNumber, p.assignedBNS, p.registeredDate
    ]);
    downloadCsv(`patients-${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    toast.success('Patient data exported');
  };

  return (
    <MainLayout title="Patients" subtitle={`${patients.length} registered patients`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or mother's name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading patients...</p>
      ) : (
        <PatientTable
          patients={filteredPatients}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PatientForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditPatient(null);
        }}
        patient={editPatient}
        onSave={handleSave}
      />

      <PatientDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        patient={selectedPatient}
        immunizationRecords={records}
      />
    </MainLayout>
  );
}
