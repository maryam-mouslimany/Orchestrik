import skillsReducer from './skillsSlice';
import positionReducer from './positionsSlice';

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    positions: positionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
