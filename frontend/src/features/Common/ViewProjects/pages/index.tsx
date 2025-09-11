// src/features/Projects/pages/view/index.tsx
import { useProjectsSearch } from "./hook"; // your hook
import ProjectCard from "../components/ProjectCard";
import SearchBar from "../../../../components/SearchBar";
import LoadingIndicator from "../../../../components/Loading";
import styles from "./styles.module.css";

const ViewProjects = () => {
  const { nameFilter, setNameFilter, projects, loading, error } = useProjectsSearch();

  if (loading) {
    return <LoadingIndicator fullscreen />;
  }

  return (
    <>
      {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

      <div style={{ marginBottom: 12 }}>
        <SearchBar
          placeholder="Search by name…"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {projects.map((p: any) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </>
  );
};

export default ViewProjects;
