// src/pages/.../useTasksTable.ts
import apiCall from '../../../../../services/apiCallService';
import { type Column } from '../../../../../components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, selectProjectsLoad, selectProjectsList } from '../../../../../redux/projectsSlice';
import Pill from '../../../../../components/Pill';

export type TaskRow = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  project: string;
};

export const useTasksTable = () => {
  // filters
  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  // pagination (same as PM page)
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [isPaginated, setIsPaginated] = useState(false);

  // projects from redux
  const dispatch = useDispatch();
  const projectsList = useSelector(selectProjectsList);
  const loadingProjects = useSelector(selectProjectsLoad);

  useEffect(() => {
    if (!loadingProjects && (!projectsList || projectsList.length === 0)) {
      dispatch(fetchProjects());
    }
  }, [dispatch, loadingProjects, projectsList]);

  // normalized options
  const projectsOptions = useMemo(
    () => (Array.isArray(projectsList) ? projectsList : [])
      .map((p: any) => ({ id: Number(p?.id), name: String(p?.name ?? p?.title ?? '') }))
      .filter(o => Number.isFinite(o.id) && o.name.length > 0),
    [projectsList]
  );

  // filters (ONLY filters here; pagination is top-level)
  const filters = useMemo(() => {
    const f: any = {};
    if (projectId) f.projectId = Number(projectId);
    if (status) f.status = status;
    if (priority) f.priority = priority;
    return f;
  }, [projectId, status, priority]);

  const [rows, setRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiCall('/employee/tasks', {
        method: 'GET',
        requiresAuth: true,
        params: { page, per_page: perPage, filters }, // SAME way as PM page
      });

      const payload = res.data;

      // list extraction (supports plain array OR Laravel paginator top-level OR wrapped under data)
      const list: any[] =
        Array.isArray(payload) ? payload :
        Array.isArray(payload?.data) ? payload.data :
        Array.isArray(payload?.data?.data) ? payload.data.data :
        [];

      const mapped: TaskRow[] = list.map((t) => ({
        id: t.id,
        title: t.title ?? '',
        description: t.description ?? '',
        status: t.status ?? '',
        priority: t.priority ?? '',
        deadline: t.deadline ?? '',
        project: t.project?.name ?? '',
      }));
      setRows(mapped);

      // meta detection (top-level or nested)
      const meta =
        (payload && typeof payload === 'object' && 'total' in payload) ? payload :
        (payload?.data && typeof payload.data === 'object' && 'total' in payload.data) ? payload.data :
        null;

      const paged = !!meta;
      setIsPaginated(paged);
      setTotal(paged ? Number(meta.total ?? mapped.length) : mapped.length);

      if (paged && typeof meta.current_page === 'number') setPage(meta.current_page);
      if (paged && typeof meta.per_page === 'number') setPerPage(meta.per_page);

    } catch (e: any) {
      setError(e?.message ?? 'Failed to load tasks');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => { void fetchTasks(); }, [fetchTasks]);

  const columns: Column<TaskRow>[] = useMemo(() => ([
    { key: 'id', label: 'ID', width: 20 },
    { key: 'title', label: 'Title', width: 100 },
    { key: 'status', label: 'Status', width: 50, render: (value) => <Pill label={value} /> },
    { key: 'description', label: 'Description', width: 260 },
    { key: 'priority', label: 'Priority', width: 50, render: (value) => <Pill label={value} /> },
    { key: 'deadline', label: 'Deadline', width: 80 },
  ]), []);

  return {
    rows, columns, loading, error,
    refresh: fetchTasks,

    projectId, setProjectId,
    status, setStatus,
    priority, setPriority,
    projectsOptions,
    isPaginated,
    page, setPage,
    perPage, setPerPage,
    total,
  };
};
