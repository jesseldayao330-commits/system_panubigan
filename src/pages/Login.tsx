import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Syringe, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Pakilagay ang username at password.');
      return;
    }
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Mali ang username o password.');
    }
  };

  const features = [
    { icon: Shield, title: 'Secure Access', desc: 'Role-based authentication' },
    { icon: Heart, title: 'Health Records', desc: 'Complete vaccination history' },
    { icon: Users, title: 'Child Registry', desc: 'Manage infant records' },
    { icon: Syringe, title: 'Vaccine Tracking', desc: 'Never miss a schedule' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary">
      {/* Left Side - Branding */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <Syringe className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">Barangay Panubigan</h1>
            <p className="text-sm text-muted-foreground">Immunization System</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Protecting Our <span className="text-primary">Children's Health</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Digital Immunization management system for Barangay Panubigan health workers. Track, schedule, and manage vaccinations with ease.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-xl p-5 shadow-sm border border-border/50 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading font-semibold text-sm text-foreground">{f.title}</span>
              <span className="text-xs text-muted-foreground">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="font-heading font-bold text-2xl text-foreground">Welcome</h2>
              <p className="text-sm text-muted-foreground">Sign in to access the system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full text-base font-semibold h-11">
                Sign In
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-8">
              2026 Barangay Panubigan Health Center. All rights reserved
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
