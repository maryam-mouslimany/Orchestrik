import React from "react";
import styles from "./styles.module.css";
import { useProjectCard } from "./hook";
import type { Project } from "../../../../../routes/loaders/projectsViewLoader";
import Pill from "../../../../../components/Pill";

type Props = { project: Project };

const ProjectCard: React.FC<Props> = ({ project }) => {
  const {
    clientName,
    membersCount,
    total,
    pending,
    completed,
    overdue,
    status,
  } = useProjectCard(project);

  return (
    <div className={styles.card} tabIndex={0}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{project.name}</div>
          <div className={styles.client}>{clientName}</div>
        </div>
        <Pill label={status} />
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
        {/* Replaced emoji with accessible inline SVG icon (no new dependency) */}
        <svg
          className={styles.membersIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M16 11a4 4 0 1 0-3.999-4A4 4 0 0 0 16 11Zm-8 0a4 4 0 1 0-4-4.001A4 4 0 0 0 8 11Zm8 2c-2.67 0-8 1.337-8 4v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.663-5.33-4-8-4Zm-8 0c-.692 0-1.523.074-2.373.223C3.23 13.52 1 14.45 1 16v2a1 1 0 0 0 1 1h6.06a3.63 3.63 0 0 1-.06-.667V16c0-1.03.43-1.948 1.148-2.71C8.53 13.1 8.217 13 8 13Z" />
        </svg>
        View Members ({membersCount})
      </button>
    </div>
  );
};

export default ProjectCard;
