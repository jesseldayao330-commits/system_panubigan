import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ImmunizationTable } from '@/components/immunizations/ImmunizationTable';
import { AdministerForm } from '@/components/immunizations/AdministerForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Filter, Plus, CalendarIcon, X } from 'lucide-react';
import { vaccines } from '@/data/mockData';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { ImmunizationRecord } from '@/types/patient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Immunizations() {
  const { patients } = usePatients();
  const { records, addRecord, administerRecord } = useImmunizations();
  const [searchQuery, setSearchQuery] = useState('');
  const [administerOpen, setAdministerOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ImmunizationRecord | null>(null);
  const [filterVaccine, setFilterVaccine] = useState('all');

  const [schedulePatientId, setSchedulePatientId] = useState('');
  const [scheduleVaccineId, setScheduleVaccineId] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date>();

  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);

  const filteredRecords = records.filter(r => {
    const patient = getPatient(r.patientId);
    if (!patient) return false;
    const matchesSearch =
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vaccineName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVaccine = filterVaccine === 'all' || r.vaccineId === filterVaccine;
    return matchesSearch && matchesVaccine;
  });

  const completedRecords = filteredRecords.filter(r => r.status === 'completed');
  const pendingRecords = filteredRecords.filter(r => r.status === 'pending');
  const overdueRecords = filteredRecords.filter(r => r.status === 'overdue');

  const handleAdminister = (record: ImmunizationRecord) => {
    setSelectedRecord(record);
    setAdministerOpen(true);
  };

  const handleSaveAdminister = async (recordId: string, data: { administeredDate: string; administeredBy: string; remarks?: string }) => {
    const { error } = await administerRecord(recordId, data);
    if (!error) toast.success('Vaccination recorded successfully');
    else toast.error('Failed to record vaccination');
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulePatientId || !scheduleVaccineId || !scheduleDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const vaccine = vaccines.find(v => v.id === scheduleVaccineId);
    if (!vaccine) return;
    const { error } = await addRecord({
      patientId: schedulePatientId,
      vaccineId: scheduleVaccineId,
      vaccineName: vaccine.name,
      doseNumber: 1,
      scheduledDate: format(scheduleDate, 'yyyy-MM-dd'),
      status: 'pending',
    });
    if (!error) {
      setScheduleOpen(false);
      setSchedulePatientId('');
      setScheduleVaccineId('');
      setScheduleDate(undefined);
      toast.success('Immunization schedule added successfully');
    } else {
      toast.error('Failed to add schedule');
    }
  };

  const selectedPatient = selectedRecord ? getPatient(selectedRecord.patientId) || null : null;

  return (
    <MainLayout title="Immunizations" subtitle="Manage vaccination records">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or vaccine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
              {filterVaccine !== 'all' && (
                <span className="ml-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">1</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-semibold text-sm">Filter by Vaccine</h4>
                {filterVaccine !== 'all' && (
                  <Button variant="ghost" size="sm" onClick={() => { setFilterVaccine('all'); setFilterOpen(false); }}>
                    <X className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
              <Select value={filterVaccine} onValueChange={(v) => { setFilterVaccine(v); setFilterOpen(false); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Vaccines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vaccines</SelectItem>
                  {vaccines.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
        <Button className="gap-2" onClick={() => setScheduleOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Schedule
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({filteredRecords.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRecords.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueRecords.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRecords.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ImmunizationTable records={filteredRecords} patients={patients} onAdminister={handleAdminister} />
        </TabsContent>
        <TabsContent value="pending">
          <ImmunizationTable records={pendingRecords} patients={patients} onAdminister={handleAdminister} />
        </TabsContent>
        <TabsContent value="overdue">
          <ImmunizationTable records={overdueRecords} patients={patients} onAdminister={handleAdminister} />
        </TabsContent>
        <TabsContent value="completed">
          <ImmunizationTable records={completedRecords} patients={patients} onAdminister={handleAdminister} />
        </TabsContent>
      </Tabs>

      <AdministerForm
        open={administerOpen}
        onOpenChange={setAdministerOpen}
        record={selectedRecord}
        patient={selectedPatient}
        onSave={handleSaveAdminister}
      />

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Add Immunization Schedule</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Select value={schedulePatientId} onValueChange={setSchedulePatientId}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No patients registered yet</div>
                  ) : (
                    patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vaccine *</Label>
              <Select value={scheduleVaccineId} onValueChange={setScheduleVaccineId}>
                <SelectTrigger><SelectValue placeholder="Select vaccine" /></SelectTrigger>
                <SelectContent>
                  {vaccines.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.name} — {v.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduleDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
              <Button type="submit">Add Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
