import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
    },
    resetMessages: (state) => {
      state.messages = []; // ✅ an toàn
    },
  },
});

export const { setMessages, resetMessages } = messageSlice.actions;
export default messageSlice.reducer;
