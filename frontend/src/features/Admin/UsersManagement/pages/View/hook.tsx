import { type Column } from '../../../../../components/Table';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, selectUsersRaw, selectUsersLoading, selectUsersError, deleteUser, restoreUser } from '../../../../../redux/usersSlice';
import { type Skill, type Position } from '../../../../../routes/loaders/usersLoader';
import { FiEdit3, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import styles from './styles.module.css';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  skills: string;
  actions: React.ReactNode;
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

  const dispatch = useDispatch();
  const rawUsers = useSelector(selectUsersRaw);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const navigate = useNavigate();

  const refresh = useCallback(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  // --- ACTIONS ---
  const onEdit = useCallback((id: number) => {
    navigate(`/users/edit/${id}`);
  }, [navigate]);

  const onDelete = useCallback(async (id: number) => {
    await (dispatch as any)(deleteUser(id)).unwrap();
    (dispatch as any)(fetchUsers(filters));
  }, [dispatch, filters]);

  // onRestore: dispatch thunk, then fetchUsers
  const onRestore = useCallback(async (id: number) => {
    await (dispatch as any)(restoreUser(id)).unwrap();
    (dispatch as any)(fetchUsers(filters));
  }, [dispatch, filters]);

  const rows: UserRow[] = useMemo(() => {
    const list = Array.isArray(rawUsers) ? rawUsers : [];
    return list.map((u: any) => {
      const deleted = !!( u.deleted_at);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u?.role?.name ?? '',
        position: u?.position?.name ?? '',
        skills: Array.isArray(u?.skills) ? u.skills.map((s: any) => s.name).join(', ') : '',
        actions: (
          <div className={styles.actions}>
            <FiEdit3
              className={styles.icon}
              title="Edit"
              onClick={() => onEdit(u.id)}
            />
            {deleted ? (
              <FiRotateCcw
                className={styles.icon}
                title="Restore"
                onClick={() => onRestore(u.id)}
              />
            ) : (
              <FiTrash2
                className={styles.red}
                title="Delete"
                onClick={() => onDelete(u.id)}
              />
            )}
          </div>
        ),
      };
    });
  }, [rawUsers, onEdit, onDelete, onRestore]);

  const applyNameFilter = useCallback(() => {
    setNameFilter(nameInput.trim());
  }, [nameInput]);

  const columns: Column<UserRow>[] = useMemo(() => ([
    { key: 'id', label: 'ID', width: 20 },
    { key: 'name', label: 'Name', width:90 },
    { key: 'email', label: 'Email', width: 100 },
    { key: 'role', label: 'Role', width: 30 },
    { key: 'position', label: 'Position', width: 100 },
    { key: 'skills', label: 'Skills', width:300 },
    { key: 'actions', label: 'Actions', width: 50 },
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
