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
      <h2 className={styles.heading}>Project Analytics</h2>
      <div className={styles.row}>
        <PieMini title="Task Status" data={statusSlices} total={statusTotal} />
        <PieMini title="Completed On Time vs Overdue" data={cvoSlices} total={completedTotal} />
        <PieMini title="Reopened (of Completed)" data={reopenSlices} total={reopened.completed_tasks}/>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
