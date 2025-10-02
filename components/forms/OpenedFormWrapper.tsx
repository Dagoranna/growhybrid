"use client";

import React from "react";
import { useState } from "react";
import styles from "./forms.module.css";
import Paw from "../designelems/Paw";
import { createPortal } from "react-dom";

type MyProps = {
  formName?: string;
  children: React.ReactNode;
  addFormStyle?: Record<string, string>;
  onClose?: () => void;
  pawMini?: boolean;
};

export default function OpenedFormWrapper({
  children,
  addFormStyle = {},
  onClose,
  pawMini = false,
}: MyProps) {
  return createPortal(
    <div className={`glass modalWindow`} style={{ ...addFormStyle }}>
      <Paw width={pawMini ? 30 : 60} />
      <button className={styles.closeButton} onClick={() => onClose?.()}>
        &#x2716;
      </button>
      {children}
    </div>,
    document.body
  );
}
