import apiCall from "../../services/apiCallService";

export type DurationItem = { title: string; duration: number };
export type Durations = { most: DurationItem[]; least: DurationItem[] };
export type CompletedPoint = { date: string; completed: number };
export type Workload = {
  name: string;
  pending: number;
  in_progress: number;
  total: number;
};
export type DashboardBundle = {
  durations: Durations;
  workload: Workload;
  positions: PositionDistribution;
  skills:PositionDistribution;
};
export type PositionDistribution = {
  id: number;
  position: string;
  count: number;
  percentage?: number;
};

export async function dashboardLoader(): Promise<DashboardBundle> {
  const [durationsRes, workloadRes, positionsDistributionRes, skillsDistributionRes] = await Promise.all([
    apiCall("/admin/analytics/tasks/durations", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/workload", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/positions", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/skills", { method: "GET", requiresAuth: true }),

  ]);
  console.log(positionsDistributionRes.data)
  return {
    durations: durationsRes.data,
    workload: workloadRes.data,
    positions: positionsDistributionRes.data,
    skills: skillsDistributionRes.data,

  };
}
