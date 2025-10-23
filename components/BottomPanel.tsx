"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import * as actionsWarehouse from "../app/store/slices/warehouseSlice";
import * as actionsLibrary from "../app/store/slices/librarySlice";
import { FC, ReactNode } from "react";
import { Object3D } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import OpenedFormWrapper from "./forms/OpenedFormWrapper";
import PurchaseForm from "./forms/PurchaseForm";
import Paw from "./designelems/Paw";
import {
  getPrice,
  getMoney,
  getWarehouse,
  getSeedInfo,
} from "../utils/generalUtils";

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
  const seeds = useSelector((state: RootState) => state.warehouse.seeds);
  const crops = useSelector((state: RootState) => state.warehouse.crops);
  const library = useSelector((state: RootState) => state.library.items);

  useEffect(() => {
    if (!userId) return;

    const fetchWarehouse = async () => {
      const value = await getWarehouse(userId);
      dispatch(actionsWarehouse.setWarehouse(value));
    };

    fetchWarehouse();
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchSeed = async () => {
      for (const seed of Object.keys(seeds)) {
        if (!library[seed]) {
          const newSeed = await getSeedInfo(seed);
          dispatch(actionsLibrary.setItem({ name: seed, item: newSeed }));
        }
      }
    };
    fetchSeed();
  }, [seeds, dispatch]);

  const seedsInfo = JSON.stringify(seeds).slice(1, -1);
  const lib = useSelector((state: RootState) => state.library.items);
  return (
    <div className="infoSection">
      <p className="pInSection infoTitle">Warehouse</p>
      <p className="pInSection">
        <span className="pInSectionName">Credits:</span> {money}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Seeds:</span> {seedsInfo}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Crops:</span> {Object.keys(crops)}
      </p>
      <p className="pInSection">{JSON.stringify(lib)}</p>
    </div>
  );
}

export default function BottomPanel() {
  const dispatch: AppDispatch = useDispatch();
  const screen = useSelector((state: RootState) => state.main.screen);

  return (
    <div className="bottomPanel glass self-center">
      {screen === "base" && (
        <>
          {" "}
          <StationInfo />
          <SelectedSectionInfo />
          <StationControl />
        </>
      )}

      <Warehouse />
      <Paw width={50} />
    </div>
  );
}
