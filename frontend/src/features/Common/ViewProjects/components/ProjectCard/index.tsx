import React from "react";
import styles from "./styles.module.css";
import { useProjectCard } from "./hook";
import type { Project } from "../../../../../routes/loaders/projectsViewLoader";
import Pill from "../../../../../components/Pill";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Props = {
  project: Project;
  onViewMembers: (id: number) => void;
  canOpenAnalytics?: boolean; 
};

const ProjectCard: React.FC<Props> = ({ project, onViewMembers, canOpenAnalytics = false }) => {
  const {
    clientName,
    membersCount,
    total,
    unfinished,
    completed,
    overdue,
    status,
  } = useProjectCard(project);

  const navigate = useNavigate();
  const openAnalytics = () => navigate(`/projects/${project.id}/analytics`);

  const wrapperProps = canOpenAnalytics
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: openAnalytics,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAnalytics();
          }
        },
      }
    : { tabIndex: 0 };

  return (
    <div
      className= {`${styles.card} ${canOpenAnalytics ? styles.clickable : ""}`}
      {...wrapperProps}
    >
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
          <div className={`${styles.statNumber} ${styles.unfinished}`}>{unfinished}</div>
          <div className={styles.statLabel}>Unfinished</div>
        </div>

        <div className={styles.statCol}>
          <div className={`${styles.statNumber} ${styles.overdue}`}>{overdue}</div>
          <div className={styles.statLabel}>Overdue</div>
        </div>

        <div className={styles.statCol}>
          <div className={`${styles.statNumber} ${styles.completed}`}>{completed}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      <button
        className={styles.membersBtn}
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // keep members button separate from card navigation
          onViewMembers(project.id);
        }}
      >
        <FiUsers className={styles.membersIcon} aria-hidden />
        View Members ({membersCount})
      </button>
    </div>
  );
};

export default ProjectCard;
