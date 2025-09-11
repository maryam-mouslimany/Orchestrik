import apiCall from "../../services/apiCallService";

export type Skill = {
  id: number;
  name: string;
};

export async function skillsLoader() {
  const res = await apiCall("/skills?", {
    method: "GET",
    requiresAuth: true,
  });
  return res.data as Skill[];
}

export type Position = {
  id: number;
  name: string;
};

export async function positionsLoader() {
  const res = await apiCall("/positions?", {
    method: "GET",
    requiresAuth: true,
  });
  return res.data as Position[];
}
