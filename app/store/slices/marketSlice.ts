import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { PlantItem } from "./warehouseSlice";
import { supabase } from "../../../utils/supabase";
import { apiUrl } from "../../../utils/generalUtils";

interface MyMarketState {
  seeds: PlantItem[];
  crops: PlantItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MyMarketState = {
  seeds: [],
  crops: [],
  loading: false,
  error: null,
};

const marketSlice = createSlice({
  name: "marketState",
  initialState,
  reducers: {
    setSeeds: (state, action: PayloadAction<PlantItem[]>) => {
      state.seeds = action.payload;
    },
  },
});

export const { setSeeds } = marketSlice.actions;

export default marketSlice.reducer;
