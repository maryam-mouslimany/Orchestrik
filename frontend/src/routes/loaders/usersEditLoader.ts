import apiCall from '../../services/apiCallService';
import type { LoaderFunctionArgs } from 'react-router-dom';

export async function usersEditLoader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  if (!id) throw new Response('Invalid id', { status: 400 });

  const res = await apiCall(`/admin/users/${id}`, {
    method: 'GET',
    requiresAuth: true,
  });
  return res.data;}
