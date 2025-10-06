"use client";

import { useState, useEffect } from "react";
import TopPanel from "./TopPanel";
import MainBlock from "./MainBlock";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";

type MyProps = {
  children: React.ReactNode;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function MainAppWrapper({ children }: MyProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkAuthToken() {
      const response = await fetch(`${apiUrl}/api/auth/checkauthtoken`, {
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
          dispatch(actions.setUserID(baseResponse.userID));
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
