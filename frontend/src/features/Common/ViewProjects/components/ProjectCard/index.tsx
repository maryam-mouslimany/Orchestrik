import React from "react";
import styles from "./styles.module.css"; // placeholder; create later
import { useProjectCard } from "./hook";
import type { Project } from "../../../../../routes/loaders/projectsViewLoader";
import Pill from "../../../../../components/Pill";

type Props = { project: Project };

const ProjectCard: React.FC<Props> = ({ project }) => {
  const {
    clientName,
    membersCount,
    badge,
    total,
    pending,
    completed,
    overdue,
    status,
  } = useProjectCard(project);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{project.name}</div>
          <div className={styles.client}>{clientName}</div>
        </div>
        <Pill label={status}/>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCol}>
          <div className={styles.statNumber}>{total}</div>
          <div className={styles.statLabel}>Total Tasks</div>
        </div>

        <div className={styles.statCol}>
          <div className={`${styles.statNumber} ${styles.pending}`}>{pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>

        <div className={styles.statCol}>
          <div className={styles.statNumber}>{overdue}</div>
          <div className={styles.statLabel}>Overdue</div>
        </div>

        <div className={styles.statCol}>
          <div className={`${styles.statNumber} ${styles.completed}`}>{completed}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      <button className={styles.membersBtn} type="button" disabled>
        <span className={styles.membersIcon} aria-hidden>👥</span>
        View Members ({membersCount})
      </button>
    </div>
  );
};

export default ProjectCard;
