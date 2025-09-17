import type { LoaderFunctionArgs } from 'react-router-dom';
import apiCall from '../../services/apiCallService';

export type ProjectAnalyticsBundle = {
  status: any;             
  completedVsOverdue: any;  
};

export async function projectAnalyticsLoader({ params, request }: LoaderFunctionArgs): Promise<ProjectAnalyticsBundle> {
  const url = new URL(request.url);
  const projectId = Number(params.projectId || url.searchParams.get('project_id') || 0);
  if (!projectId) throw new Response('Missing project id', { status: 400 });

  const [statusRes, cvoRes] = await Promise.all([
    apiCall('/projects/analytics/status', {
      method: 'GET',
      requiresAuth: true,
      params: { project_id: projectId },
    }),
    apiCall('/projects/analytics/completed-vs-overdue', {
      method: 'GET',
      requiresAuth: true,
      params: { project_id: projectId },
    }),
  ]);

  return {
    status: statusRes.data,
    completedVsOverdue: cvoRes.data,
  };
}
