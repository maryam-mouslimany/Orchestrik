export type Role = 'admin' | 'pm' | 'member';


export type AppUser = {
    id: number;
    name: string;
    email: string;
    token: string;

    role: { id: number; name: string; color?: string; };

    position: { id: number; name: string; };

    skills: Array<{ id: number; name: string }>;
    projects: Array<{ id: number; name: string }>;

    defaultRoute?: string;
    lastRoute?: string;
};

const STORAGE_KEY = 'auth:user';

export const authService = {
    getUser(): AppUser | null {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            console.log('service user',raw)
            return raw ? (JSON.parse(raw) as AppUser) : null;
        } catch {
            return null;
        }
    },

    setUser(user: AppUser | null) {
        console.log('I am here and this is the user', user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    },

    updateUser(patch: Partial<AppUser>) {
        const current = this.getUser();
        if (!current) return;
        const next = { ...current, ...patch };
        this.setUser(next);
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },
};