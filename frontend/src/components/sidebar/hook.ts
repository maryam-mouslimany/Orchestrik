import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export type MenuItem = {
  key: string;
  label: string;
  to: string;
  icon?: React.ReactNode;
};

const MENU_BY_ROLE: Record<'admin' | 'pm' | 'employee', MenuItem[]> = {
  admin: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { key: 'users', label: 'Users', to: '/users' },
    { key: 'projects', label: 'Projects', to: '/projects' },
  ],
  pm: [
    { key: 'projects', label: 'Projects', to: '/projects' },
    { key: 'team', label: 'Team', to: '/team' },
    { key: 'reports', label: 'Reports', to: '/reports' },
  ],
  employee: [
    { key: 'my-tasks', label: 'My Tasks', to: '/my-tasks' },
    { key: 'projects', label: 'Projects', to: '/projects' },
    { key: 'profile', label: 'Profile', to: '/profile' },
  ],
};

export const useSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const roleName = (user?.role?.name as 'admin' | 'pm' | 'employee');

  const items = useMemo(() => MENU_BY_ROLE[roleName], [roleName]);

  const activePath = location.pathname;

  return {
    items,
    activePath,
    roleName,
  };
}