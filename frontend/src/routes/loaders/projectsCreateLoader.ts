import apiCall from '../../services/apiCallService';
import type { LoaderFunctionArgs } from 'react-router-dom';

export type Client = { id: number; name: string };
export type ProjectsCreateLoader = { clients: Client[] };

export const projectsCreateLoader = async (_args: LoaderFunctionArgs): Promise<ProjectsCreateLoaderData> => {
  try {
    const res = await apiCall('/clients', { method: 'GET', requiresAuth: true });
    const clients: Client[] = Array.isArray(res.data) ? res.data : [];
    return { clients };
  } catch (e: any) {

    return { clients: [] };
  }
};
