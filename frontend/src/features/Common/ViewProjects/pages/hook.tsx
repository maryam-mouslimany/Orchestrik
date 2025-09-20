import { useEffect, useMemo, useState, useCallback } from "react";
import apiCall from "../../../../services/apiCallService";

export type ProjectOption = { id: number; name: string };

export const useViewProjects = () => {

  const [nameInput, setNameInput] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [membersOpen, setMembersOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const openMembers = (id: number) => {
    setSelectedProjectId(id);
    setMembersOpen(true);
  };
  const closeMembers = () => {
    setMembersOpen(false);
    setSelectedProjectId(null);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = { withTaskStats: true };
        if (nameFilter.trim() !== "") params.name = nameFilter.trim();

        const res = await apiCall("/projects", {
          method: "GET",
          requiresAuth: true,
          params,
        });

        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (!cancelled) {
          setProjects(raw.map((p: any) => ({ ...p, id: Number(p.id) })));
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [nameFilter]); 

  const applyNameFilter = useCallback(() => {
    setNameFilter(nameInput.trim());
  }, [nameInput]);

  const projectOptions: ProjectOption[] = useMemo(
    () =>
      projects
        .map((p: any) => ({ id: Number(p.id), name: String(p.name ?? p.title ?? "") }))
        .filter((o) => Number.isFinite(o.id) && o.name !== ""),
    [projects]
  );

  const refresh = () => setNameFilter((v) => v); 

  return {
    nameInput,          
    setNameInput,       
    applyNameFilter,      
    nameFilter,           
    projects,
    projectOptions,
    loading,
    error,
    refresh,
    membersOpen,
    selectedProjectId,
    openMembers,
    closeMembers,
  };
};
