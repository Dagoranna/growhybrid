"use client";
import { Suspense, FormEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import FormWrapper from "../../components/forms/FormWrapper";
import FormErrors from "../../components/forms/FormErrors";
import stylesFormWrapper from "../../components/forms/forms.module.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function ResetPasswordPage() {
  const token = useSearchParams().get("token");
  const email = useSearchParams().get("email");

  const [isTokenValid, setIsTokenValid] = useState(0);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [formAuthErrors, setAuthErrors] = useState<Set<string>>(new Set());

  const [actionResult, setActionResult] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  function toggleError(set: Set<string>, condition: boolean, msg: string) {
    condition ? set.add(msg) : set.delete(msg);
  }

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch(`${apiUrl}/api/auth/checkresettoken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            token: token,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsTokenValid(data.tokenState);
        } else {
          console.error("Error in database response:", data);
          setIsTokenValid(-1);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setIsTokenValid(-1);
      }
    }

    if (email && token) {
      checkToken();
    }
  }, []);

  useEffect(() => {
    if (actionResult) {
      const timer = setTimeout(() => {
        window.location.replace("/");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [actionResult]);

  useEffect(() => {
    let errors: Set<string> = new Set();

    toggleError(errors, password.trim() === "", "Password is empty");
    toggleError(
      errors,
      password2.trim() !== password.trim(),
      "Passwords do not match"
    );

    setAuthErrors(errors);
  }, [password, password2]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formAuthErrors.size !== 0) return;

    if (isTokenValid !== 1) {
      console.log("bad token");
      return;
    }

    const response = await fetch(`${apiUrl}/api/auth/resethandling`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callbackUrl: "/",
        email: email,
        password: password,
      }),
    });

    let baseResponse = await response.json();

    if (response.ok) {
      setActionMessage(baseResponse.message);
      setActionResult(baseResponse.resetHandlingState);
    } else {
      setActionMessage("error in database response");
    }
  }

  return (
    <div className="resetPassForm">
      {isTokenValid === 0 && (
        <div className="tableTitle">Checking reset link...</div>
      )}
      {isTokenValid === -1 && (
        <div className="tableTitle">Password reset link is invalid</div>
      )}
      {isTokenValid === 1 && (
        <FormWrapper formName="Enter new password" isFormOpen={true}>
          <form id="resetForm" className="verticalForm" onSubmit={handleSubmit}>
            <div className="tableTitle">Password reset</div>
            <div
              className={
                actionResult
                  ? stylesFormWrapper.actionSuccess
                  : stylesFormWrapper.actionFail
              }
            >
              {actionMessage}
            </div>

            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mainInput"
            />
            <input
              type="password"
              placeholder="confirm password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="mainInput"
            />
            <FormErrors formErrors={formAuthErrors} />
            <button id="resetButton" className="mainButton" type="submit">
              Set new password
            </button>
          </form>
        </FormWrapper>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
