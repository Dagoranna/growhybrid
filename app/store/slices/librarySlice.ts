import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export interface MyLibraryState {
  items: Record<string, PlantItem>;
}

const initialState: MyLibraryState = {
  items: {},
};

const librarySlice = createSlice({
  name: "libraryState",
  initialState,
  reducers: {
    setItem: (
      state,
      action: PayloadAction<{ name: string; item: PlantItem }>
    ) => {
      const { name, item } = action.payload;
      state.items[name] = item;
    },
  },
});

export const { setItem } = librarySlice.actions;

export default librarySlice.reducer;
