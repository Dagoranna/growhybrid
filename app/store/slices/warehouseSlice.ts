import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../actions";

export interface plantItems {
  number: number;
  cost: number;
  [key: string]: unknown;
}

interface MyWarehouseState {
  money: number;
  seeds: Record<string, plantItems>;
  crops: Record<string, plantItems>;
  loading: boolean;
}

const initialState: MyWarehouseState = {
  money: 0,
  seeds: {},
  crops: {},
  loading: false,
};

const warehouseSlice = createSlice({
  name: "warehouseState",
  initialState,
  reducers: {
    setMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload;
    },
    changeMoney: (state, action: PayloadAction<number>) => {
      state.money = state.money + action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setMoney, changeMoney } = warehouseSlice.actions;

export default warehouseSlice.reducer;
