import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../actions";

type SectionJSON = Record<string, number[]>;

interface MyBaseState {
  baseName: string | null;
  activeSection: number | null;
  circlesCount: number;
  sectionCount: number;
  sections_1: number[];
  sections_2: number[];
  sections_3: number[];
}

const initialState: MyBaseState = {
  baseName: null,
  activeSection: null,
  circlesCount: 0,
  sectionCount: 0,
  sections_1: [],
  sections_2: [],
  sections_3: [],
};

const baseSlice = createSlice({
  name: "baseState",
  initialState,
  reducers: {
    setBaseName: (state, action: PayloadAction<string>) => {
      state.baseName = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<number | null>) => {
      state.activeSection = action.payload;
    },
    setCirclesCount: (state, action: PayloadAction<number>) => {
      state.circlesCount = action.payload;
    },
    setSectionCount: (state, action: PayloadAction<number>) => {
      state.sectionCount = action.payload;
    },
    setSections_1: (state, action: PayloadAction<number[]>) => {
      state.sections_1 = action.payload;
    },
    setSections_2: (state, action: PayloadAction<number[]>) => {
      state.sections_2 = action.payload;
    },
    setSections_3: (state, action: PayloadAction<number[]>) => {
      state.sections_3 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setBaseName,
  setActiveSection,
  setCirclesCount,
  setSectionCount,
  setSections_1,
  setSections_2,
  setSections_3,
} = baseSlice.actions;

export default baseSlice.reducer;
