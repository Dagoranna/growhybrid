import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../actions";

export interface MyWarehouseState {
  money: number;
  seeds: Record<string, number>;
  crops: Record<string, number>;
  loading?: boolean;
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
    setWarehouse: (state, action: PayloadAction<MyWarehouseState>) => {
      return action.payload;
    },
    setMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload;
    },
    changeMoney: (state, action: PayloadAction<number>) => {
      state.money = state.money + action.payload;
    },

    addSeed: (
      state,
      action: PayloadAction<{ name: string; count: number }>
    ) => {
      const { name, count } = action.payload;
      state.seeds[name] = (state.seeds[name] || 0) + count;
    },
    subtractSeed: (
      state,
      action: PayloadAction<{ name: string; count: number }>
    ) => {
      const { name, count } = action.payload;
      state.seeds[name] = (state.seeds[name] || 0) - count;
    },
    sortSeeds: (state, action: PayloadAction<{ sortBy: "name" | "price" }>) => {
      const { sortBy } = action.payload;
      const seedsEntries = Object.entries(state.seeds);

      if (sortBy === "name") {
        seedsEntries.sort(([a], [b]) => a.localeCompare(b));
      } else if (sortBy === "price") {
        seedsEntries.sort(([, a], [, b]) => a - b);
      }

      const sortedSeeds: Record<string, number> = {};
      seedsEntries.forEach(([key, value]) => {
        sortedSeeds[key] = value;
      });

      state.seeds = sortedSeeds;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setWarehouse,
  setMoney,
  changeMoney,
  addSeed,
  subtractSeed,
  sortSeeds,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;

/*    addSeed: (
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
    },*/
