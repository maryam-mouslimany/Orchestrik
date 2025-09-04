import * as React from 'react';
import apiCall from '../../../../../services/apiCallService';
import { type Column } from '../../../../../components/Table';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  skills: string;
  //Actions: string; // pre-joined to avoid render()
};

export const useUsersTable = () => {
  const [rows, setRows] = React.useState<UserRow[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiCall('/admin/users', {method:'GET', requiresAuth:true});
      const list: any[] = Array.isArray(res.data) ? res.data : [];
      console.log(list)
      const mapped: UserRow[] = list.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u?.role?.name ?? '',
        position: u?.position?.name ?? '',
        skills: Array.isArray(u?.skills) ? u.skills.map((s:any) => s.name).join(', ') : '',
      }));

      setRows(mapped);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load users');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  // simple, no render functions
  const columns: Column<UserRow>[] = React.useMemo(() => ([
    { key: 'id', label: 'ID', width: 80 },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', width: 260 },
    { key: 'role', label: 'Role', width: 140 },
    { key: 'position', label: 'Position', width: 160 },
    { key: 'skills', label: 'Skills' },
  ]), []);

  return { rows, columns, loading, error, refresh: fetchUsers };
};
