import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../../redux/store';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { type Skill, type Position } from '../../../../../routes/loaders/usersLoader';
import { fetchUsers, selectUsersRaw, selectUsersLoading, selectUsersError, deleteUser, restoreUser } from '../../../../../redux/usersSlice';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  skills: string;
  actions: React.ReactNode;
  deleted: boolean;
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
      nameFilter: nameFilter.trim().length ? nameFilter.trim() : undefined,
    };
  }, [roleId, positionId, skillId, nameFilter]);

  const dispatch = useDispatch<AppDispatch>();
  const rawUsers = useSelector(selectUsersRaw);
  console.log(rawUsers)
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const navigate = useNavigate();

  const refresh = useCallback(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const onDelete = useCallback(async (id: number) => {
    await (dispatch as any)(deleteUser(id)).unwrap();
    (dispatch as any)(fetchUsers(filters));
  }, [dispatch, filters]);

  const onRestore = useCallback(async (id: number) => {
    await (dispatch as any)(restoreUser(id)).unwrap();
    (dispatch as any)(fetchUsers(filters));
  }, [dispatch, filters]);

  const onEdit = useCallback((id: number) => {
    navigate(`/users/edit/${id}`);
  }, [navigate]);

  const rows: UserRow[] = useMemo(() => {
    const list = Array.isArray(rawUsers) ? rawUsers : [];
    return list.map((u: any) => {
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u?.role?.name ?? '',
        position: u?.position?.name ?? '',
        skills: Array.isArray(u?.skills) ? u.skills.map((s: any) => s.name).join(', ') : '',
        deleted: Boolean(u.deleted_at),
      };
    });
  }, [rawUsers, onEdit, onDelete, onRestore]);

  const applyNameFilter = useCallback(() => {
    setNameFilter(nameInput.trim());
  }, [nameInput]);


  return {
    rows, loading, error, refresh,
    roleId, setRoleId,
    positionId, setPositionId,
    skillId, setSkillId,
    skillsOptions, positionsOptions,
    nameInput, setNameInput, applyNameFilter,
    onEdit, onDelete, onRestore,
  };
};
