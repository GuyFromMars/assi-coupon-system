import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "@/lib/store/slices/studentsSlice";
import couponsReducer from "@/lib/store/slices/couponsSlice"
import transactionsReducer from "@/lib/store/slices/transactionsSlice"
import infoReducer from "@/lib/store/slices/infoSlice"

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    coupons: couponsReducer,
    transactions: transactionsReducer,
    info: infoReducer,
  },
});
