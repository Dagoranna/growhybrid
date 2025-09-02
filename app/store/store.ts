import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./slices/mainSlice";
import baseReducer from "./slices/baseSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
    base: baseReducer,
  },
});

// `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
