import { store } from '../../redux/store';
import { fetchSkills } from '../../redux/skillsSlice';
import { fetchPositions } from '../../redux/positionsSlice';
import { fetchUsers } from '../../redux/usersSlice';

export async function rootLoader() {
  const state = store.getState();

  const skillsLoaded = state.skills.list.length > 0;
  const skillsLoading = state.skills.loading;

  const usersLoaded = state.users.usersList.length > 0;
  const usersLoading = state.users.loading;

  const positionsLoaded = state.positions.positionsList.length > 0;
  const positionsLoading = state.positions.loading;

  if (!skillsLoaded && !skillsLoading) {
    await store.dispatch(fetchSkills());
  }
   if (!usersLoaded && !usersLoading) {
    await store.dispatch(fetchUsers());
  }
  
  if (!positionsLoaded && !positionsLoading) {
    await store.dispatch(fetchPositions());
  }

  return null;
}
