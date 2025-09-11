// lib/store/slices/infoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStudentInfo = createAsyncThunk(
  "info/fetchStudentInfo",
  async (id) => {
    const res = await fetch(`/api/info/${id}`);
    if (!res.ok) throw new Error("Failed to fetch student info");
    return await res.json();
  }
);

export const deleteTransaction = createAsyncThunk(
  "info/deleteTransaction",
  async ({ studentId, transactionId }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/transactions/deleteTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, transactionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete transaction");
      return { transactionId, newBalance: data.newBalance };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const infoSlice = createSlice({
  name: "info",
  initialState: {
    student: null,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.transactions = action.payload.transactions || [];
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        // Remove transaction from state
        state.transactions = state.transactions.filter(
          (tx) => tx.id !== action.payload.transactionId
        );
        // Update balance
        if (state.student) state.student.balance = action.payload.newBalance;
      });
  },
});

export default infoSlice.reducer;
