import { useMemo, useState, useEffect } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useLoaderData } from 'react-router-dom';
import apiCall from '../../../../../services/apiCallService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsersRaw, selectUsersLoading } from '../../../../../redux/usersSlice';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../../../redux/store';

export type MultiOption = { id: number; name: string };

type UsersCreateLoader = {
  roles: Array<{ id: number; name: string }>;
  positions: Array<{ id: number; name: string }>;
  skills: Array<{ id: number; name: string }>;
};

export type UserForm = {
  name: string;
  email: string;
  role_id: number | '';
  position_id: number | '';
  password: string;
  confirm: string;
  skills: number[];
};


const NAME_NEEDS_FIRST_LAST = (name: string) =>
  /^\s*[A-Za-z][A-Za-z'’-]*\s+[A-Za-z][A-Za-z'’-]*.*$/.test(name.trim());

const EMAIL_OK = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const useUserCreate = () => {
  const navigate = useNavigate();
  const { roles, positions, skills } = useLoaderData() as UsersCreateLoader;

  const dispatch = useDispatch<AppDispatch>();
  const usersOptions = useSelector(selectUsersRaw);
  const usersLoad = useSelector(selectUsersLoading);

  useEffect(() => {
    if (!usersLoad && (!usersOptions || usersOptions.length === 0)) {
      dispatch(fetchUsers(undefined));
    }
  }, [dispatch, usersLoad, usersOptions]);

  const { values, setField } = useForm<UserForm>({
    name: '',
    email: '',
    role_id: '',
    position_id: '',
    password: '',
    confirm: '',
    skills: [],
  });

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const roleOptions = useMemo<MultiOption[]>(
    () => (roles ?? []).map(r => ({ id: r.id, name: r.name })),
    [roles]
  );

  const positionOptions = useMemo<MultiOption[]>(
    () => (positions ?? []).map(p => ({ id: p.id, name: p.name })),
    [positions]
  );

  const skillsOptions = useMemo<MultiOption[]>(
    () => (skills ?? []).map(s => ({ id: s.id, name: s.name })),
    [skills]
  );

  const nameFormatBad = useMemo(
    () => values.name.trim().length > 0 && !NAME_NEEDS_FIRST_LAST(values.name),
    [values.name]
  );

  const emailInvalid = useMemo(
    () => values.email.trim().length > 0 && !EMAIL_OK(values.email),
    [values.email]
  );

  const passwordTooShort = useMemo(
    () => values.password.length > 0 && values.password.length < 6,
    [values.password]
  );

  const confirmMismatch = useMemo(
    () => values.confirm.length > 0 && values.confirm !== values.password,
    [values.confirm, values.password]
  );

  const createUser = async () =>
    apiCall('admin/users/create', {
      method: 'POST',
      requiresAuth: true,
      data: {
        name: values.name.trim(),
        email: values.email.trim(),
        role_id: values.role_id || null,
        position_id: values.position_id || null,
        password: values.password,
        skills: values.skills,
      },
    });

  const handleCreateClick = async () => {
    if (creating) return;

    const missingRequired =
      !values.name.trim() ||
      !values.email.trim() ||
      !values.role_id ||
      !values.position_id ||
      !values.password ||
      !values.confirm ||
      values.skills.length === 0;

    if (missingRequired) {
      setFormError('Please fill all required fields.');
      return;
    }

    if (nameFormatBad || emailInvalid || passwordTooShort || confirmMismatch) {
      setFormError(null);
      return;
    }

    setFormError(null);
    setCreating(true);
    try {
      await createUser();
      dispatch(fetchUsers(undefined));
      console.log('user created');
      navigate('/users', { replace: true });
    } finally {
      setCreating(false);
    }
  };

  return {
    values, setField,
    roleOptions, positionOptions, skillsOptions,
    handleCreateClick,
    creating,
    formError,
    nameFormatBad, emailInvalid, passwordTooShort, confirmMismatch,
  };
};
