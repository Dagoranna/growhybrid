"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import * as actionsWarehouse from "../app/store/slices/warehouseSlice";
import { FC, ReactNode } from "react";
import { Object3D } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import OpenedFormWrapper from "./forms/OpenedFormWrapper";
import PurchaseForm from "./forms/PurchaseForm";
import Paw from "./designelems/Paw";
import { getPrice, getMoney } from "../utils/generalUtils";

import type { RootState, AppDispatch } from "../app/store/store";

function SelectedSectionInfo() {
  const activeSection = useSelector(
    (state: RootState) => state.base.activeSection
  );

  return (
    <div className="infoSection">
      <p className="pInSection infoTitle">Section info</p>
      <p className="pInSection">
        <span className="pInSectionName">Selected section: </span>
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
  const baseName = useSelector((state: RootState) => state.base.baseName);
  const sections = useSelector((state: RootState) => state.base.sections);

  return (
    <div className="infoSection">
      <p className="pInSection infoTitle">Base info</p>
      <p className="pInSection">
        <span className="pInSectionName">Base name:</span> {baseName}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Circles:</span>{" "}
        {!sections || sections.length < 1
          ? 0
          : !sections || sections.length < 9
            ? 1
            : 2}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Sections built:</span>{" "}
        {sections ? sections.map((item) => ` ${item} `) : ""}
      </p>
    </div>
  );
}

function StationControl() {
  const [showDataWindow, setShowDataWindow] = useState(false);

  function buildSection() {
    setShowDataWindow(true);
  }

  const money = useSelector((state: RootState) => state.warehouse.money);

  return (
    <>
      <div className="infoSection">
        <p className="pInSection infoTitle">Base Control</p>
        <button className="infoLinkButton" onClick={() => buildSection()}>
          Build new section
        </button>
      </div>
      {showDataWindow && (
        <PurchaseForm
          itemName="Section"
          itemType="construction"
          onClose={() => setShowDataWindow(false)}
        />
      )}
    </>
  );
}

function Warehouse() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.main.userID);
  const money = useSelector((state: RootState) => state.warehouse.money);

  useEffect(() => {
    if (!userId) return;

    const fetchMoney = async () => {
      const value = await getMoney(userId);
      dispatch(actionsWarehouse.setMoney(value));
    };

    fetchMoney();
  }, [dispatch, userId]);

  return (
    <div className="infoSection">
      <p className="pInSection infoTitle">Warehouse</p>
      <p className="pInSection">
        <span className="pInSectionName">Credits:</span> {money}
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
      <StationControl />
      <Warehouse />
      <Paw width={50} />
    </div>
  );
}
