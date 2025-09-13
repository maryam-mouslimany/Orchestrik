// src/redux/usersSlice.ts
import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type UsersFilters = { roleId?: number; positionId?: number; skills?: number[] };

type UsersState = {
  usersList: any[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  deleting: boolean;
  deleteError: string | null;
  restoring: boolean;
  restoreError: string | null;
};

const initialState: UsersState = {
  usersList: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
  restoring: false,
  restoreError: null,
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
export const createUser = createAsyncThunk<any, Record<string, any>>(
  'users/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiCall('/admin/users', {
        method: 'POST',
        requiresAuth: true,
        data: payload,
      });
      return res.data; // expect the created user object
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create user';
      return rejectWithValue(msg);
    }
  }
);
// DELETE /admin/users/delete  { id }
export const deleteUser = createAsyncThunk<any, number>(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiCall('/admin/users/delete', {
        method: 'POST',
        requiresAuth: true,
        data: { id },
      });
      return { id, data: res.data };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete user';
      return rejectWithValue(msg);
    }
  }
);

// POST /admin/users/restore  { id }
export const restoreUser = createAsyncThunk<any, number>(
  'users/restore',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiCall('/admin/users/restore', {
        method: 'POST',
        requiresAuth: true,
        data: { id },
      });
      return { id, data: res.data };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to restore user';
      return rejectWithValue(msg);
    }
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
      })
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creating = false;
        // Option 1 (recommended): don't mutate usersList here; refetch after create
        // state.lastCreated = action.payload;

        // Option 2 (optimistic append — only if you really want it):
        // if (Array.isArray(state.usersList)) state.usersList.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.createError = (action.payload as string) ?? action.error.message ?? 'Failed to create user';
      })
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleting = false;
        // Recommended: refetch after delete; do not mutate usersList here
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = (action.payload as string) ?? action.error.message ?? 'Failed to delete user';
      })

      // RESTORE
      .addCase(restoreUser.pending, (state) => {
        state.restoring = true;
        state.restoreError = null;
      })
      .addCase(restoreUser.fulfilled, (state) => {
        state.restoring = false;
        // Recommended: refetch after restore; do not mutate usersList here
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.restoring = false;
        state.restoreError = (action.payload as string) ?? action.error.message ?? 'Failed to restore user';
      });

  },
});

export const { emptyUsers } = usersSlice.actions;
export default usersSlice.reducer;

export const selectUsersCreating = (s: any) => s.users.creating;
export const selectUsersCreateErr = (s: any) => s.users.createError;
export const selectUsersRaw = (s: any) => s.users.usersList;
export const selectUsersLoading = (s: any) => s.users.loading;
export const selectUsersError = (s: any) => s.users.error;
export const selectUsersDeleting  = (s: any) => s.users.deleting;
export const selectUsersDeleteErr = (s: any) => s.users.deleteError;
export const selectUsersRestoring = (s: any) => s.users.restoring;
export const selectUsersRestoreErr= (s: any) => s.users.restoreError;

