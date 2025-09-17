import type { Project } from "../../../../../routes/loaders/projectsViewLoader";

export const useProjectCard = (project: Project) => {
  const clientName = project.client?.name ?? "—";
  const membersCount = project.members?.length ?? 0;
  const status = project.status;

  const badge =
    project.status ??
    ((project.overdue ?? 0) > 0 ? "Delayed" : "On Track");

  const total = project.total ?? 0;
  const unfinished = project.unfinished ?? 0;
  const completed = project.completed ?? 0;
  const overdue = project.overdue ?? 0;

  return {
    clientName,
    membersCount,
    badge,
    total,
    unfinished,
    completed,
    overdue,
    status
  };
};
