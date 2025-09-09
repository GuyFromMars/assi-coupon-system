import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch students
export const fetchStudents = createAsyncThunk("students/fetchAll", async () => {
  const res = await fetch("/api/students");
  if (!res.ok) throw new Error("Failed to fetch students");
  return await res.json();
});

export const updateStudentBalance = createAsyncThunk(
  "students/updateBalance",
  async ({ id, amount }) => {
    const res = await fetch("/api/students/update-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount }),
    });

    if (!res.ok) throw new Error("Failed to update balance");
    return await res.json();
  }
);

export const editStudent = createAsyncThunk(
  "students/edit",
  async ({ id, data }) => {
    const res = await fetch("/api/students/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error("Failed to edit student");
    return await res.json();
  }
);


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
      })
      .addCase(updateStudentBalance.fulfilled, (state, action) => {
      const { id, balance } = action.payload;
      const student = state.data.find((s) => s.id === id);
      if (student) {
        student.balance = balance; // update with new balance
      }
      })
      .addCase(editStudent.fulfilled, (state, action) => {
      const idx = state.data.findIndex((s) => s.id === action.payload.id);
      if (idx > -1) {
      state.data[idx] = {
      ...state.data[idx],    // keep existing fields (like balance)
      ...action.payload,     // overwrite only what was updated
      };
      }
      });
  },
});

export default studentsSlice.reducer;
