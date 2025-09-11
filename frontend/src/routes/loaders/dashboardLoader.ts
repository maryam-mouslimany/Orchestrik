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
  //completedTimeline: CompletedPoint[];
};

export async function dashboardLoader(): Promise<DashboardBundle> {
  const [durationsRes, workloadRes] = await Promise.all([
    apiCall("/admin/analytics/tasks/durations", { method: "GET", requiresAuth: true }),
    apiCall("/admin/analytics/employees/workload", { method: "GET", requiresAuth: true }),

    //apiCall("/admin/analytics/tasks/completed-per-day?days=7", { method: "GET", requiresAuth: true }),
  ]);

  return {
    durations: durationsRes.data,
    workload: workloadRes.data,
    //completedTimeline: timelineRes.data,    
  };
}
