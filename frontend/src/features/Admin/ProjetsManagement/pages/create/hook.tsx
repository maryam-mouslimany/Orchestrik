import { useMemo, useState } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useLoaderData } from 'react-router-dom';
import apiCall from '../../../../../services/apiCallService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsersRaw, selectUsersLoading } from '../../../../../redux/usersSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type MultiOption = { id: number; name: string };
type ProjectsCreateLoader = { clients: Array<{ id: number; name: string }> };

export type ProjectForm = {
  name: string;
  description: string;
  client_id: number | '';
  status: string | '';
  pm_id: number | '';
  members: number[];
};

const MIN_DESC = 20; 

export const useProjectCreate = () => {
  const navigate = useNavigate();
  const { clients } = useLoaderData() as ProjectsCreateLoader;

  const dispatch = useDispatch();
  const usersOptions = useSelector(selectUsersRaw);       
  const usersLoad = useSelector(selectUsersLoading);  

  useEffect(() => {
    if (!usersLoad && (!usersOptions || usersOptions.length === 0)) {
      dispatch(fetchUsers(undefined)); 
    }
  }, [dispatch, usersLoad, usersOptions]);


  const { values, setField } = useForm<ProjectForm>({
    name: '',
    description: '',
    client_id: '',
    status: '',
    pm_id: '',
    members: [],
  });

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const clientOptions = useMemo<MultiOption[]>(
    () => (clients ?? []).map(c => ({ id: c.id, name: c.name })),
    [clients]
  );

  const pmOptions = useMemo<MultiOption[]>(
    () =>
      (usersOptions ?? [])
        .filter((u: any) => Number(u.role_id) === 2)
        .map((u: any) => ({
          id: Number(u.id),
          name: `${u.name} — ${u.position?.name ?? 'No position'}`,
        })),
    [usersOptions]
  );

  const employeeOptions = useMemo<MultiOption[]>(
    () =>
      (usersOptions ?? [])
        .filter((u: any) => Number(u.role_id) !== 2)
        .map((u: any) => ({
          id: Number(u.id),
          name: `${u.name} — ${u.position?.name ?? 'No position'}`,
        })),
    [usersOptions]
  );

  // Combine members + pm (pm is included if selected)
  const combinedMembers = useMemo<number[]>(
    () =>
      Array.from(
        new Set([
          ...(values.pm_id ? [Number(values.pm_id)] : []),
          ...values.members.map(Number),
        ])
      ),
    [values.pm_id, values.members]
  );

  // Live flags for inline hints
  const descTooShort = useMemo(
    () => values.description.trim().length > 0 && values.description.trim().length < MIN_DESC,
    [values.description]
  );
  const membersTooFew = useMemo(
    () => combinedMembers.length > 0 && combinedMembers.length < 3,
    [combinedMembers.length]
  );

  const createProject = async () =>
    apiCall('admin/projects/create', {
      method: 'POST',
      requiresAuth: true,
      data: {
        name: values.name,
        description: values.description,
        client_id: values.client_id || null,
        status: values.status,
        members: combinedMembers,
      },
    });

  const handleCreateClick = async () => {
    if (creating) return;

    // Minimal validation (required + constraints)
    const nameOk = values.name.trim().length > 0;
    const descOk = values.description.trim().length >= MIN_DESC;
    const clientOk = !!values.client_id;
    const pmOk = !!values.pm_id;
    const membersOk = combinedMembers.length >= 3;

    if (!nameOk || !descOk || !clientOk || !pmOk || !membersOk) {
      setFormError(
        'Please fill all required fields.'
      );
      return;
    }

    setFormError(null);
    setCreating(true);
    try {
      await createProject();
      navigate('/projects', { replace: true });
      console.log('success');
    } finally {
      setCreating(false);
    }
  };

  return {
    values, setField,
    clientOptions, pmOptions, employeeOptions,
    handleCreateClick,
    creating,
    formError, descTooShort, membersTooFew,
  };
};