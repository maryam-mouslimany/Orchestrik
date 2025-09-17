import type { LoaderFunctionArgs } from 'react-router-dom';
import apiCall from '../../services/apiCallService';

export type StatusItem = {
  status: string;
  count: number;
  percent: number;
};

export type StatusBreakdown = {
  total: number;
  by_status: StatusItem[];
};

export type CompletedVsOverdueShape = {
  completed_total: number;
  on_time_count: number;
  overdue_count: number;
  on_time_percent: number;
  overdue_percent: number;
};

export type ReopenRate = {
  project_id: number;
  completed_tasks: number;
  reopened_tasks: number;
  reopen_rate_percent: number;
};


export type ProjectAnalyticsBundle = {
  status: StatusBreakdown;
  completedVsOverdue: CompletedVsOverdueShape;
  reopened: ReopenRate;
};

export async function projectAnalyticsLoader(
  { params, request }: LoaderFunctionArgs
): Promise<ProjectAnalyticsBundle> {
  const url = new URL(request.url);
  const projectId = Number(params.projectId || url.searchParams.get('project_id') || 0);
  if (!projectId) throw new Response('Missing project id', { status: 400 });

  const [statusRes, cvoRes, reopenedRes] = await Promise.all([
    apiCall('/projects/analytics/status', { method: 'GET', requiresAuth: true, params: { project_id: projectId } }),
    apiCall('/projects/analytics/completed-vs-overdue', { method: 'GET', requiresAuth: true, params: { project_id: projectId } }),
    apiCall('/projects/analytics/reopened', { method: 'GET', requiresAuth: true, params: { project_id: projectId } }),
  ]);

  return {
    status: statusRes.data,
    completedVsOverdue: cvoRes.data,
    reopened: reopenedRes.data,
  };
}
