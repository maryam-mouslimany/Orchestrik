import apiCall from '../../../../../services/apiCallService';
import { type Column } from '../../../../../components/Table';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  skills: string;
};

export const useUsersTable = () => {
  // filters fields
  const [skills, setSkills] = useState<Array<number | string>>([]); // was skillId
  const [positionId, setPositionId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);

  // skills and positions from redux
  const { list: skillsOptions } = useSelector((s: any) => s.skills);
  const { positionsList: positionsOptions } = useSelector((s: any) => s.positions);

  const filters = useMemo(() => ({
    roleId: roleId ? Number(roleId) : undefined,
    positionId: positionId ? Number(positionId) : undefined,
    skills: (skills ?? []).map((v) => Number(v)),
  }), [roleId, positionId, skills]);

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiCall('/admin/users', {
        method: 'GET',
        requiresAuth: true,
        params: { filters },
      });

      const list: any[] = Array.isArray(res.data) ? res.data : [];
      const mapped: UserRow[] = list.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u?.role?.name ?? '',
        position: u?.position?.name ?? '',
        skills: Array.isArray(u?.skills) ? u.skills.map((s: any) => s.name).join(', ') : '',
      }));

      setRows(mapped);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load users');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  const columns: Column<UserRow>[] = useMemo(() => ([
    { key: 'id', label: 'ID', width: 80 },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', width: 260 },
    { key: 'role', label: 'Role', width: 140 },
    { key: 'position', label: 'Position', width: 160 },
    { key: 'skills', label: 'Skills' },
    { key: 'actions', label: 'Actions' },
  ]), []);

  return {
    rows, columns, loading, error, refresh: fetchUsers,
    roleId, setRoleId,
    positionId, setPositionId,
    skills, setSkills,
    skillsOptions,
    positionsOptions,
  };
};
