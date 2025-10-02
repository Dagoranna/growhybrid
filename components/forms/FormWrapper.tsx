"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./forms.module.css";
import Paw from "../designelems/Paw";
import { createPortal } from "react-dom";

type MyProps = {
  formName: string;
  children: React.ReactNode;
  isFormOpen?: boolean;
  addButtonStyle?: Record<string, string>;
  addFormStyle?: Record<string, string>;
  addOnClose?: ((...args: any[]) => void) | null;
  addButtonFunc?: ((...args: any[]) => void) | null;
  pawMini?: boolean;
};

export default function FormWrapper({
  formName,
  children,
  isFormOpen = false,
  addButtonStyle = {},
  addFormStyle = {},
  addOnClose = null,
  addButtonFunc = null,
  pawMini = false,
}: MyProps) {
  const [isOpen, setIsOpen] = useState(isFormOpen);
  const modalRef = useRef<HTMLDivElement | null>(null);

  let buttonId = formName.replace(/\s+/g, "") + "Button";
  let closeId = formName.replace(/\s+/g, "") + "FormClose";

  function onClose() {
    if (addOnClose) addOnClose();
    setIsOpen(false);
    console.log("closing");
  }

  function onOpen() {
    setIsOpen(true);
    if (addButtonFunc) addButtonFunc();
  }

  return (
    <>
      {!isOpen && (
        <button
          id={buttonId}
          className="mainButton"
          onClick={() => onOpen()}
          style={{ ...addButtonStyle }}
        >
          {formName}
        </button>
      )}
      {isOpen &&
        createPortal(
          <div
            ref={modalRef}
            className={`modalWindow glass`}
            style={{ ...addFormStyle }}
          >
            <Paw width={pawMini ? 30 : 60} />
            <button
              id={closeId}
              className={styles.closeButton}
              onClick={() => onClose()}
              style={{ zIndex: "1010" }}
            >
              &#x2716;
            </button>
            {children}
          </div>,
          document.body
        )}
    </>
  );
}
