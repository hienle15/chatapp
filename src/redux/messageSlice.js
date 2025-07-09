import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    resetMessages: (state) => {
      state.messages = null; // hoặc [] nếu bạn dùng mảng
    },
  },
});

export const { setMessages, resetMessages } = messageSlice.actions;
export default messageSlice.reducer;
