import { useMemo } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useLoaderData } from 'react-router-dom';
import apiCall from '../../../../../services/apiCallService';
import { useSelector } from 'react-redux';

type Position = { name: string | null };
type User = { id: number; name: string; role_id: number; position?: Position | null };
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

  const { values, setField } = useForm<ProjectForm>({
    name: '',
    description: '',
    client_id: '',
    status: '',
    pm_id: '',
    members: [],
  });

  const clientOptions = useMemo<MultiOption[]>(
    () => (clients ?? []).map(c => ({ id: c.id, name: c.name })),
    [clients]
  );

  const pmOptions = useMemo<MultiOption[]>(
    () =>
      (usersOptions ?? [])
        .filter(u => u.role_id === 2)
        .map(u => ({ id: u.id, name: `${u.name} — ${u.position?.name ?? 'No position'}` })),
    [usersOptions]
  );

  const employeeOptions = useMemo<MultiOption[]>(
    () =>
      (usersOptions ?? [])
        .filter(u => u.role_id !== 2)
        .map(u => ({ id: u.id, name: `${u.name} — ${u.position?.name ?? 'No position'}` })),
    [usersOptions]
  );

  const createProject = async () => {
    const membersCombined = [
      ...(values.pm_id ? [values.pm_id] : []),
      ...values.members,
    ].filter((v, i, a) => a.indexOf(v) === i);

    await apiCall('admin/projects/create', {
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

  return {
    values,
    setField,
    clientOptions,
    pmOptions,
    employeeOptions,
    createProject,
  };
};
