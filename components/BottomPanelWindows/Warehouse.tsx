"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store/store";

import * as actionsWarehouse from "../../app/store/slices/warehouseSlice";
import * as actionsLibrary from "../../app/store/slices/librarySlice";

import { getWarehouse, getSeedInfo } from "../../utils/generalUtils";
import SeedsWindow from "./SeedsWindow";

export default function Warehouse() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.main.userID);
  const money = useSelector((state: RootState) => state.warehouse.money);
  const seeds = useSelector((state: RootState) => state.warehouse.seeds);
  const crops = useSelector((state: RootState) => state.warehouse.crops);
  const library = useSelector((state: RootState) => state.library.items);

  const [seedsOpen, setSeedsOpen] = useState(false);

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

  return (
    <div className="infoSection">
      <p className="pInSection infoTitle">Warehouse</p>
      <p className="pInSection">
        <span className="pInSectionName">Credits:</span> {money}
      </p>
      <p className="pInSection text-center underline cursor-pointer">
        <span
          className="pInSectionName"
          onClick={() => setSeedsOpen(!seedsOpen)}
        >
          Seeds
        </span>
        {seedsOpen && (
          <SeedsWindow funcClose={setSeedsOpen} varClose={seedsOpen} />
        )}
      </p>
      <p className="pInSection">
        <span className="pInSectionName">Crops:</span> {Object.keys(crops)}
      </p>
    </div>
  );
}

/*
<p className="pInSection">{JSON.stringify(lib)}</p>

{"Iris":
  {
    "id":3,"created_at":"2025-10-12T06:05:14.251437+00:00",
    "item_name":"Iris",
    "item_type":"plant",
    "price":20,
    "descr":"Medium violet flower",
    "properties":null,
    "seed_price":10,
    "growing_time":30,
    "category":"flower",
    "color":"violet",
    "size":30
  },
  "Daisy":
    {
      "id":2,
      "created_at":"2025-10-12T06:03:12.737053+00:00",
      "item_name":"Daisy",
      "item_type":"plant",
      "price":20,"descr":"Small white flower",
      "properties":null,
      "seed_price":10,
      "growing_time":30,
      "category":"flower",
      "color":"white",
      "size":15
    }
*/
