import { useProjectsSearch } from "./hook";
import ProjectCard from "../components/ProjectCard";
import SearchBar from "../../../../components/SearchBar";
import styles from "./styles.module.css";

const ViewProjects = () => {
  const { nameFilter, setNameFilter, projects, loading, error } = useProjectsSearch();

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <SearchBar
          placeholder="Search by name…"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}
      {loading && <div style={{ marginBottom: 8 }}>Loading…</div>}

      <div className={styles.grid}>
        {projects.map((p: any) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </>
  );
};

export default ViewProjects;
