"use client";

import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import { FC, ReactNode } from "react";
import { Object3D } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Paw from "./designelems/Paw";

import type { RootState, AppDispatch } from "../app/store/store";

type Coords = [number, number, number];

export default function BottomPanel() {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="bottomPanel glass self-center">
      <SelectedSectionInfo />
      <Paw width={50} />
    </div>
  );
}

function SelectedSectionInfo() {
  const activeSection = useSelector(
    (state: RootState) => state.base.activeSection
  );
  return (
    <div className="infoSection">
      <p>Selected section: {activeSection !== null ? activeSection : "none"}</p>
    </div>
  );
}
