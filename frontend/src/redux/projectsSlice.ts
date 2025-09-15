import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type ProjectsState = {
  projectsList: any[];      
  loading: boolean;
  error: string | null;
};

const initialState: ProjectsState = {
  projectsList: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk<any[]>(
  'projects/fetchAll',
  async () => {
    const res = await apiCall('/projects', { method: 'GET', requiresAuth: true });
        console.log('projects API raw response', res); // ⬅️ check this

    return Array.isArray(res.data) ? res.data : [];
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    emptyProjects(state) {
      state.projectsList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectsList = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load projects';
      });
  },
});

export const { emptyProjects } = projectsSlice.actions;
export default projectsSlice.reducer;

// selectors (minimal)
export const selectProjectsList   = (s: any) => s.projects.projectsList;
export const selectProjectsLoad   = (s: any) => s.projects.loading;
export const selectProjectsError  = (s: any) => s.projects.error;
