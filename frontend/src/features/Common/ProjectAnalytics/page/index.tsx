import React from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom';
import styles from './styles.module.css';
import { projectAnalyticsLoader } from '../../../../routes/loaders/projectsAnalyticsLoader';
import CompletedVsOverdue, { type CompletedVsOverdueShape } from '../components/CompleteVsOverdue';
import ProjectTaskStatusesChart from '../components/ProjectTaskStatusesChart';
import LoadingIndicator from '../../../../components/Loading';
type RawApiWrap<T> = { status?: string; message?: string; data?: T } | T;

function unwrap<T>(res: RawApiWrap<T>): T {
  return (res as any)?.data ?? (res as T);
}

const ProjectAnalytics: React.FC = () => {
  const { status, completedVsOverdue } = useLoaderData() as {
    status: RawApiWrap<{ total: number; by_status: Array<{ status: string; count: number; percent: number }> }>;
    completedVsOverdue: RawApiWrap<CompletedVsOverdueShape & { project_id: number }>;
  };

  const navigation = useNavigation();
  const loading = navigation.state === 'loading';
  if (loading) return <LoadingIndicator/>;

  const statusPayload = unwrap(status);
  const statusTotal = Number(statusPayload?.total ?? 0);
  const statusData = Array.isArray(statusPayload?.by_status)
    ? statusPayload.by_status.map(s => ({
        status: String(s.status ?? '').toLowerCase(),
        count: Number(s.count ?? 0),
        percent: Number(s.percent ?? 0),
      }))
    : [];

  const cvo = unwrap(completedVsOverdue) as CompletedVsOverdueShape & { project_id?: number };

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Project Analytics</h2>

      <div className={styles.kpis}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Completed</div>
          <div className={styles.kpiValue}>{cvo.completed_total}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>On-time %</div>
          <div className={styles.kpiValueSuccess}>{cvo.on_time_percent.toFixed(2)}%</div>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Overdue %</div>
          <div className={styles.kpiValueDanger}>{cvo.overdue_percent.toFixed(2)}%</div>
        </div>
      </div>

      <div className={styles.grid}>
        <ProjectTaskStatusesChart title="Task Status Breakdown" total={statusTotal} data={statusData} />
        <CompletedVsOverdue data={cvo} />
      </div>
    </div>
  );
};

export default ProjectAnalytics;
export { projectAnalyticsLoader };
