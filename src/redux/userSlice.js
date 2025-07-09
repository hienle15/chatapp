import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    OtherUsers: null,
    selectedUser: null,
    onLineUsers: []
  },
  reducers: {
    setAuthUsers: (state, action) => {
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.OtherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnLineUsers: (state, action) => {
      state.onLineUsers = action.payload;
    },
    logout: (state) => {
      state.authUser = null;
      state.OtherUsers = null;
      state.selectedUser = null;
      state.onLineUsers = [];
    }
  }
});

export const { setAuthUsers, setOtherUsers, setSelectedUser, setOnLineUsers, logout } = userSlice.actions;
export default userSlice.reducer;
