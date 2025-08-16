import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyMainState {
  loginState: boolean;
  userEmail: string;
  userName: string;
}

const initialState: MyMainState = {
  loginState: false,
  userEmail: "",
  userName: "",
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
  },
});

export const { setLoginState, setUserEmail, setUserName } = mainSlice.actions;

export default mainSlice.reducer;
