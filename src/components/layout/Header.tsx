import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut, Settings, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useImmunizations } from '@/hooks/useImmunizations';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { records } = useImmunizations();
  const [searchValue, setSearchValue] = useState('');

  const overdueCount = records.filter(r => r.status === 'overdue').length;
  const pendingCount = records.filter(r => r.status === 'pending').length;
  const notifCount = overdueCount + pendingCount;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <h1 className="font-heading font-semibold text-xl text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-9 w-64 bg-secondary/50 border-border/50"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                  {notifCount > 99 ? '99+' : notifCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h4 className="font-heading font-semibold text-sm">Notifications</h4>
              {overdueCount > 0 && (
                <div
                  className="p-3 rounded-lg bg-destructive/10 cursor-pointer hover:bg-destructive/20 transition-colors"
                  onClick={() => navigate('/immunizations')}
                >
                  <p className="text-sm font-medium text-destructive">{overdueCount} overdue vaccination{overdueCount !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-muted-foreground">Click to view overdue records</p>
                </div>
              )}
              {pendingCount > 0 && (
                <div
                  className="p-3 rounded-lg bg-warning/10 cursor-pointer hover:bg-warning/20 transition-colors"
                  onClick={() => navigate('/immunizations')}
                >
                  <p className="text-sm font-medium">{pendingCount} pending vaccination{pendingCount !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-muted-foreground">Click to view pending records</p>
                </div>
              )}
              {notifCount === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No notifications</p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.username || 'User'}</p>
              <p className="text-xs text-muted-foreground">Logged in</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
