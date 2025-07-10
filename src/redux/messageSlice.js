import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    resetMessages: (state) => {
      state.messages = []; // ✅ an toàn
      state.error = null;
    },
    addMessage: (state, action) => {
      const newMsg = action.payload;

      // Tìm optimistic message tương ứng (nếu có)
      const optimisticIndex = state.messages.findIndex(msg =>
          msg.isOptimistic &&
          msg.senderId === newMsg.senderId &&
          msg.receiverId === newMsg.receiverId &&
          msg.message === newMsg.message
          // Có thể so sánh thêm về thời gian nếu cần
      );

      if (optimisticIndex !== -1) {
          // Thay thế optimistic message bằng message thật từ server
          state.messages[optimisticIndex] = { ...newMsg };
      } else {
          // Nếu message mới, thêm vào cuối
          const exists = state.messages.some(msg =>
              (msg._id && msg._id === newMsg._id) ||
              (msg.id && msg.id === newMsg.id && msg.timestamp === newMsg.timestamp)
          );
          if (!exists) {
              state.messages.push(newMsg);
          }
      }
    },
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates };
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setMessages, 
  resetMessages, 
  addMessage, 
  updateMessage, 
  removeMessage,
  setLoading,
  setError 
} = messageSlice.actions;
export default messageSlice.reducer;
