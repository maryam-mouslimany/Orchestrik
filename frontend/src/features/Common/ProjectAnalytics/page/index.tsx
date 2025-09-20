import React from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom';
import type { ProjectAnalyticsBundle } from '../../../../routes/loaders/projectsAnalyticsLoader';
import PieMini from '../components/PieChart';
import styles from './styles.module.css';
import LoadingIndicator from '../../../../components/Loading';

const ProjectAnalytics: React.FC = () => {
  
  const { status, completedVsOverdue, reopened } = useLoaderData() as ProjectAnalyticsBundle;
  const loading = useNavigation().state === 'loading';
  if (loading) return <LoadingIndicator/>;

  const statusSlices = status.by_status.map(s => ({ id: s.status, value: s.count }));
  const statusTotal = status.total;

  const cvoSlices = [
    { id: 'On time', value: completedVsOverdue.on_time_count },
    { id: 'Overdue', value: completedVsOverdue.overdue_count },
  ];
  const completedTotal = completedVsOverdue.completed_total;

  const reopenedCount = reopened.reopened_tasks;
  const notReopened = Math.max(0, reopened.completed_tasks - reopenedCount);
  const reopenSlices = [
    { id: 'Reopened', value: reopenedCount },
    { id: 'Not reopened', value: notReopened },
  ];

  return (
      <div className={styles.page}>
  <div className={styles.headerRow}>
    <h1 className={styles.h1}>Project Analytics</h1>
    <div className={styles.subtle}>Range: Last 30 days · Demo data</div>
  </div>

  <div className={styles.kpis}>
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>Total Tasks</div>
      <div className={styles.kpiValue}>23</div>
      <div className={`${styles.kpiDelta} ${styles.kpiUp}`}>▲ +12% vs prev 30d</div>
    </div>
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>Completed</div>
      <div className={styles.kpiValue}>11</div>
      <div className={`${styles.kpiDelta} ${styles.kpiUp}`}>▲ +3</div>
    </div>
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>Overdue</div>
      <div className={styles.kpiValue}>2</div>
      <div className={`${styles.kpiDelta} ${styles.kpiDown}`}>▼ −2</div>
    </div>
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>On-time %</div>
      <div className={styles.kpiValue}>76.9%</div>
      <div className={styles.dd}>p75 cycle: 3.1d</div>
    </div>
  </div>

  {/* keep your three pie cards here */}
  {/* ... your 3 <PieMini /> or current pie blocks ... */}

  {/* QUICK LISTS */}
  <div className={styles.twoCol}>
    <div className={styles.card}>
      <div className={styles.cardTitle}>At-Risk (next 7 days)</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <span>Landing page copy v2</span>
          <span className={styles.badge}>Due Fri</span>
        </div>
        <div className={styles.item}>
          <span>UTM setup — Meta</span>
          <span className={styles.badge}>Due Sat</span>
        </div>
        <div className={styles.item}>
          <span>Creative variants Q4</span>
          <span className={styles.badge}>Due Mon</span>
        </div>
      </div>
    </div>

    <div className={styles.card}>
      <div className={styles.cardTitle}>Recent Activity</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <span>Rana completed “Audience segments v2”</span>
          <span className={styles.dd}>2h ago</span>
        </div>
        <div className={styles.item}>
          <span>Omar reopened “Pixel events QA”</span>
          <span className={styles.dd}>5h ago</span>
        </div>
        <div className={styles.item}>
          <span>Layla assigned “Blog v3 hero”</span>
          <span className={styles.dd}>Yesterday</span>
        </div>
      </div>
    </div>
  </div>

      <div className={styles.row}>
        <PieMini title="Task Status" data={statusSlices} total={statusTotal} />
        <PieMini title="Completed On Time Vs Overdue" data={cvoSlices} total={completedTotal} />
        <PieMini title="Reopened (of Completed)" data={reopenSlices} total={reopened.completed_tasks}/>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
