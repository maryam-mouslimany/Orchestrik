// src/redux/usersSlice.ts
import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type UsersFilters = { roleId?: number; positionId?: number; skills?: number[] };

type UsersState = {
  usersList: any[];            // keep raw API data (no view types here)
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  usersList: [],
  loading: false,
  error: null,
};

// GET /admin/users with filters (optional)
export const fetchUsers = createAsyncThunk<any[], UsersFilters | undefined>(
  'users/fetchAll',
  async (filters) => {
    const res = await apiCall('/admin/users', {
      method: 'GET',
      requiresAuth: true,
      params: { filters: filters ?? {} },
    });
    return Array.isArray(res.data) ? res.data : [];
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    emptyUsers(state) {
      state.usersList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersList = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load users';
      });
  },
});

export const { emptyUsers } = usersSlice.actions;
export default usersSlice.reducer;

// Minimal selectors
export const selectUsersRaw     = (s: any) => s.users.usersList;
export const selectUsersLoading = (s: any) => s.users.loading;
export const selectUsersError   = (s: any) => s.users.error;
