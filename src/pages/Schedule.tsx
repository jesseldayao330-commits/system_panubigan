import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Syringe } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';

export default function Schedule() {
  const { patients } = usePatients();
  const { records } = useImmunizations();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getPatient = (patientId: string) => patients.find(p => p.id === patientId);

  const scheduledForDate = records.filter(r => {
    if (!selectedDate) return false;
    return isSameDay(new Date(r.scheduledDate), selectedDate) && r.status !== 'completed';
  });

  const getUpcomingByWeek = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return records.filter(r => {
      const scheduledDate = new Date(r.scheduledDate);
      return scheduledDate >= today && scheduledDate <= nextWeek && r.status !== 'completed';
    });
  };

  const upcomingThisWeek = getUpcomingByWeek();

  const getDatesWithSchedule = () => {
    return records
      .filter(r => r.status !== 'completed')
      .map(r => new Date(r.scheduledDate));
  };

  return (
    <MainLayout title="Schedule" subtitle="View and manage vaccination schedules">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Vaccination Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{ scheduled: getDatesWithSchedule() }}
              modifiersStyles={{
                scheduled: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  borderRadius: '50%',
                }
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledForDate.length === 0 ? (
                <p className="text-muted-foreground text-sm">No vaccinations scheduled for this date</p>
              ) : (
                <div className="space-y-3">
                  {scheduledForDate.map(record => {
                    const patient = getPatient(record.patientId);
                    if (!patient) return null;
                    return (
                      <div key={record.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Syringe className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-muted-foreground">{record.vaccineName}</p>
                        </div>
                        <span className={`status-badge status-${record.status}`}>
                          {record.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingThisWeek.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming vaccinations this week</p>
              ) : (
                <div className="space-y-3">
                  {upcomingThisWeek.slice(0, 5).map(record => {
                    const patient = getPatient(record.patientId);
                    if (!patient) return null;
                    return (
                      <div key={record.id} className="flex items-center justify-between p-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-sm">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-muted-foreground">{record.vaccineName}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(record.scheduledDate), 'MMM dd')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
