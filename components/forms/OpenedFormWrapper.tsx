"use client";

import React from "react";
import { useState } from "react";
import styles from "./forms.module.css";
import Paw from "../designelems/Paw";

type MyProps = {
  formName?: string;
  children: React.ReactNode;
  addFormStyle?: Record<string, string>;
};

export default function OpenedFormWrapper({
  children,
  addFormStyle = {},
}: MyProps) {
  const [isClosed, setIsClosed] = useState(false);

  return (
    <>
      {!isClosed && (
        <div
          className={`${styles.baseTable} glass`}
          style={{ ...addFormStyle }}
        >
          <button
            className={styles.closeButton}
            onClick={() => setIsClosed(true)}
          >
            &#x2716;
          </button>
          {children}
          <Paw width={40} />
        </div>
      )}
    </>
  );
}
