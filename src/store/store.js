import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import medicalRecordsReducer from "./slices/medicalRecordsSlice";
import userReducer from "./slices/userSlice";

/**
 * Configure and create the Redux store with all reducers
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    medicalRecords: medicalRecordsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/login/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.headers"],
        ignoredPaths: [],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
