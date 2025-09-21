import { useCallback, useEffect, useMemo, useState } from 'react';
import apiCall from '../../../../services/apiCallService';

export type EditTaskModalHookArgs = {
  open: boolean;
  onClose: () => void;
  taskId: number | null;
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export const useEditTaskModal = ({ open, onClose, taskId }: EditTaskModalHookArgs) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // displayed
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // editable
  const [status, setStatus] = useState<string>('');
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState('');
  const [originalStatus, setOriginalStatus] = useState<string>(''); // NEW

  const isCompleted = status === 'completed';
  const isReopened = status === 'reopened';

  const canSubmit = useMemo(() => {
    if (!status) return false;

    return isCompleted
      ? note.trim().length > 0 && duration.trim() !== '' && !isNaN(Number(duration)) && Number(duration) > 0
      : isReopened
        ? note.trim().length > 0
        : true;
  }, [status, isCompleted, isReopened, note, duration]);

  const resetForm = useCallback((t: Task) => {
    setTitle(t.title ?? '');
    setDescription(t.description ?? '');
    setStatus(t.status ?? '');
    setOriginalStatus(t.status ?? ''); 
    setNote('');
    setDuration('');
    setError(null);
  }, []);

  const validate = (): string | null => {
    if (!status) return 'Please select a status.';
    return isCompleted
      ? (!note.trim()
        ? 'Note is required to mark as completed.'
        : !duration.trim()
          ? 'Duration is required to mark as completed.'
          : isNaN(Number(duration)) || Number(duration) <= 0
            ? 'Duration must be a positive number.'
            : status === originalStatus
              ? 'Status is unchanged.'
              : null)
      : isReopened
        ? (!note.trim()
          ? 'Note is required to reopen a task.'
          : status === originalStatus
            ? 'Status is unchanged.'
            : null)
        : (status === originalStatus ? 'Status is unchanged.' : null);
  };

  const fetchDetails = useCallback(async () => {
    if (!open || !taskId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await apiCall(`/pm/tasks/${taskId}`, {
        method: 'GET',
        requiresAuth: true,
      });
      const data: Task = res.data;
      resetForm(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [open, taskId, resetForm]);

  useEffect(() => { void fetchDetails(); }, [fetchDetails]);

  useEffect(() => {
    if (error) setError(null);
  }, [status, note, duration]);

  const submit = useCallback(async () => {
    if (!taskId) return;

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        status,
        ...(status === 'completed'
          ? { note: note.trim(), duration: Number(duration) }
          : status === 'reopened'
            ? { note: note.trim() }
            : {}),
      };
      console.log('payload', payload)
      await apiCall(`/tasks/editStatus/${taskId}`, {
        method: 'POST',
        requiresAuth: true,
        data: payload,
      });

      onClose();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }, [taskId, status, note, duration, onClose, originalStatus]); 

  return {
    loading, saving, error,
    title, description,
    status, setStatus,
    note, setNote,
    duration, setDuration,
    isCompleted, canSubmit,
    submit, isReopened
  };
};
