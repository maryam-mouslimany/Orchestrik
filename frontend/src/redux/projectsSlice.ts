// src/redux/projectsSlice.ts
import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export type Project = { id: number; name: string };

type ProjectsState = {
  projectsList: Project[];
  filtered: Project[];
  loading: boolean;
  error: string | null;
};

const initialState: ProjectsState = {
  projectsList: [],
  filtered: [],
  loading: false,
  error: null,
};

// Fetch projects from API
export const fetchProjects = createAsyncThunk<Project[]>(
  'projects/fetchAll',
  async () => {
    const res = await apiCall('/projects', { method: 'GET', requiresAuth: true });
    console.log('projects from api', res.data);
    return res.data;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    emptyProjects(state) {
      state.projectsList = [];
      state.filtered = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.projectsList = action.payload;
        state.filtered = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load projects';
      });
  },
});

export const { emptyProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
