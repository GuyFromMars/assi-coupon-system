import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "@/lib/store/slices/studentsSlice";
import couponsReducer from "@/lib/store/slices/couponsSlice"

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    coupons: couponsReducer,
  },
});
