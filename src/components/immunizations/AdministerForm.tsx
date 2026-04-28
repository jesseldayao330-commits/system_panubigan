import { useState } from 'react';
import { ImmunizationRecord, Patient } from '@/types/patient';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AdministerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ImmunizationRecord | null;
  patient: Patient | null;
  onSave: (recordId: string, data: { administeredDate: string; administeredBy: string; remarks?: string }) => void;
}

export function AdministerForm({ open, onOpenChange, record, patient, onSave }: AdministerFormProps) {
  const [formData, setFormData] = useState({
    administeredDate: format(new Date(), 'yyyy-MM-dd'),
    administeredBy: '',
    remarks: '',
  });

  if (!record || !patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record.id, formData);
    onOpenChange(false);
    setFormData({
      administeredDate: format(new Date(), 'yyyy-MM-dd'),
      administeredBy: '',
      remarks: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Administer Vaccine</DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Patient</p>
              <p className="font-medium">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vaccine</p>
              <p className="font-medium">{record.vaccineName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Scheduled Date</p>
              <p className="font-medium">{format(new Date(record.scheduledDate), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <span className={`status-badge status-${record.status}`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="administeredDate">Date Administered *</Label>
            <Input
              id="administeredDate"
              type="date"
              value={formData.administeredDate}
              onChange={(e) => setFormData(prev => ({ ...prev, administeredDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="administeredBy">Administered By *</Label>
            <Input
              id="administeredBy"
              value={formData.administeredBy}
              onChange={(e) => setFormData(prev => ({ ...prev, administeredBy: e.target.value }))}
              placeholder="e.g., Dr. Santos, Nurse Garcia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Any notes or observations..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm Administration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
