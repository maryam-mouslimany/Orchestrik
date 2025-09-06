import { useMemo } from 'react';
import { useForm } from '../../../../../hooks/useForm';
import { useLoaderData } from 'react-router-dom';
import { PROJECTSTATUSES } from '../../../../../constants/constants';

type Client = { id: number | string; name: string };

type LoaderData = {
  clients: Client[];
};

export type ProjectForm = {
  name: string;
  description: string;
  client_id: string | number | '';
  status: string | '';
};

export const useProjectCreate = () => {
  const { clients } = useLoaderData() as LoaderData;

  const { values, setField, reset } = useForm<ProjectForm>({
    name: '',
    description: '',
    client_id: '',
    status: '',
  });

  const clientOptions = useMemo(() => clients ?? [], [clients]);
  const statusOptions = useMemo(() => PROJECTSTATUSES ?? [], []);

  return {
    values,
    setField,
    reset,
    clientOptions,
    statusOptions,
  };
};
