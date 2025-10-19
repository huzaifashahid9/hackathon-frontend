import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import reportReducer from "./slices/reportSlice";
import vitalsReducer from "./slices/vitalsSlice";
import familyMemberReducer from "./slices/familyMemberSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    vitals: vitalsReducer,
    familyMembers: familyMemberReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
