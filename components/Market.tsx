"use client";

import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import * as marketActions from "../app/store/slices/marketSlice";
import { FC, ReactNode } from "react";
import { getSeedsFromLibrary } from "../utils/generalUtils";

import type { RootState, AppDispatch } from "../app/store/store";
import type { PlantItem } from "../app/store/slices/warehouseSlice";

function MarketTopPanel() {
  return <div className="w-full">Top Market Panel</div>;
}

interface MarketPositionProps {
  item: PlantItem;
}

const MarketPosition: React.FC<MarketPositionProps> = ({ item }) => {
  return (
    <>
      <div>{item.item_name}</div>
      <div>{item.category}</div>
      <div>{item.growing_time}</div>
      <div>{item.seed_price}</div>
    </>
  );
};

function MarketMainBlock() {
  const dispatch = useDispatch<AppDispatch>();
  const seeds: PlantItem[] = useSelector(
    (state: RootState) => state.market.seeds
  );

  useEffect(() => {
    const fetchSeeds = async () => {
      let value = await getSeedsFromLibrary();
      dispatch(
        marketActions.setSeeds(
          value.message.sort(
            (a: PlantItem, b: PlantItem) => a.item_name > b.item_name
          )
        )
      );
    };
    fetchSeeds();
  }, [dispatch]);

  // FOR CHECK
  /*useEffect(() => {
    console.log("seeds");
    console.log(seeds);
  }, [seeds]);*/
  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-2 p-4 text-sm">
      <div className="pInSectionName border-b pb-1">Name</div>
      <div className="pInSectionName border-b pb-1">Category</div>
      <div className="pInSectionName border-b pb-1">Growing time</div>
      <div className="pInSectionName border-b pb-1">Seed price</div>

      {seeds.map((item: PlantItem) => (
        <MarketPosition key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function Market() {
  const dispatch: AppDispatch = useDispatch();
  return (
    <div className="modalWindow infoSection min-w-4/5 w-4/5 h-4/5 overflow-y-auto">
      <MarketTopPanel />
      <MarketMainBlock />
    </div>
  );
}

/*
<div className="blackWindow text-center text-white">jhkh</div>
*/
