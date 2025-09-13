// src/pages/admin/users/components/Table/hook.ts
import { type Column } from '../../../../../components/Table';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchUsers,
  selectUsersRaw,
  selectUsersLoading,
  selectUsersError,
} from '../../../../../redux/usersSlice';

import { type Skill, type Position } from '../../../../../routes/loaders/usersLoader';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  skills: string;
};

export const useUsersTable = () => {
  const [skillId, setSkillId] = useState<string | null>(null);
  const [positionId, setPositionId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);

  const [nameInput, setNameInput] = useState<string>('');
  const [nameFilter, setNameFilter] = useState<string>('');

  const skillsOptions = useLoaderData() as Skill[];
  const positionsOptions = useLoaderData() as Position[];

  const filters = useMemo(() => {
    const skillsArr =
      skillId && !Number.isNaN(Number(skillId)) ? [Number(skillId)] : undefined;

    return {
      roleId: roleId ? Number(roleId) : undefined,
      positionId: positionId ? Number(positionId) : undefined,
      skills: skillsArr,
      nameFilter: nameFilter.trim().length ? nameFilter.trim() : undefined, // use "name" key
    };
  }, [roleId, positionId, skillId, nameFilter]);

  const dispatch = useDispatch();
  const rawUsers = useSelector(selectUsersRaw);
  const loading  = useSelector(selectUsersLoading);
  const error    = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const rows: UserRow[] = useMemo(() => {
    const list = Array.isArray(rawUsers) ? rawUsers : [];
    return list.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u?.role?.name ?? '',
      position: u?.position?.name ?? '',
      skills: Array.isArray(u?.skills) ? u.skills.map((s: any) => s.name).join(', ') : '',
    }));
  }, [rawUsers]);

  const refresh = useCallback(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const applyNameFilter = useCallback(() => {
    setNameFilter(nameInput.trim());
  }, [nameInput]);

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
    rows, columns, loading, error, refresh,
    roleId, setRoleId,
    positionId, setPositionId,
    skillId, setSkillId,         
    skillsOptions, positionsOptions,
    nameInput, setNameInput, applyNameFilter,
  };
};

