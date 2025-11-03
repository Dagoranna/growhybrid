"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SeedsWindow from "./SeedsWindow";

import type { RootState, AppDispatch } from "../../app/store/store";

export default function SelectedSectionInfo() {
  const activeSection = useSelector(
    (state: RootState) => state.base.activeSection
  );
  const [showWarehouseWindow, setShowWarehouse] = useState(false);
  function openWarehouse() {
    setShowWarehouse(true);
  }

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
      <div>
        <button className="infoLinkButton" onClick={() => openWarehouse()}>
          Plant seeds
        </button>
      </div>
      {showWarehouseWindow && (
        <SeedsWindow
          funcClose={setShowWarehouse}
          varClose={showWarehouseWindow}
          isPlantButton={true}
        />
      )}
    </div>
  );
}
