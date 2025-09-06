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

  // Only update token if explicitly provided in the patch
  updateUser(patch: Partial<AppUser>) {
    const current = this.getUser();
    if (!current) return;

    const { token, ...safe } = patch;
    const nextNoToken: StoredUser = { ...current, ...safe } as StoredUser;

    localStorage.setItem(USER_KEY, JSON.stringify(nextNoToken));

    if (typeof token === 'string') {
      token.length ? localStorage.setItem(TOKEN_KEY, token)
                   : localStorage.removeItem(TOKEN_KEY);
    }
  },

  clear() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};
