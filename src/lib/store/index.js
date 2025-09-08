import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "@/lib/store/slices/studentsSlice";

export const store = configureStore({
  reducer: {
    students: studentsReducer,
  },
});
