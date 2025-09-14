import { useCallback, useEffect, useMemo, useState } from 'react';
import apiCall from '../../../services/apiCallService';

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
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // displayed
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // editable
  const [status, setStatus] = useState<string>('');
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState('');
  const [originalStatus, setOriginalStatus] = useState<string>(''); // NEW

  const isCompleted = status === 'completed';

  // CHANGED: canSubmit = only “fields present” check (do NOT include "unchanged" here
  // so the user can still click and SEE the error message).
  const canSubmit = useMemo(() => {
    if (!status) return false;
    if (isCompleted) {
      const durOk = duration.trim() !== '' && !isNaN(Number(duration)) && Number(duration) > 0;
      return note.trim().length > 0 && durOk;
    }
    return true;
  }, [status, isCompleted, note, duration]);

  const resetForm = useCallback((t: Task) => {
    setTitle(t.title ?? '');
    setDescription(t.description ?? '');
    setStatus(t.status ?? '');
    setOriginalStatus(t.status ?? ''); // NEW
    setNote('');
    setDuration('');
    setError(null); // NEW: clear any previous error when loading a new task
  }, []);

  // NEW: minimal validator for visible messages
  const validate = (): string | null => {
    if (!status) return 'Please select a status.';
    if (status === 'completed') {
      if (!note.trim()) return 'Note is required to mark as completed.';
      if (!duration.trim()) return 'Duration is required to mark as completed.';
      const n = Number(duration);
      if (isNaN(n) || n <= 0) return 'Duration must be a positive number.';
    }
    // unchanged check is a UX rule, not a field requirement
    if (status === originalStatus) return 'Status is unchanged.';
    return null;
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

  // NEW: clear error as user edits fields
  useEffect(() => {
    if (error) setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, note, duration]);

  const submit = useCallback(async () => {
    if (!taskId) return;

    // CHANGED: run validator so user sees messages (even if button enabled)
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload: Record<string, any> = { status };
      if (status === 'completed') {
        payload.note = note;
        payload.duration = duration;
      }
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
  }, [taskId, status, note, duration, onClose, originalStatus]); // CHANGED deps (removed canSubmit)
  
  return {
    loading, saving, error,
    title, description,
    status, setStatus,
    note, setNote,
    duration, setDuration,
    isCompleted, canSubmit,
    submit,
  };
};
