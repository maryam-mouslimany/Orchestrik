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

export type PositionDistribution = {
  id: number;
  position: string;
  count: number;
  percentage?: number;
};

export type ActualVsEstimated = {
  title: string;
  actual: number;
  estimated: number;
  assignee: string;
};

export type DashboardBundle = {
  durations: Durations;
  workload: Workload;
  positions: PositionDistribution;
  skills: PositionDistribution;
  actualEstimated: ActualVsEstimated;
};

export async function dashboardLoader(): Promise<DashboardBundle> {
  const [durationsRes, workloadRes, positionsDistributionRes, skillsDistributionRes, actualVsEstimated] = await Promise.all([
    apiCall("/admin/analytics/tasks/durations", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/workload", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/positions", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/skills", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/tasks/actual-estimated", { method: "GET", requiresAuth: true }),
  ]);
  console.log(positionsDistributionRes.data)
  return {
    durations: durationsRes.data,
    workload: workloadRes.data,
    positions: positionsDistributionRes.data,
    skills: skillsDistributionRes.data,
    actualEstimated: actualVsEstimated.data
  };
}
