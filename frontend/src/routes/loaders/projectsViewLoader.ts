import apiCall from "../../services/apiCallService";

export type ProjectUser = {
  id: number; name: string; email: string;
  role_id: number | null; position_id: number | null;
};

export type ProjectClient = {
  id: number; name: string; email: string; phone: string | null;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  status: "active" | "paused" | "completed" | "archived" | string;
  client_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  total?: number;
  unfinished?: number;
  completed?: number;
  overdue?: number;
  creator: ProjectUser;
  client: ProjectClient;
  members: ProjectUser[];
};

export async function projectsLoader() {
  const res = await apiCall("/projects?withTaskStats=1", {
    method: "GET",
    requiresAuth: true,
  });
  return res.data as Project[];
}
