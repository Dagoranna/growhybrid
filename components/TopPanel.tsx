"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import FormWrapper from "./forms/FormWrapper";
import AuthForm from "./forms/AuthForm/AuthForm";
import { logout } from "../app/store/actions";

import type { RootState, AppDispatch } from "../app/store/store";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function TopPanel() {
  const dispatch: AppDispatch = useDispatch();

  const loginState = useSelector((state: RootState) => state.main.loginState);
  const userEmail = useSelector((state: RootState) => state.main.userEmail);
  const userName = useSelector((state: RootState) => state.main.userName);
  const screen = useSelector((state: RootState) => state.main.screen);

  async function handleLogout() {
    dispatch(actions.setScreen("home"));
    const response = await fetch(`${apiUrl}/api/auth/deleteauthtoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
      }),
    });

    let baseResponse = await response.json();

    if (response.ok) {
      if (baseResponse.logoutState === 1) {
        dispatch(logout());
      } else {
        console.log(baseResponse.message);
      }
    } else {
      console.log(baseResponse);
    }
  }

  return (
    <div className="topPanel">
      {!loginState && (
        <FormWrapper
          formName="Login/Register"
          addButtonStyle={{ order: "1", marginLeft: "auto" }}
          addFormStyle={{ order: "1", right: "5px" }}
        >
          <AuthForm />
        </FormWrapper>
      )}

      {loginState && (
        <div style={{ order: "1", marginLeft: "auto" }}>
          Hello,{" "}
          <span style={{ fontWeight: "bold", color: "gold" }}>{userName}</span>!
        </div>
      )}

      <button
        className={screen === "home" ? "mainButton activeButton" : `mainButton`}
        onClick={() => dispatch(actions.setScreen("home"))}
      >
        Home
      </button>

      <button
        className={
          screen === "orbit" ? "mainButton activeButton" : `mainButton`
        }
        onClick={() => dispatch(actions.setScreen("orbit"))}
      >
        Orbit
      </button>

      {loginState && (
        <button
          className={
            screen === "base" ? "mainButton activeButton" : `mainButton`
          }
          onClick={() => dispatch(actions.setScreen("base"))}
        >
          Your Base
        </button>
      )}

      {loginState && (
        <button
          className={
            screen === "market" ? "mainButton activeButton" : `mainButton`
          }
          onClick={() => dispatch(actions.setScreen("market"))}
        >
          Market Base
        </button>
      )}

      {loginState && (
        <button
          className="mainButton"
          style={{ order: "1", marginLeft: "auto" }}
          onClick={async () => await handleLogout()}
        >
          Logout
        </button>
      )}
    </div>
  );
}
