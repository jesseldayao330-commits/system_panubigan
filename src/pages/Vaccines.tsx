import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { vaccines } from '@/data/mockData';
import { useImmunizations } from '@/hooks/useImmunizations';
import { Vaccine } from '@/types/patient';
import { Syringe, Baby, School, GraduationCap } from 'lucide-react';

function getAgeLabel(ageInMonths: number): string {
  if (ageInMonths === 0) return 'At Birth';
  if (ageInMonths < 12) return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${months}m`;
}

function getAgeCategory(ageInMonths: number) {
  if (ageInMonths <= 0) return { label: 'At Birth', icon: Baby, color: 'bg-primary/10 text-primary' };
  if (ageInMonths <= 12) return { label: 'Infant', icon: Baby, color: 'bg-accent/20 text-accent-foreground' };
  if (ageInMonths <= 72) return { label: 'Toddler/Child', icon: School, color: 'bg-secondary text-secondary-foreground' };
  return { label: 'School Age', icon: GraduationCap, color: 'bg-muted text-muted-foreground' };
}

export default function Vaccines() {
  const { records } = useImmunizations();
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);

  const grouped = vaccines.reduce((acc, vaccine) => {
    const cat = getAgeCategory(vaccine.ageInMonths);
    if (!acc[cat.label]) acc[cat.label] = [];
    acc[cat.label].push(vaccine);
    return acc;
  }, {} as Record<string, typeof vaccines>);

  const categoryOrder = ['At Birth', 'Infant', 'Toddler/Child', 'School Age'];

  const getVaccineStats = (vaccineId: string) => {
    const vaccineRecords = records.filter(r => r.vaccineId === vaccineId);
    return {
      total: vaccineRecords.length,
      completed: vaccineRecords.filter(r => r.status === 'completed').length,
      pending: vaccineRecords.filter(r => r.status === 'pending').length,
      overdue: vaccineRecords.filter(r => r.status === 'overdue').length,
    };
  };

  return (
    <MainLayout title="Vaccines" subtitle="List of all available vaccines in the immunization program">
      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const items = grouped[category];
          if (!items || items.length === 0) return null;
          const cat = getAgeCategory(items[0].ageInMonths);
          const Icon = cat.icon;

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="font-heading font-semibold text-lg text-foreground">{category}</h2>
                <Badge variant="secondary" className="ml-1">{items.length}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((vaccine) => {
                  const stats = getVaccineStats(vaccine.id);
                  return (
                    <Card
                      key={vaccine.id}
                      className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                      onClick={() => setSelectedVaccine(vaccine)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="font-heading text-base flex items-center gap-2">
                            <Syringe className="w-4 h-4 text-primary" />
                            {vaccine.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {getAgeLabel(vaccine.ageInMonths)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{vaccine.description}</p>
                        <div className="flex gap-3 mt-3 text-xs">
                          <span className="text-muted-foreground">Total: {stats.total}</span>
                          <span className="text-green-600">Done: {stats.completed}</span>
                          <span className="text-orange-500">Pending: {stats.pending}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedVaccine} onOpenChange={(open) => { if (!open) setSelectedVaccine(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Syringe className="w-5 h-5 text-primary" />
              {selectedVaccine?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedVaccine && (() => {
            const stats = getVaccineStats(selectedVaccine.id);
            return (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedVaccine.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Recommended Age</p>
                    <p className="font-medium">{getAgeLabel(selectedVaccine.ageInMonths)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Doses Required</p>
                    <p className="font-medium">{selectedVaccine.doses}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-medium text-green-700">{stats.completed}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="font-medium text-orange-700">{stats.pending}</p>
                  </div>
                  {stats.overdue > 0 && (
                    <div className="p-3 rounded-lg bg-red-50 col-span-2">
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      <p className="font-medium text-red-700">{stats.overdue}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
