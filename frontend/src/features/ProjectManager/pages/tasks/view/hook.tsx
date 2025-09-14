// src/pages/.../useTasksTable.ts
import apiCall from '../../../../../services/apiCallService';
import { type Column } from '../../../../../components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, selectProjectsLoad, selectProjectsList } from '../../../../../redux/projectsSlice';
import { fetchUsers, selectUsersLoading, selectUsersRaw } from '../../../../../redux/usersSlice';
import Pill from '../../../../../components/Pill';

export type TaskRow = {
  id: number;
  title: string;
  assignee: string;
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
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const projectsList = useSelector(selectProjectsList);
  const loadingProjects = useSelector(selectProjectsLoad);
  const usersOptions = useSelector(selectUsersRaw);
  const loadingUsers = useSelector(selectUsersLoading);

  useEffect(() => {
    if (!loadingProjects && (!projectsList || projectsList.length === 0)) {
      dispatch(fetchProjects());
    }
    if (!loadingUsers && (!usersOptions || usersOptions.length === 0)) {
      (dispatch as any)(fetchUsers(undefined)); // or fetchUsers({ roleId: 3 }) if only employees
    }
  }, [dispatch, loadingProjects, loadingUsers, projectsList, usersOptions,]);

  // normalized options -> [{id:number, name:string}]
  const projectsOptions = useMemo(
    () => (Array.isArray(projectsList) ? projectsList : [])
      .map((p: any) => ({ id: Number(p?.id), name: String(p?.name ?? p?.title ?? '') }))
      .filter(o => Number.isFinite(o.id) && o.name.length > 0),
    [projectsList]
  );

  // build filters object and drop undefineds
  const filters = useMemo(() => {
    const f: any = {};
    if (projectId) f.projectId = Number(projectId);
    if (status) f.status = status;
    if (priority) f.priority = priority;
    if (assigneeId) f.assigned_to = assigneeId;
    return f;
  }, [projectId, status, priority, assigneeId]);

  const [rows, setRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiCall('/pm/tasks', {
        method: 'GET',
        requiresAuth: true,
        params: { filters },
      });

      const list: any[] = Array.isArray(res.data) ? res.data : [];
      const mapped: TaskRow[] = list.map((t) => ({
        id: t.id,
        title: t.title ?? '',
        assignee: t?.assignee?.name ?? t?.assignee_name ?? 'Unassigned',
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
console.log(filters)
  const columns: Column<TaskRow>[] = useMemo(() => ([
    { key: 'id', label: 'ID', width: 40 },
    { key: 'title', label: 'Title', width: 200 },
    { key: 'status', label: 'Status', width: 50, render: (value) => <Pill label={value} />, },
    { key: 'assignee', label: 'Assignee', width: 100 },
    { key: 'priority', label: 'Priority', width: 50, render: (value) => <Pill label={value} />, },
    { key: 'deadline', label: 'Deadline', width: 160 },
  ]), []);
  return {
    rows, columns, loading, error,
    refresh: fetchTasks,
    projectId, setProjectId,
    status, setStatus,
    priority, setPriority,
    usersOptions,
    projectsOptions,
    assigneeId, setAssigneeId,
  };
};
