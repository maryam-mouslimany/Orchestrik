import { useEffect, useState } from 'react';
import apiCall from '../../../../../services/apiCallService';

export type Member = {
  id: number;
  name: string;
  email?: string;
  position?: string | null;
  skills: Array<{ id: number; name: string }>;
};

type ApiResponse = {
  pm?: any;
  members: Member[];
};

export const useProjectMembers = (projectId: number | null, open: boolean) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    if (!open || !projectId) {
      setMembers([]);
      setError(null);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiCall('pm/projects/members', {
          method: 'GET',
          requiresAuth: true,
          params: { projectId },
        });

        const data: ApiResponse =
          (res?.data?.data as ApiResponse) ??
          (res?.data as ApiResponse) ??
          { members: [] };

        const safeMembers = Array.isArray(data.members)
          ? data.members.map((m: any) => ({
              id: Number(m.id),
              name: String(m.name ?? ''),
              email: m.email ? String(m.email) : undefined,
              position: m.position ?? null,
              skills: Array.isArray(m.skills)
                ? m.skills.map((s: any) => ({ id: Number(s.id), name: String(s.name ?? '') }))
                : [],
            }))
          : [];

        if (!cancel) setMembers(safeMembers);
      } catch (e: any) {
        if (!cancel) {
          setMembers([]);
          setError(e?.message ?? 'Failed to load members');
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
  }, [projectId, open]);

  return { loading, members, error };
};
