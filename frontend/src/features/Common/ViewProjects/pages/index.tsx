import { useViewProjects } from "./hook";
import ProjectCard from "../components/ProjectCard";
import SearchBar from "../../../../components/SearchBar";
import LoadingIndicator from "../../../../components/Loading";
import styles from "./styles.module.css";
import ViewProjectMembersModal from "../components/ViewProjectMembersModal"; // keep this path

const ViewProjects = () => {
  const {
    nameFilter, setNameFilter, projects, loading, error,
    membersOpen, selectedProjectId, openMembers, closeMembers,
  } = useViewProjects();

  if (loading) return <LoadingIndicator fullscreen />;

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
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onViewMembers={(id) => openMembers(id)}
          />
        ))}
      </div>

      <ViewProjectMembersModal
        projectId={selectedProjectId}
        open={membersOpen}
        onClose={closeMembers}
      />
    </>
  );
};

export default ViewProjects;
