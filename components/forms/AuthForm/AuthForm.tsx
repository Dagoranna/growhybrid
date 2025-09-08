"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store/store";
import * as actions from "../../../app/store/slices/mainSlice";
import FormErrors from "../FormErrors";
import stylesFormWrapper from "../forms.module.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AuthForm() {
  const dispatch: AppDispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [userName, setUserName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formMode, setFormMode] = useState<
    "Login" | "Register" | "Reset password"
  >("Login");
  const [formAuthErrors, setFormAuthErrors] = useState<Set<string>>(new Set());
  const [actionResult, setActionResult] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  function toggleError(set: Set<string>, condition: boolean, msg: string) {
    condition ? set.add(msg) : set.delete(msg);
  }

  useEffect(() => {
    setFormAuthErrors(new Set());
    setActionMessage("");
    setEmail("");
    setPassword("");
    setPassword2("");
    setRememberMe(false);
  }, [formMode]);

  useEffect(() => {
    let errors: Set<string> = new Set();

    //email checks
    toggleError(errors, email.trim() === "", "Email is empty");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    toggleError(
      errors,
      !emailRegex.test(email) && email.trim() !== "",
      "Invalid email"
    );

    if (formMode !== "Reset password") {
      //password checks
      toggleError(errors, password.trim() === "", "Password is empty");
    }

    //second password checks
    if (formMode === "Register") {
      toggleError(
        errors,
        password2.trim() !== password.trim(),
        "Passwords do not match"
      );
    }

    setFormAuthErrors(errors);
  }, [email, password, password2, formMode]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formAuthErrors.size !== 0) return;

    switch (formMode) {
      //let response = await fetch("/api/auth/login", {
      //`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      case "Login": {
        console.log("login");
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
        /* let response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callbackUrl: "/",
            email: email,
            password: password,
            rememberMe: rememberMe,
          }),
        });*/
        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callbackUrl: "/",
            email,
            password,
            rememberMe,
          }),
        });

        let baseResponse = await response.json();

        if (response.ok) {
          dispatch(actions.setLoginState(baseResponse.loginState));
          setActionMessage(baseResponse.message);
          if (baseResponse.loginState === true) {
            dispatch(actions.setUserEmail(email));
            dispatch(actions.setUserName(baseResponse.name));
          }
          setActionResult(baseResponse.loginState);
        } else {
          setActionMessage("error in database response");
        }

        break;
      }
      case "Register": {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              callbackUrl: "/",
              name: userName,
              email: email,
              password: password,
            }),
          }
        );

        const baseResponse = await response.json();

        if (response.status === 200 || response.status === 409) {
          setActionMessage(baseResponse.message);
          setActionResult(baseResponse.registerState);
        } else {
          setActionMessage("error in database response");
        }

        break;
      }
      case "Reset password": {
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/resetpass`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              callbackUrl: "/",
              email: email,
            }),
          }
        );

        let baseResponse = await response.json();

        if (response.ok) {
          setActionMessage(baseResponse.message);
          setActionResult(baseResponse.resetPassState);
        } else {
          setActionMessage("error in database response");
          console.log(response);
        }

        break;
      }
      default:
        console.log("some trash in formMode: " + formMode);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="authInputFields">
        <div className="tableTitle">{formMode}</div>
        <div
          className={
            actionResult
              ? stylesFormWrapper.actionSuccess
              : stylesFormWrapper.actionFail
          }
        >
          {actionMessage}
        </div>
        {formMode === "Register" && (
          <input
            type="text"
            placeholder="nickname"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {formMode !== "Reset password" && (
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {formMode === "Register" && (
          <input
            type="password"
            placeholder="confirm password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        )}
        {formMode === "Login" && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
          </div>
        )}

        <FormErrors formErrors={formAuthErrors} />

        <button id="authButton" className="mainButton" type="submit">
          {formMode}
        </button>
      </div>
      <div className="verticalForm">
        {formMode !== "Login" && (
          <div
            id="goToLogin"
            onClick={() => setFormMode("Login")}
            className="switcher"
          >
            Go to login
          </div>
        )}
        {formMode !== "Reset password" && (
          <div
            id="goToReset"
            onClick={() => setFormMode("Reset password")}
            className="switcher"
          >
            Go to reset password
          </div>
        )}
        {formMode !== "Register" && (
          <div
            id="goToRegister"
            onClick={() => setFormMode("Register")}
            className="switcher"
          >
            Go to registration
          </div>
        )}
      </div>
    </form>
  );
}
