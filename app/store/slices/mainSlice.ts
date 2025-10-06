import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../actions";

type ScreenType = "home" | "base" | "farmModule" | "orbit" | "market";

interface MyMainState {
  loginState: boolean;
  userEmail: string;
  userName: string;
  userID: number | null;
  screen: ScreenType;
}

const initialState: MyMainState = {
  loginState: false,
  userEmail: "",
  userName: "",
  userID: null,
  screen: "home",
};

const mainSlice = createSlice({
  name: "mainState",
  initialState,
  reducers: {
    setLoginState: (state, action: PayloadAction<boolean>) => {
      state.loginState = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserID: (state, action: PayloadAction<number>) => {
      state.userID = action.payload;
    },
    setScreen: (state, action: PayloadAction<ScreenType>) => {
      state.screen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setLoginState,
  setUserEmail,
  setUserName,
  setUserID,
  setScreen,
} = mainSlice.actions;

export default mainSlice.reducer;
