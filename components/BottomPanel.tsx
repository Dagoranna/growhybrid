"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import * as actionsWarehouse from "../app/store/slices/warehouseSlice";
import { FC, ReactNode } from "react";
import { Object3D } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import OpenedFormWrapper from "./forms/OpenedFormWrapper";
import Paw from "./designelems/Paw";

import type { RootState, AppDispatch } from "../app/store/store";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  const circlesCount = useSelector(
    (state: RootState) => state.base.circlesCount
  );
  const sectionCount = useSelector(
    (state: RootState) => state.base.sectionCount
  );
  const baseName = useSelector((state: RootState) => state.base.baseName);
  const sections_1 = useSelector((state: RootState) => state.base.sections_1);
  const sections_2 = useSelector((state: RootState) => state.base.sections_2);
  return (
    <div className="infoSection">
      <p className="pInSection infoTitle">Base info</p>
      <p className="pInSection">
        <span className="pInSectionName">Base name:</span> {baseName}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Circles:</span> {circlesCount}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Sections built:</span> {sectionCount}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Sections working:</span>{" "}
        {sections_1 ? sections_1.map((item) => ` ${item} `) : ""}
        {sections_2 ? sections_2.map((item) => ` ${item} `) : ""}
      </p>
    </div>
  );
}

function StationControl() {
  const [showDataWindow, setShowDataWindow] = useState(false);

  function buildSection() {
    setShowDataWindow(true);
  }

  return (
    <>
      <div className="infoSection">
        <p className="pInSection infoTitle">Base Control</p>
        <button className="infoLinkButton" onClick={() => buildSection()}>
          Build new section
        </button>
      </div>
      {showDataWindow && (
        <OpenedFormWrapper
          formName="Build new section"
          onClose={() => setShowDataWindow(false)}
          pawMini={true}
        >
          <div style={{ color: "white" }}>Really? Really?</div>
          <button
            className="buttonMini"
            onClick={() => setShowDataWindow(false)}
          >
            Yes
          </button>
        </OpenedFormWrapper>
      )}
    </>
  );
}

function Warehouse() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.main.userID);
  const money = useSelector((state: RootState) => state.warehouse.money);

  async function getMoney() {
    const response = await fetch(`${apiUrl}/api/base/getMoney`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: userId }),
    });

    const baseResponse = await response.json();
    dispatch(actionsWarehouse.setMoney(baseResponse.message));
  }

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        await getMoney();
      };
      fetchData();
    }
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
