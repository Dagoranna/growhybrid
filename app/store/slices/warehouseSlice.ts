import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../actions";

type ItemType = "construction" | "plant";
type ItemCategory = "flower" | "herb";

export interface PlantItem {
  item_name: string;
  item_type: ItemType;

  id?: number;
  created_at: Date;
  item_count?: number;
  price?: number;
  seed_price?: number;
  growing_time?: number;
  category?: ItemCategory;
  properties?: Record<string, string>;
  descr?: string;
  color?: string;
  size?: number;
}

interface MyWarehouseState {
  money: number;
  seeds: Record<string, PlantItem>;
  crops: Record<string, PlantItem>;
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
    addSeed: (
      state,
      action: PayloadAction<{ name: string; count: number; descr: PlantItem }>
    ) => {
      const { name: seedName, count: seedCount, descr } = action.payload;
      const existingSeed = state.seeds[seedName];
      const updatedSeed: PlantItem = {
        ...(existingSeed || {}),
        ...descr,
        item_name: seedName,
        item_count: (existingSeed?.item_count || 0) + seedCount,
      };

      state.seeds = {
        ...state.seeds,
        [seedName]: updatedSeed,
      };
    },
    subtractSeed: (
      state,
      action: PayloadAction<{ name: string; count: number }>
    ) => {
      const { name: seedName, count: seedCount } = action.payload;
      const existingSeed = state.seeds[seedName];

      if (!existingSeed || existingSeed.item_count === undefined) {
        console.warn(`Seed "${seedName}" not found in warehouse`);
        return;
      }

      if (existingSeed.item_count < seedCount) {
        console.warn(
          `Not enough "${seedName}" seeds. Have ${existingSeed.item_count}, need ${seedCount}.`
        );
        return;
      }

      existingSeed.item_count = existingSeed.item_count - seedCount;

      if (existingSeed.item_count === 0) {
        delete state.seeds[seedName];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setMoney, changeMoney, addSeed, subtractSeed } =
  warehouseSlice.actions;

export default warehouseSlice.reducer;
