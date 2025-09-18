import { useViewProjects } from "./hook";
import ProjectCard from "../components/ProjectCard";
import SearchBar from "../../../../components/SearchBar";
import LoadingIndicator from "../../../../components/Loading";
import styles from "./styles.module.css";
import ViewProjectMembersModal from "../components/ViewProjectMembersModal";
import CreateButton from "../../../../components/CreateButton/Button";

const ViewProjects = () => {
  const {
    projects, loading, error,
    membersOpen, selectedProjectId, openMembers, closeMembers,nameInput, setNameInput, applyNameFilter
  } = useViewProjects();

  if (loading) return <LoadingIndicator fullscreen />;

  return (
    <>
      {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

      <div style={{ marginBottom: 12 }}>
        <SearchBar
          placeholder="Search by name…"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          applyOnEnter
          onApply={applyNameFilter}
        />
        <CreateButton to="/projects/create" />
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
