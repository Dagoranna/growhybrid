import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../actions";

export type SectionNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type SectionJSON = Record<string, SectionNumbers[]>;

interface MyBaseState {
  baseName: string | null;
  activeSection: SectionNumbers | null;
  circlesCount: number;
  sectionCount: number;
  sections_1: SectionNumbers[];
  sections_2: SectionNumbers[];
  sections_3: SectionNumbers[];
}

const initialState: MyBaseState = {
  baseName: null,
  activeSection: null,
  circlesCount: 1,
  sectionCount: 4,
  sections_1: [1, 2, 5, 6],
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
    setActiveSection: (state, action: PayloadAction<SectionNumbers | null>) => {
      state.activeSection = action.payload;
    },
    setCirclesCount: (state, action: PayloadAction<number>) => {
      state.circlesCount = action.payload;
    },
    setSectionCount: (state, action: PayloadAction<number>) => {
      state.sectionCount = action.payload;
    },
    setSections_1: (state, action: PayloadAction<SectionNumbers[]>) => {
      state.sections_1 = action.payload;
    },
    setSections_2: (state, action: PayloadAction<SectionNumbers[]>) => {
      state.sections_2 = action.payload;
    },
    setSections_3: (state, action: PayloadAction<SectionNumbers[]>) => {
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
