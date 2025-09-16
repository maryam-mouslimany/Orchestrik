import React from 'react';
import { useProjectAnalytics } from './hook';
import styles from './styles.module.css';
import ProjectTaskStatusesChart from '../components/ProjectTaskStatusesChart';
import LoadingComponent from '../../../../components/Loading'; // you said to use this

const ProjectAnalytics: React.FC = () => {
  const { loading, total, data } = useProjectAnalytics();

  if (loading) return <LoadingComponent fullscreen />;

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Project Analytics</h2>
      <div className={styles.grid}>
        <ProjectTaskStatusesChart title="Task Status Breakdown" total={total} data={data} />
      </div>
    </div>
  );
};

export default ProjectAnalytics;
