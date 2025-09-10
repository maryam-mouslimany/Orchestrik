import skillsReducer from './skillsSlice';
import positionReducer from './positionsSlice';
import projetReducer from './projectsSlice';
import userReducer from './usersSlice';

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    positions: positionReducer,
    projects: projetReducer,
    users: userReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
