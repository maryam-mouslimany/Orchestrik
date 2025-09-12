import CompletedTaskChart from "../components/CompletedTaskChart";
import { type DashboardBundle } from "../../../../routes/loaders/dashboardLoader";
import { useLoaderData } from "react-router-dom";
import TopLeastDurations from "../components/TopLeastDurations";
import WorkloadHeatmap from "../components/WorkloadHeatmap";
import PositionDistribution from "../components/PositionDistribution";
import SkillsBarChartCard from "../components/SkillDistribution";
import styles from "./styles.module.css";
import UnifiedCircleChart from "../components/CircleCHart";
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
      <WorkloadHeatmap rows={workload} />
      <TopLeastDurations most={durations.most} least={durations.least} />

    </>


  );
}
