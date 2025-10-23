import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../actions";

type SectionJSON = Record<string, number[]>;

interface MyBaseState {
  loading: boolean;
  baseName: string | null;
  activeSection: number | null;
  sections: number[] | null;
}

const initialState: MyBaseState = {
  loading: false,
  baseName: null,
  activeSection: null,
  sections: null,
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
    setSections: (state, action: PayloadAction<number[]>) => {
      state.sections = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setBaseName, setActiveSection, setSections, setLoading } =
  baseSlice.actions;

export default baseSlice.reducer;
