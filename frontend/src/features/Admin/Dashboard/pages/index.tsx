import CompletedTaskChart from "../components/CompletedTaskChart";
import { type DashboardBundle } from "../../../../routes/loaders/dashboardLoader";
import { useLoaderData } from "react-router-dom";
import TopLeastDurations from "../components/TopLeastDurations";
import WorkloadHeatmap from "../components/WorkloadHeatmap";
import PositionDistribution from "../components/PositionDistribution";
import SkillsBarChartCard from "../components/SkillDistribution";
import styles from "./styles.module.css";
import UnifiedCircleChart from "../components/CircleCHart";
import type { TaskRow } from "../../../Employee/pages/tasks/view/hook";
import EstimateVsActualScatter from "../components/EstimatedVsActual";
const mock = {
  data: [
    { date: "2025-09-05", completed: 10 },
    { date: "2025-09-06", completed: 55 },
    { date: "2025-09-07", completed: 15 },
    { date: "2025-09-08", completed: 21 },
    { date: "2025-09-09", completed: 10 },
    { date: "2025-09-10", completed: 30 },
    { date: "2025-09-11", completed: 60 },
  ],
};
const tasks: TaskRow[] = [
  { title: "Landing hero", estimated: 6, actual: 7.5, assignee: "Ava" },
  { title: "API auth", estimated: 8, actual: 6.0, assignee: "Ben" },
  { title: "Email template", estimated: 3, actual: 4.5, assignee: "Cia" },
  { title: "Search index", estimated: 10, actual: 14, assignee: "Dan" },
  { title: "Bug triage", estimated: 2, actual: 1.5, assignee: "Eli" },
  { title: "Analytics ETL", estimated: 12, actual: 16, assignee: "Fay" },
  { title: "CMS migration", estimated: 16, actual: 18, assignee: "Gus" },
  { title: "QA pass 1", estimated: 5, actual: 4, assignee: "Han" },
  { title: "Onboarding flow", estimated: 9, actual: 12, assignee: "Ivy" },
  { title: "Cache tuning", estimated: 4, actual: 3, assignee: "Jay" },
  { title: "Mobile fixes", estimated: 6, actual: 5, assignee: "Ava" },
  { title: "Admin filters", estimated: 7, actual: 9, assignee: "Ben" },
  { title: "Email QA", estimated: 2, actual: 2, assignee: "Cia" },
  { title: "Failover setup", estimated: 14, actual: 20, assignee: "Dan" },
  { title: "Autocomplete", estimated: 8, actual: 7, assignee: "Eli" },
  { title: "Event bus", estimated: 10, actual: 11, assignee: "Fay" },
  { title: "Design polish", estimated: 5, actual: 6, assignee: "Gus" },
  { title: "Perf profiling", estimated: 7, actual: 7.5, assignee: "Han" },
  { title: "Payments retry", estimated: 9, actual: 13, assignee: "Ivy" },
  { title: "Log rotation", estimated: 3, actual: 2.5, assignee: "Jay" },
];

export default function AdminDashboard() {
  const { durations, workload, positions, skills } = useLoaderData() as DashboardBundle;

  return (
    <>
      <div className={styles.flexShell}>
        <div className={styles.leftCol}>
          <CompletedTaskChart data={mock.data} />
          <SkillsBarChartCard data={skills} topN={10} />
        </div>

        <div className={styles.rightCol}>
          <PositionDistribution data={positions} />
        </div>
      </div>
      <EstimateVsActualScatter tasks={tasks} />

      <WorkloadHeatmap rows={workload} />
      <TopLeastDurations most={durations.most} least={durations.least} />
    </>

  );
}
