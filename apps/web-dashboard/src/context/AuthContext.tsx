import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TeacherUser {
  email: string;
  displayName: string;
  role: 'teacher';
}

interface AuthContextType {
  user: TeacherUser | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TeacherUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('heritage_teacher');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email: string, _password: string) => {
    const u: TeacherUser = { email, displayName: email.split('@')[0], role: 'teacher' };
    localStorage.setItem('heritage_teacher', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('heritage_teacher');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
