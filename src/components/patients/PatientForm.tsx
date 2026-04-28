import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface PatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  onSave: (patient: Omit<Patient, 'id' | 'registeredDate'>) => Promise<boolean>;
}

export function PatientForm({ open, onOpenChange, patient, onSave }: PatientFormProps) {
  const [formData, setFormData] = useState<{
    firstName: string; lastName: string; middleName: string; birthDate: string;
    gender: 'Male' | 'Female'; motherName: string; fatherName: string;
    address: string; contactNumber: string; assignedBNS: string;
  }>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: 'Male',
    motherName: '',
    fatherName: '',
    address: '',
    contactNumber: '',
    assignedBNS: '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        firstName: patient?.firstName || '',
        lastName: patient?.lastName || '',
        middleName: patient?.middleName || '',
        birthDate: patient?.birthDate || '',
        gender: patient?.gender || 'Male',
        motherName: patient?.motherName || '',
        fatherName: patient?.fatherName || '',
        address: patient?.address || '',
        contactNumber: patient?.contactNumber || '',
        assignedBNS: patient?.assignedBNS || '',
      });
    }
  }, [open, patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(formData);
    if (success) onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {patient ? 'Edit Patient' : 'Register New Patient'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleChange('middleName', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name (Optional)</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Purok, Barangay Panubigan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                placeholder="09XXXXXXXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedBNS">Assigned Nurse/BNS *</Label>
              <Input
                id="assignedBNS"
                value={formData.assignedBNS}
                onChange={(e) => handleChange('assignedBNS', e.target.value)}
                placeholder="Pangalan ng Nurse o BNS"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {patient ? 'Save Changes' : 'Register Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
