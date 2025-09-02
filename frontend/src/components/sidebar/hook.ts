import { useEffect, useMemo, useState } from 'react';

export type Role = 'admin' | 'manager' | 'member';
export type NavItem = { key: string; label: string; icon?: React.ReactNode; href?: string; };

type User = {
  id: number;
  name: string;
  role: Role;
  avatarUrl?: string;
};

type UseSidebarOptions = {
  storageKey?: string; // allow override in tests
  onNavigate?: (item: NavItem) => void; // optional navigation handler
};

export function useSidebar(options: UseSidebarOptions = {}) {
  const { storageKey = 'auth:user', onNavigate } = options;

  // read user from localStorage (you can later replace this with Context/Service)
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, [storageKey]);

  // role-based nav config
  const navConfig: Record<Role, NavItem[]> = useMemo(
    () => ({
      admin: [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'projects', label: 'Projects' },
        { key: 'users', label: 'Users' },
        { key: 'reports', label: 'Reports' },
        { key: 'settings', label: 'Settings' },
      ],
      manager: [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'projects', label: 'Projects' },
        { key: 'team', label: 'Team' },
        { key: 'reports', label: 'Reports' },
      ],
      member: [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'my-tasks', label: 'My Tasks' },
        { key: 'calendar', label: 'Calendar' },
        { key: 'profile', label: 'Profile' },
      ],
    }),
    []
  );

  const items: NavItem[] = useMemo(() => {
    if (!user) return [];
    const role = (user.role ?? 'member') as Role;
    return navConfig[role] ?? navConfig.member;
  }, [user, navConfig]);

  // simple selection state (optional)
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleSelect = (item: NavItem) => {
    setActiveKey(item.key);
    onNavigate?.(item);
  };

  return {
    user,
    items,
    activeKey,
    setActiveKey,
    handleSelect,
  };
}
