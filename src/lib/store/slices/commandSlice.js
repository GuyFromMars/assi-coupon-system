import { createSlice } from '@reduxjs/toolkit';

const commandSlice = createSlice({
  name: 'command',
  initialState: {
    transcript: '',
    response: '',
  },
  reducers: {
    setCommand: (state, action) => {
      state.transcript = action.payload.transcript;
      state.response = action.payload.response;
    },
  },
});

export const { setCommand } = commandSlice.actions;
export default commandSlice.reducer;