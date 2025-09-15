// AuthContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { authService, type AppUser } from '../services/authService';

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  setUser: (u: AppUser | null) => void;
  updateUser: (patch: Partial<AppUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUserState] = useState<AppUser | null>(() => authService.getUser());
  const [loading, setLoading] = useState(false);

  // Persist to storage whenever user changes
  useEffect(() => {
    if (user) authService.setUser(user);
    else authService.clear();

    const color = user?.role?.color ?? '#99ABC7';
    document.documentElement.style.setProperty('--primary-color', color);
  }, [user]);

  const setUser = (u: AppUser | null) => {
    setUserState(u);
  };

  const updateUser = (patch: Partial<AppUser>) => {
    setUserState(prev => (prev ? { ...prev, ...patch } : prev));
  };

  // CHANGED: clear storage and in-memory user
  const logout = () => {
    authService.clear();
    setUserState(null);
  };

  const value = useMemo(() => ({ user, loading, setUser, updateUser, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
