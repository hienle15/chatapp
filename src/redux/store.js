import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js"
import messageReducer from "./messageSlice.js"
import socketReducer from "./socketSlice.js"
const store = configureStore({
    reducer: {
        user: userReducer,
        message: messageReducer,
        socket: socketReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // ✅ rất quan trọng!
        }),
});
export default store;