import type { RootState } from './store';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import apiCall from '../services/apiCallService';

export type UsersFilters = { roleId?: number; positionId?: number; skills?: number[] };

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  positionId?: number | null;
  skills?: Array<{ id: number; name: string }>;
  deleted_at?: string | null;
};

type UsersState = {
  usersList: User[];
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

type Rejected = { rejectValue: string };

export const fetchUsers = createAsyncThunk<User[], UsersFilters | undefined, Rejected>(
  'users/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await apiCall('/users', {
        method: 'GET',
        requiresAuth: true,
        params: { filters: filters ?? {} },
      });
      const data = res.data;
      return Array.isArray(data) ? (data as User[]) : [];
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        (err as Error)?.message ??
        'Failed to load users';
      return rejectWithValue(msg);
    }
  }
);

// POST /auth/users
export const createUser = createAsyncThunk<User, Record<string, unknown>, Rejected>(
  'users/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiCall('/admin/users/create', {
        method: 'POST',
        requiresAuth: true,
        data: payload,
      });
      return res.data as User;
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        (err as Error)?.message ??
        'Failed to create user';
      return rejectWithValue(msg);
    }
  }
);

export const deleteUser = createAsyncThunk<{ id: number; data: unknown }, number, Rejected>(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiCall('/admin/users/delete', {
        method: 'POST',
        requiresAuth: true,
        data: { id },
      });
      return { id, data: res.data as unknown };
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        (err as Error)?.message ??
        'Failed to delete user';
      return rejectWithValue(msg);
    }
  }
);

export const restoreUser = createAsyncThunk<{ id: number; data: unknown }, number, Rejected>(
  'users/restore',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiCall('/admin/users/restore', {
        method: 'POST',
        requiresAuth: true,
        data: { id },
      });
      return { id, data: res.data as unknown };
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ??
        (err as Error)?.message ??
        'Failed to restore user';
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
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.usersList = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to load users';
      })
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.usersList.push(action.payload)
        state.creating = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.createError =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to create user';
      })

      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to delete user';
      })

      .addCase(restoreUser.pending, (state) => {
        state.restoring = true;
        state.restoreError = null;
      })
      .addCase(restoreUser.fulfilled, (state) => {
        state.restoring = false;
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.restoring = false;
        state.restoreError =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to restore user';
      });
  },
});

export const { emptyUsers } = usersSlice.actions;
export default usersSlice.reducer;

export const selectUsersCreating   = (s: RootState) => s.users.creating;
export const selectUsersCreateErr  = (s: RootState) => s.users.createError;
export const selectUsersRaw        = (s: RootState) => s.users.usersList;
export const selectUsersLoading    = (s: RootState) => s.users.loading;
export const selectUsersError      = (s: RootState) => s.users.error;
export const selectUsersDeleting   = (s: RootState) => s.users.deleting;
export const selectUsersDeleteErr  = (s: RootState) => s.users.deleteError;
export const selectUsersRestoring  = (s: RootState) => s.users.restoring;
export const selectUsersRestoreErr = (s: RootState) => s.users.restoreError;
