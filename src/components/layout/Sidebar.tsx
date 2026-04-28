import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Syringe, 
  Calendar, 
  FileText,
  Settings,
  Shield,
  LogOut,
  Pill
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Pill, label: 'Vaccines', path: '/vaccines' },
  { icon: Syringe, label: 'Immunizations', path: '/immunizations' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: FileText, label: 'Reports', path: '/reports' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-foreground text-sm leading-tight">Barangay Panubigan</h1>
            <p className="text-xs text-muted-foreground">Immunization System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border space-y-1">
        <Link to="/settings" className="nav-link">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="nav-link w-full text-destructive hover:text-destructive">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log Out</AlertDialogTitle>
              <AlertDialogDescription>
                Sigurado ka bang gusto mong mag-log out sa system?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
