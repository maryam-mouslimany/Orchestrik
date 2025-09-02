import React, { createContext, useContext, useRef, useEffect, useMemo, useState } from 'react';
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
    const [user, setUserState] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const hydrated = useRef(false); // CHANGED: track hydration so we don't write "null" on first render

    useEffect(() => {
        const stored = authService.getUser();
        setUserState(stored);
        hydrated.current = true; // CHANGED
        setLoading(false);
    }, []);

    useEffect(() => {
        // CHANGED: only persist when user is non-null; do NOT write "null" on refresh
        if (hydrated.current && user) {
            authService.setUser(user);
        }

        const color = user?.role?.color ?? '#000000ff';
        console.log('[Context] color applied:', color);
        document.documentElement.style.setProperty('--primary-color', color);

        // (optional logs kept)
        console.log('[Context] localStorage[auth:user]=', localStorage.getItem('auth:user'));
        console.log('[Context] persisted user:', user);
        console.log('[Context] localStorage[auth:user]=', localStorage.getItem('auth:user'));
    }, [user]);
    const setUser = (u: AppUser | null) => {
        setUserState(u);
        console.log('[Context] setUser called with:', u);
    }

    const updateUser = (patch: Partial<AppUser>) => {
        setUserState((prev) => (prev ? { ...prev, ...patch } : prev));
    };

    const logout = () => {
        setUserState(null);
        authService.clear();
    };

    const value = useMemo(
        () => ({ user, loading, setUser, updateUser, logout }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};
