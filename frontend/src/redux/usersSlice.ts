import apiCall from '../services/apiCallService';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export type User = { id: number; name: string };

type UsersState = {
  usersList: User[];
  filtered: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  usersList: [],
  filtered: [],
  loading: false,
  error: null,
};

// Fetch users from API
export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchAll',
  async () => {
    const res = await apiCall('/admin/users', { method: 'GET', requiresAuth: true });
    console.log('users from api', res.data);
    return res.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    emptyUsers(state) {
      state.usersList = [];
      state.filtered = [];
      state.error = null;
      state.loading = false;
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
        state.filtered = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load users';
      });
  },
});

export const { emptyUsers } = usersSlice.actions;
export default usersSlice.reducer;
