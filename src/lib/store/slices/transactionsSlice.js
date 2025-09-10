import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Search students by coupon
export const searchStudentsByCoupon = createAsyncThunk(
  "transactions/searchStudentsByCoupon",
  async (couponCode, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/transactions?coupon=${couponCode}`);
      if (!res.ok) throw new Error("Failed to search students");
      const data = await res.json();

      // Expect backend to return coupon info including amount
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

// Perform transactions on selected students
export const performTransactions = createAsyncThunk(
  "transactions/performTransactions",
  async ({ students, coupon }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students, coupon }),
      });
      if (!res.ok) throw new Error("Failed to perform transactions");
      return await res.json(); // expect success: true
    } catch (err) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    students: [],
    loading: false,
    error: null,
    selectedCoupon: null,
    submitting: false,
  },
  reducers: {
    setSelectedCoupon: (state, action) => {
      state.selectedCoupon = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search students
      .addCase(searchStudentsByCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStudentsByCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // backend should return { students: [...], coupon: { amount, code } }
        state.students = action.payload.students || [];
        state.selectedCoupon = action.payload.coupon || state.selectedCoupon;
      })
      .addCase(searchStudentsByCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Perform transactions
      .addCase(performTransactions.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(performTransactions.fulfilled, (state, action) => {
        state.submitting = false;

        // Update students in the state based on selected students and coupon amount
        const { students: updatedStudents, coupon } = action.meta.arg;

        state.students = state.students.map((student) => {
          const updated = updatedStudents.find((s) => s.id === student.id);
          if (updated) {
            const newTimes = (student.times || 0) + 1; // increment times today
            const newBalance = (student.balance || 0) - (coupon?.amount || 0);
            return { ...student, times: newTimes, balance: newBalance };
          }
          return student;
        });
      })
      .addCase(performTransactions.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCoupon } = transactionsSlice.actions;
export default transactionsSlice.reducer;
