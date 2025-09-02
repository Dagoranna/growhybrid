import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SectionNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type SectionJSON = Record<string, SectionNumbers[]>;

interface MyBaseState {
  activeSection: SectionNumbers | null;
  circlesCount: number;
  sectionCount: number;
  sections: SectionJSON;
}

const initialState: MyBaseState = {
  activeSection: null,
  circlesCount: 1,
  sectionCount: 2,
  sections: { "1": [1, 2, 5, 6] },
};

const baseSlice = createSlice({
  name: "baseState",
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<SectionNumbers | null>) => {
      state.activeSection = action.payload;
    },
    setCirclesCount: (state, action: PayloadAction<number>) => {
      state.circlesCount = action.payload;
    },
    setSectionCount: (state, action: PayloadAction<number>) => {
      state.sectionCount = action.payload;
    },
    setSections: (state, action: PayloadAction<SectionJSON>) => {
      state.sections = action.payload;
    },
  },
});

export const {
  setActiveSection,
  setCirclesCount,
  setSectionCount,
  setSections,
} = baseSlice.actions;

export default baseSlice.reducer;
