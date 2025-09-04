"use client";

import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import { FC, ReactNode } from "react";
import { Object3D } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Paw from "./designelems/Paw";
import type { SectionNumbers } from "../app/store/slices/baseSlice";

import type { RootState, AppDispatch } from "../app/store/store";

function SelectedSectionInfo() {
  const activeSection = useSelector(
    (state: RootState) => state.base.activeSection
  );

  return (
    <div className="infoSection">
      <p className="pInSection">
        Selected section:{" "}
        {activeSection === null
          ? "none"
          : activeSection === 0
            ? "Core"
            : `farm section ${activeSection}`}
      </p>
    </div>
  );
}

function StationInfo() {
  const circlesCount = useSelector(
    (state: RootState) => state.base.circlesCount
  );
  const sectionCount = useSelector(
    (state: RootState) => state.base.sectionCount
  );
  const baseName = useSelector((state: RootState) => state.base.baseName);
  const sections_1 = useSelector((state: RootState) => state.base.sections_1);
  return (
    <div className="infoSection">
      <p className="pInSection">Base name: {baseName}</p>
      <p className="pInSection">Circles: {circlesCount}</p>
      <p className="pInSection">Sections built: {sectionCount}</p>
      <p className="pInSection">
        Sections working: {sections_1.map((item) => ` ${item} `)}
      </p>
    </div>
  );
}

export default function BottomPanel() {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="bottomPanel glass self-center">
      <StationInfo />
      <SelectedSectionInfo />
      <Paw width={50} />
    </div>
  );
}
