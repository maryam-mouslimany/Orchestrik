import { store } from '../../redux/store';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchPositions } from '../../redux/positionsSlice';
import { fetchProjects } from '../../redux/projectsSlice';

export async function rootLoader() {
  const state = store.getState();

  const skillsLoaded = state.skills.list.length > 0;
  const skillsLoading = state.skills.loading;

  if (!skillsLoaded && !skillsLoading) {
    await store.dispatch(fetchSkills());
  }

  const positionsLoaded = state.positions.positionsList.length > 0;
  const positionsLoading = state.positions.loading;

  if (!positionsLoaded && !positionsLoading) {
    await store.dispatch(fetchPositions());
  }

  const projectsLoaded = state.projects.projectsList.length > 0;
  const projectsLoading = state.projects.loading;

  if (!projectsLoaded && !projectsLoading) {
    await store.dispatch(fetchProjects());
  }
  return null;
}
