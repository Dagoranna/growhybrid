import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./slices/mainSlice";
import baseReducer from "./slices/baseSlice";
import warehouseReducer from "./slices/warehouseSlice";
import marketReducer from "./slices/marketSlice";
import libraryReducer from "./slices/librarySlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
    base: baseReducer,
    warehouse: warehouseReducer,
    market: marketReducer,
    library: libraryReducer,
  },
});

// `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
