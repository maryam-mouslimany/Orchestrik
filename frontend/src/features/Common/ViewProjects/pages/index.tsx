import { useViewProjects } from "./hook";
import ProjectCard from "../components/ProjectCard";
import SearchBar from "../../../../components/SearchBar";
import LoadingIndicator from "../../../../components/Loading";
import styles from "./styles.module.css";
import ViewProjectMembersModal from "../components/ViewProjectMembersModal";
import CreateButton from "../../../../components/CreateButton/Button";
import { useAuth } from "../../../../contexts/AuthContext";

const ViewProjects = () => {

  const { user } = useAuth();
  const role = (user?.role?.name ?? user?.role ?? "");
  const isAdmin = role === "admin";
  const isPM = role === "pm";
  const canOpenAnalytics = isAdmin || isPM;

  const {
    projects, loading, error,
    membersOpen, selectedProjectId, openMembers, closeMembers, nameInput, setNameInput, applyNameFilter
  } = useViewProjects();

  if (loading) return <LoadingIndicator fullscreen />;

  return (
    <>
      {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

      <div className={styles.filterRow}>
        <div className={styles.filterSearch}>
          <SearchBar
            placeholder="Search by name…"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            applyOnEnter
            onApply={applyNameFilter}
          />
        </div>
        {isAdmin && <CreateButton to="/projects/create" />}
      </div>

      <div className={styles.grid}>
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onViewMembers={(id) => openMembers(id)}
            canOpenAnalytics={canOpenAnalytics}     

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
