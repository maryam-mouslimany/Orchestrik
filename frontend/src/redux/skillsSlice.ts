import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export type Skill = { id: number; name: string };

type SkillsState = {
  list: Skill[];
  filtered: Skill[];
  loading: boolean;
  error: string | null;
};

const initialState: SkillsState = {
  list: [],
  filtered: [],
  loading: false,
  error: null,
};

// Fetch skills from API (adjust URL to your backend)
export const fetchSkills = createAsyncThunk<Skill[]>(
  "skills/fetchAll",
  async () => {
    const res = await apiCall('/skills', { method: 'GET', requiresAuth: true })
    console.log('roles form api', res.data)
    return res.data;
  }
);

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    emptySkills(state) {
      state.list = [];
      state.filtered = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action: PayloadAction<Skill[]>) => {
        state.list = action.payload;
        state.filtered = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load skills";
      });
  },
});

export const { emptySkills } = skillsSlice.actions;
export default skillsSlice.reducer;

