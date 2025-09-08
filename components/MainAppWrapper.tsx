"use client";

import { useState, useEffect } from "react";
import TopPanel from "./TopPanel";
import MainBlock from "./MainBlock";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import type { RootState } from "../app/store/store";

type MyProps = {
  children: React.ReactNode;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function MainAppWrapper({ children }: MyProps) {
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.main.userEmail);
  const userName = useSelector((state: RootState) => state.main.userName);
  const loginState = useSelector((state: RootState) => state.main.loginState);

  useEffect(() => {
    console.log("my url");
    console.log(`${apiUrl}/auth/checkauthtoken`);
    async function checkAuthToken() {
      let response = await fetch(`${apiUrl}/auth/checkauthtoken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let baseResponse = await response.json();

      if (response.ok) {
        if (baseResponse.tokenState === 1) {
          dispatch(actions.setLoginState(true));
          dispatch(actions.setUserEmail(baseResponse.email));
          dispatch(actions.setUserName(baseResponse.name));
        } else {
          console.log("error!");
          console.log(baseResponse.message);
        }
      } else {
        console.log("error!");
        console.log(baseResponse);
      }
    }

    checkAuthToken();
  }, []);

  return (
    <>
      <TopPanel />
      <MainBlock />
    </>
  );
}
