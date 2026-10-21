import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import * as authService from '../features/auth/services/authService';
import type { Credentials, User } from '../features/auth/types/auth';

const STORAGE_KEY = 'aeroparts.session';

interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as User) : null;
    return user?.username ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);

  const login = useCallback(async (credentials: Credentials) => {
    const session = await authService.login(credentials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session.user));
    localStorage.setItem('aeroparts.token', session.token);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('aeroparts.token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
