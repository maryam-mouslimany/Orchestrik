// src/routes/rootLoader.ts
import { store } from '../../redux/store';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchPositions } from '../../redux/positionsSlice';
import { fetchProjects } from '../../redux/projectsSlice';
import { fetchUsers } from '../../redux/usersSlice';

export async function rootLoader() {
  const s = store.getState();
  const jobs: Array<Promise<any>> = [];

  if (!s.skills.list.length && !s.skills.loading)           jobs.push(store.dispatch(fetchSkills()));
  if (!s.positions.positionsList.length && !s.positions.loading) jobs.push(store.dispatch(fetchPositions()));
  if (!s.projects.projectsList.length && !s.projects.loading)     jobs.push(store.dispatch(fetchProjects()));
  if (!s.users.usersList.length && !s.users.loading)              jobs.push(store.dispatch(fetchUsers()));

  if (jobs.length) {
    await Promise.allSettled(jobs); // parallel; do not block serially
  }
  return null;
}
