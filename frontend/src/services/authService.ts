export type Role = 'admin' | 'pm' | 'member';

export type AppUser = {
  id: number;
  name: string;
  email: string;
  role: { id: number; name: string; color?: string };
  position: { id: number; name: string };
  skills: Array<{ id: number; name: string }>;
  projects: Array<{ id: number; name: string }>;
  defaultRoute?: string;
  lastRoute?: string;
};

const USER_KEY  = 'auth:user';
const TOKEN_KEY = 'token';

type StoredUser = Omit<AppUser, 'token'>;

export const authService = {
  getUser(): AppUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw) as StoredUser;
      const token = localStorage.getItem(TOKEN_KEY) ?? '';
      return { ...user, token };
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setUser(user: AppUser | null) {
    if (user === null) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    const { token, ...rest } = user;
    localStorage.setItem(USER_KEY, JSON.stringify(rest));
    if (typeof token === 'string' && token.length > 0) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  clear() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};
