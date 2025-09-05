import { configureStore } from '@reduxjs/toolkit';
import skillsReducer from './skillsSlice';

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
