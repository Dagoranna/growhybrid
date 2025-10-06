import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../actions";

interface MyWarehouseState {
  money: number;
  loading: boolean;
}

const initialState: MyWarehouseState = {
  money: 0,
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
