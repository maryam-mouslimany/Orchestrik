import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../../../../hooks/useForm';
import apiCall from '../../../../../services/apiCallService';
import type { AppDispatch } from '../../../../../redux/store';
import { fetchProjects, selectProjectsList, selectProjectsLoaded, } from '../../../../../redux/projectsSlice';

type Member = { id: number; name: string };
export type TaskForm = {
  title: string; description: string; priority: string | '';
  deadline: string; project_id: number | ''; assigned_to: number | '';
};

export const useTaskCreate = () => {

  const navigate = useNavigate();
  const { projectsList: projectsOptions } = useSelector((s: any) => s.projects);
  //console.log(projectsOptions)
  const dispatch = useDispatch<AppDispatch>();
  const projectOptions = useSelector(selectProjectsList);
  const usersLoad = useSelector(selectProjectsLoaded);

  useEffect(() => {
    if (!usersLoad && (!projectOptions || projectOptions.length === 0)) {
      dispatch(fetchProjects(undefined));
    }
  }, [dispatch, usersLoad, projectOptions]);


  const { values, setField, reset } = useForm<TaskForm>({
    title: '', description: '', priority: '', deadline: '', project_id: '', assigned_to: '',
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recReason, setRecReason] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const projectId = Number(values.project_id) || 0;

  useEffect(() => {
    if (!projectId) {
      setMembers([]);
      if (values.assigned_to) setField('assigned_to', '' as any);
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const res = await apiCall('projects/members', {
          method: 'GET', requiresAuth: true, params: { projectId }
        });
        const arr: Member[] = (res?.data?.members ?? [])
          .map((m: any) => ({ id: +m.id, name: String(m.name) }));
        if (cancel) return;
        setMembers(arr);
        const current = values.assigned_to ? +values.assigned_to : '';
        if (current && !arr.some(u => u.id === current)) setField('assigned_to', '' as any);
      } catch {
        if (cancel) return;
        setMembers([]);
        if (values.assigned_to) setField('assigned_to', '' as any);
      }
    })();
    return () => { cancel = true; };
  }, [projectId, setField]);

  // add this near your other state:
  const reasonTimer = useRef<number | null>(null);

  // updated recommendAssignee
  const recommendAssignee = async () => {
    if (!values.project_id) return;

    if (reasonTimer.current) { clearTimeout(reasonTimer.current); reasonTimer.current = null; }
    setRecReason('');

    try {
      setRecLoading(true);
      const res = await apiCall('pm/recommend-assignee', {
        method: 'POST',
        requiresAuth: true,
        data: {
          project_id: Number(values.project_id),
          title: String(values.title || ''),
          description: String(values.description || ''),
        },
      });

      const user = res?.data?.user;
      const why = res?.data?.why;

      if (user?.id) setField('assigned_to', +user.id);

      if (why) {
        setRecReason(String(why));
        reasonTimer.current = window.setTimeout(() => {
          setRecReason('');
          reasonTimer.current = null;
        }, 20000); // 20s
      }
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => () => {
    if (reasonTimer.current) clearTimeout(reasonTimer.current);
  }, []);

  const createTask = async () => {
    const valid = !!values.project_id && !!values.priority;
    if (!valid) { setFormError('All fields are required.'); return; }
    setFormError('');
    try {
      setCreateLoading(true);
      const res = await apiCall('pm/tasks/create', {
        method: 'POST', requiresAuth: true,
        data: {
          title: values.title,
          description: values.description,
          priority: values.priority,
          deadline: values.deadline,
          project_id: values.project_id,
          assigned_to: values.assigned_to,
        },
      });
      console.log('created', res)
      navigate('/tasks', { replace: true });

    } finally { setCreateLoading(false); }
  };
  //console.log(values)
  return {
    values, setField, reset,
    projectsOptions, members,
    recommendAssignee, recLoading, recReason,
    createTask, createLoading,
    formError
  };
};
