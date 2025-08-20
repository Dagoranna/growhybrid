import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ScreenType = "home" | "base" | "farmModule" | "orbit" | "market";

interface MyMainState {
  loginState: boolean;
  userEmail: string;
  userName: string;
  screen: ScreenType;
}

const initialState: MyMainState = {
  loginState: false,
  userEmail: "",
  userName: "",
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
    setScreen: (state, action: PayloadAction<ScreenType>) => {
      state.screen = action.payload;
    },
  },
});

export const { setLoginState, setUserEmail, setUserName, setScreen } =
  mainSlice.actions;

export default mainSlice.reducer;
