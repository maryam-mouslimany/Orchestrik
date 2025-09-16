import type { LoaderFunctionArgs } from 'react-router-dom';
import apiCall from '../../services/apiCallService';

export type StatusSlice = { status: string; count: number; percent: number };
export type ProjectAnalyticsData = { total: number; data: StatusSlice[] };

export async function projectAnalyticsLoader({ params, request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const fromParam = params.projectId ? Number(params.projectId) : 0;
    const fromQuery = url.searchParams.get('project_id');
    const projectId = Number(fromParam || fromQuery || 0);

    if (!projectId) {
        throw new Response('Missing project id', { status: 400 });
    }
    const res = await apiCall('/projects/analytics/status', {
        method: 'GET',
        requiresAuth: true,
        params: { project_id: projectId },
    });

    const payload = (res?.data?.data ?? res?.data) as {
        total: number;
        by_status: Array<{ status: string; count: number; percent: number }>;
    };

    const data: StatusSlice[] = Array.isArray(payload?.by_status)
        ? payload.by_status.map((s) => ({
            status: String(s.status ?? '').toLowerCase(),
            count: Number(s.count ?? 0),
            percent: Number(s.percent ?? 0),
        }))
        : [];

    return { total: Number(payload?.total ?? 0), data } as ProjectAnalyticsData;
}
