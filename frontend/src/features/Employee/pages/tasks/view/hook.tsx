// src/pages/.../useTasksTable.ts
import apiCall from '../../../../../services/apiCallService';
import { type Column } from '../../../../../components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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

  //projects from redux
  const { projectsList: projectsOptions } = useSelector((s: any) => s.projects);

  // build filters object and drop undefineds
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
        params: { filters },
      });

      const list: any[] = Array.isArray(res.data) ? res.data : [];
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
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load tasks');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void fetchTasks(); }, [fetchTasks]);

  const columns: Column<TaskRow>[] = useMemo(() => ([
    { key: 'id', label: 'ID', width: 40 },
    { key: 'title', label: 'Title', width: 200 },
    { key: 'status', label: 'Status', width: 50, render: (value) => <Pill label={value} />, },
    { key: 'description', label: 'Description', width: 260 },
    { key: 'priority', label: 'Priority', width: 50, render: (value) => <Pill label={value} />, },
    { key: 'deadline', label: 'Deadline', width: 160 },
  ]), []);
  return {
    rows, columns, loading, error,
    refresh: fetchTasks,

    projectId, setProjectId,
    status, setStatus,
    priority, setPriority,

    projectsOptions,
  };
};
