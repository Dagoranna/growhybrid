"use client";

import React from "react";
import styles from "./TopPanel.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import FormWrapper from "./forms/FormWrapper";
import AuthForm from "./forms/AuthForm/AuthForm";

import type { RootState, AppDispatch } from "../app/store/store";

export default function TopPanel() {
  const dispatch: AppDispatch = useDispatch();

  const loginState = useSelector((state: RootState) => state.main.loginState);
  const userEmail = useSelector((state: RootState) => state.main.userEmail);
  const userName = useSelector((state: RootState) => state.main.userName);

  async function handleLogout() {
    let response = await fetch("/api/auth/deleteauthtoken", {
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
        dispatch(actions.setLoginState(false));
        dispatch(actions.setUserEmail(""));
        dispatch(actions.setUserName(""));
      } else {
        console.log(baseResponse.message);
      }
    } else {
      console.log(baseResponse);
    }
  }

  return (
    <div className={styles.topPanel}>
      {!loginState && (
        <FormWrapper formName="Login/Register">
          <AuthForm />
        </FormWrapper>
      )}

      {loginState && (
        <button
          className="mainButton"
          onClick={async () => await handleLogout()}
        >
          Logout
        </button>
      )}

      {loginState && (
        <div>
          Hello,{" "}
          <span style={{ fontWeight: "bold", color: "gold" }}>{userName}</span>!
        </div>
      )}
    </div>
  );
}
