import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Bell, Shield, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/hooks/usePatients';
import { useImmunizations } from '@/hooks/useImmunizations';
import { useToast } from '@/hooks/use-toast';
import { downloadCsv } from '@/utils/exportCsv';
import { toast as sonnerToast } from 'sonner';

interface BarangayInfo {
  barangayName: string;
  municipality: string;
  province: string;
  region: string;
  healthCenter: string;
}

function loadBarangayInfo(): BarangayInfo {
  const stored = localStorage.getItem('barangay_info');
  if (stored) return JSON.parse(stored);
  return {
    barangayName: 'Panubigan',
    municipality: '',
    province: '',
    region: '',
    healthCenter: 'Barangay Panubigan Health Center',
  };
}

export default function Settings() {
  const { changePassword } = useAuth();
  const { patients } = usePatients();
  const { records } = useImmunizations();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [info, setInfo] = useState<BarangayInfo>(loadBarangayInfo);
  const [notifSettings, setNotifSettings] = useState(() => {
    const stored = localStorage.getItem('notif_settings');
    return stored ? JSON.parse(stored) : { reminders: true, overdue: true, monthly: false };
  });

  const handleSaveInfo = () => {
    localStorage.setItem('barangay_info', JSON.stringify(info));
    sonnerToast.success('Barangay information saved');
  };

  const handleNotifChange = (key: string, value: boolean) => {
    const updated = { ...notifSettings, [key]: value };
    setNotifSettings(updated);
    localStorage.setItem('notif_settings', JSON.stringify(updated));
    sonnerToast.success('Notification setting updated');
  };

  const handleExportAll = () => {
    // Export patients
    const pHeaders = ['Last Name', 'First Name', 'Birth Date', 'Gender', 'Mother', 'Contact', 'Address', 'BNS'];
    const pRows = patients.map(p => [p.lastName, p.firstName, p.birthDate, p.gender, p.motherName, p.contactNumber, p.address, p.assignedBNS]);
    downloadCsv('all-patients.csv', pHeaders, pRows);

    // Export immunization records
    const iHeaders = ['Patient ID', 'Vaccine', 'Scheduled', 'Administered', 'Status', 'By'];
    const iRows = records.map(r => [r.patientId, r.vaccineName, r.scheduledDate, r.administeredDate || '', r.status, r.administeredBy || '']);
    downloadCsv('all-immunizations.csv', iHeaders, iRows);

    sonnerToast.success('All data exported successfully');
  };

  const handleBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      barangayInfo: info,
      patientsCount: patients.length,
      recordsCount: records.length,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    sonnerToast.success('Backup created');
  };

  return (
    <MainLayout title="Settings" subtitle="Manage system settings">
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Barangay Information
            </CardTitle>
            <CardDescription>Update your barangay details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Barangay Name</Label>
                <Input value={info.barangayName} onChange={e => setInfo({ ...info, barangayName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Municipality</Label>
                <Input value={info.municipality} onChange={e => setInfo({ ...info, municipality: e.target.value })} placeholder="Enter municipality" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Province</Label>
                <Input value={info.province} onChange={e => setInfo({ ...info, province: e.target.value })} placeholder="Enter province" />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Input value={info.region} onChange={e => setInfo({ ...info, region: e.target.value })} placeholder="Enter region" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Health Center Name</Label>
              <Input value={info.healthCenter} onChange={e => setInfo({ ...info, healthCenter: e.target.value })} />
            </div>
            <Button onClick={handleSaveInfo}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Vaccination Reminders</p>
                <p className="text-sm text-muted-foreground">Send reminders for upcoming vaccinations</p>
              </div>
              <Switch checked={notifSettings.reminders} onCheckedChange={v => handleNotifChange('reminders', v)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Overdue Alerts</p>
                <p className="text-sm text-muted-foreground">Get alerts for overdue vaccinations</p>
              </div>
              <Switch checked={notifSettings.overdue} onCheckedChange={v => handleNotifChange('overdue', v)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monthly Reports</p>
                <p className="text-sm text-muted-foreground">Receive monthly summary reports</p>
              </div>
              <Switch checked={notifSettings.monthly} onCheckedChange={v => handleNotifChange('monthly', v)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <Button onClick={() => {
              if (!currentPassword || !newPassword || !confirmPassword) {
                toast({ title: 'Error', description: 'Punan lahat ng fields.', variant: 'destructive' });
                return;
              }
              if (newPassword !== confirmPassword) {
                toast({ title: 'Error', description: 'Hindi magkatugma ang bagong password.', variant: 'destructive' });
                return;
              }
              const result = changePassword(currentPassword, newPassword);
              if (result.success) {
                toast({ title: 'Success', description: 'Matagumpay na nabago ang password!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
              }
            }}>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>Backup and export data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm text-muted-foreground">Download all patient and immunization records</p>
              </div>
              <Button variant="outline" onClick={handleExportAll}>Export</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Backup Database</p>
                <p className="text-sm text-muted-foreground">Create a backup of the system database</p>
              </div>
              <Button variant="outline" onClick={handleBackup}>Backup</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
