import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch students
export const fetchStudents = createAsyncThunk("students/fetchAll", async () => {
  const res = await fetch("/api/allstudents");
  if (!res.ok) throw new Error("Failed to fetch students");
  return await res.json();
});

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentsSlice.reducer;
