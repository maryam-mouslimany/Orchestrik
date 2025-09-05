import { store } from '../../redux/store';
import { fetchSkills } from '../../redux/skillsSlice';

export async function rootLoader() {
  const state = store.getState();

  const alreadyLoaded = state.skills.list.length > 0;
  const loading = state.skills.loading;

  if (!alreadyLoaded && !loading) {
    await store.dispatch(fetchSkills());
  }

  // We don't need to return data; Redux holds it.
  return null;
}
