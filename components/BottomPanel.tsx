"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PurchaseForm from "./forms/PurchaseForm";
import Paw from "./designelems/Paw";
import Warehouse from "./BottomPanelWindows/Warehouse";

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
