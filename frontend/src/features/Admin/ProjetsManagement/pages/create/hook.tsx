// useProjectCreate.ts
import { useMemo, useState } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useLoaderData } from 'react-router-dom';
import { PROJECTSTATUSES } from '../../../../../constants/constants';
import { useSelector } from 'react-redux';
import apiCall from '../../../../../services/apiCallService';

type Client = { id: number | string; name: string };
type LoaderData = { clients: Client[] };

export type ProjectForm = {
  name: string;
  description: string;
  client_id: number | '';
  status: string | '';
  pm_id: number | '';
  employees_id: number[];
};

export const useProjectCreate = () => {
  const { clients } = useLoaderData() as LoaderData;
  const { usersList: usersOptions } = useSelector((s: any) => s.users);

  const { values, setField, reset } = useForm<ProjectForm>({
    name: '',
    description: '',
    client_id: '',
    status: '',
    pm_id: '',
    employees_id: [],
  });

  const [creating, setCreating] = useState(false);

  const clientOptions = useMemo(() => clients ?? [], [clients]);
  const statusOptions = useMemo(() => PROJECTSTATUSES ?? [], []);

  const pmUsers = useMemo(
    () => (usersOptions ?? []).filter((u: any) => Number(u.role_id) === 2),
    [usersOptions]
  );
  const employeeUsers = useMemo(
    () => (usersOptions ?? []).filter((u: any) => Number(u.role_id) === 3),
    [usersOptions]
  );

  const createProject = async () => {
    if (values.pm_id === '' || values.pm_id == null) throw new Error('Select a PM');

    setCreating(true);
    try {
      const pm = Number(values.pm_id);
      const employees = Array.from(new Set(values.employees_id.map(Number))).filter(id => id !== pm);
      const payload = {
        name: values.name,
        description: values.description,
        client_id: values.client_id === '' ? '' : Number(values.client_id),
        status: values.status,
        members: [pm, ...employees], // <-- PM + employees in one array
      };
      console.log('payload',payload)
      const res = await apiCall('/admin/projects/create', {
        method: 'POST',
        requiresAuth: true,
        data: payload,
      });
      console.log('created Successfully',res)
    } finally {
      setCreating(false);
    }
  };

  return {
    values,
    setField,
    reset,
    clientOptions,
    statusOptions,
    pmUsers,
    employeeUsers,
    createProject,   // <-- call this from the button
    creating,        // <-- pass to Button.loading
  };
};
