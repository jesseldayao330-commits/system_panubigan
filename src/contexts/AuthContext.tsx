import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  user: { username: string } | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const DEFAULT_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
  { username: 'nurse', password: 'nurse123' },
  { username: 'bns', password: 'bns123' },
];

function getCredentials() {
  const stored = localStorage.getItem('app_credentials');
  if (stored) {
    return JSON.parse(stored) as { username: string; password: string }[];
  }
  localStorage.setItem('app_credentials', JSON.stringify(DEFAULT_CREDENTIALS));
  return DEFAULT_CREDENTIALS;
}

function saveCredentials(creds: { username: string; password: string }[]) {
  localStorage.setItem('app_credentials', JSON.stringify(creds));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const stored = sessionStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, password: string): boolean => {
    const creds = getCredentials();
    const found = creds.find(
      (c) => c.username === username && c.password === password
    );
    if (found) {
      const userData = { username: found.username };
      setUser(userData);
      sessionStorage.setItem('auth_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('auth_user');
  };

  const changePassword = (currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'Hindi ka naka-login.' };
    const creds = getCredentials();
    const idx = creds.findIndex(
      (c) => c.username === user.username && c.password === currentPassword
    );
    if (idx === -1) return { success: false, error: 'Mali ang kasalukuyang password.' };
    if (newPassword.length < 6) return { success: false, error: 'Ang bagong password ay dapat hindi bababa sa 6 na character.' };
    creds[idx].password = newPassword;
    saveCredentials(creds);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, login, logout, changePassword, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
