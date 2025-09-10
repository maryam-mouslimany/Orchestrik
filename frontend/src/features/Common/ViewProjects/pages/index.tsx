import React from "react";
import { useLoaderData } from "react-router-dom";
import type { Project } from "../../../../routes/loaders/projectsViewLoader";
import ProjectCard from "../components/ProjectCard";
import styles from "./styles.module.css";

const ViewProjects: React.FC = () => {
  const projects = useLoaderData() as Project[];

  return (
    <div className={styles.grid}>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
};

export default ViewProjects;
