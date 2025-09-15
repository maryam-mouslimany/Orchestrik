// projectsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiCall from '../services/apiCallService';

type ProjectsState = {
  projectsList: any[];
  loading: boolean;
  error: string | null;
  loaded: boolean;         
};

const initialState: ProjectsState = {
  projectsList: [],
  loading: false,
  error: null,
  loaded: false,
};

type Rejected = { rejectValue: string };

export const fetchProjects = createAsyncThunk<any[], void, Rejected>(
  'projects/fetchAll',
  async (_arg, { rejectWithValue }) => {
    try {
      const res = await apiCall('/projects', { method: 'GET', requiresAuth: true });
      const raw = res?.data;
      const list =
        Array.isArray(raw) ? raw :
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw?.projects) ? raw.projects :
        [];

      return list;
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        (err as Error)?.message ??
        'Failed to load projects';
      return rejectWithValue(msg);
    }
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
      state.loaded = false;   // so a future screen can refetch on purpose
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        // do not flip loaded yet; wait for result
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectsList = action.payload;
        state.loading = false;
        state.loaded = true;   // ✅ even if empty, we tried
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to load projects';
        state.loaded = true;   // ✅ important: prevents infinite re-dispatch on errors
      });
  },
});

export const { emptyProjects } = projectsSlice.actions;
export default projectsSlice.reducer;

// selectors
export const selectProjectsList  = (s: any) => s.projects.projectsList;
export const selectProjectsLoad  = (s: any) => s.projects.loading;
export const selectProjectsErr   = (s: any) => s.projects.error;
export const selectProjectsLoaded = (s: any) => s.projects.loaded;  // ✅
