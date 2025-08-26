import { configureStore } from '@reduxjs/toolkit';
import commandReducer from './slices/commandSlice';

export const store = configureStore({
  reducer: {
    command: commandReducer,
  },
});