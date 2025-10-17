"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store/store";

import Orbit from "./Orbit";
import Base from "./Base";
import Home from "./Home";
import BottomPanel from "./BottomPanel";
import Market from "./Market";

export default function MainBlock() {
  const screen = useSelector((state: RootState) => state.main.screen);

  return (
    <div className="mainBlock">
      {screen === "home" && <Home />}
      {screen === "orbit" && <Orbit />}
      {screen === "base" && (
        <>
          <Base />
          <BottomPanel />
        </>
      )}
      {screen === "market" && <Market />}
    </div>
  );
}
