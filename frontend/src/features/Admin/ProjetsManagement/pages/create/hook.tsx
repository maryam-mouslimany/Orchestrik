// useProjectCreate.ts
import { useMemo, useState } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useLoaderData } from 'react-router-dom';
import apiCall from '../../../../../services/apiCallService';
import { useSelector } from 'react-redux';

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

export const useProjectCreate = () => {
  const { clients } = useLoaderData() as ProjectsCreateLoader;
  const { usersList: usersOptions } = useSelector((s: any) => s.users);

  const { values, setField } = useForm<ProjectForm>({
    name: '',
    description: '',
    client_id: '',
    status: '',
    pm_id: '',
    members: [],
  });

  const [creating, setCreating] = useState(false);

  const clientOptions = useMemo<MultiOption[]>(
    () => (clients ?? []).map(c => ({ id: c.id, name: c.name })),
    [clients]
  );

  const pmOptions = useMemo<MultiOption[]>(
    () =>
      (usersOptions ?? [])
        .filter(u => Number(u.role_id) === 2)
        .map(u => ({ id: Number(u.id), name: `${u.name} — ${u.position?.name ?? 'No position'}` })),
    [usersOptions]
  );

  const employeeOptions = useMemo<MultiOption[]>(
    () =>
      (usersOptions ?? [])
        .filter(u => Number(u.role_id) !== 2)
        .map(u => ({ id: Number(u.id), name: `${u.name} — ${u.position?.name ?? 'No position'}` })),
    [usersOptions]
  );

  const createProject = async () => {
    const membersCombined = Array.from(
      new Set([...(values.pm_id ? [Number(values.pm_id)] : []), ...values.members.map(Number)])
    );

    return apiCall('admin/projects/create', {
      method: 'POST',
      requiresAuth: true,
      data: {
        name: values.name,
        description: values.description,
        client_id: values.client_id || null,
        status: values.status,
        members: membersCombined,
      },
    });

  };

  const handleCreateClick = async () => {
    if (creating) return;
    setCreating(true);
    try {
      await createProject();
      console.log('success')

    } finally {
      setCreating(false);
    }
  };

  return {
    values,
    setField,
    clientOptions,
    pmOptions,
    employeeOptions,
    handleCreateClick,
    creating,
  };
};
