import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export type Position = { id: number; name: string };

type SkillsState = {
  positionsList: Position[];
  filtered: Position[];
  loading: boolean;
  error: string | null;
};

const initialState: SkillsState = {
  positionsList: [],
  filtered: [],
  loading: false,
  error: null,
};

// Fetch skills from API (adjust URL to your backend)
export const fetchPositions = createAsyncThunk<Position[]>(
  "positions/fetchAll",
  async () => {
    const res = await apiCall('/positions', {method:'GET', requiresAuth:true})
    console.log('positions form api', res.data)
    return res.data;
  }
);

const positionsSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    emptyPositions(state) {
      state.positionsList = [];
      state.filtered = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action: PayloadAction<Position[]>) => {
        state.positionsList = action.payload;
        state.filtered = action.payload; 
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load positions";
      });
  },
});

export const { emptyPositions } = positionsSlice.actions;
export default positionsSlice.reducer;

