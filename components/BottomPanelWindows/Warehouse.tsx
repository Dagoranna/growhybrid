"use client";

import React, { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store/store";

import * as actionsWarehouse from "../../app/store/slices/warehouseSlice";
import * as actionsLibrary from "../../app/store/slices/librarySlice";

import { getWarehouse, getSeedInfo } from "../../utils/generalUtils";
import OpenedFormWrapper from "../forms/OpenedFormWrapper";
import type { PlantItem } from "../../app/store/slices/librarySlice";

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

  function SeedsWindow() {
    return (
      <OpenedFormWrapper
        addFormStyle={{
          width: "50%",
          maxWidth: "50%",
          height: "50%",
        }}
        onClose={() => setSeedsOpen(!seedsOpen)}
        pawMini={true}
      >
        <WarehouseMainBlock />
      </OpenedFormWrapper>
    );
  }

  interface WarehousePositionProps {
    item: PlantItem;
  }

  const WarehousePosition: React.FC<WarehousePositionProps> = ({ item }) => {
    return (
      <>
        <div className="text-start pl-3">{item.item_name}</div>
        <div>{item.category}</div>
        <div>{item.growing_time}</div>
        <div>{item.seed_price}</div>
        <div className="text-start pl-3">{item.descr}</div>
        <div>{item.count}</div>
      </>
    );
  };

  function WarehouseMainBlock() {
    const dispatch = useDispatch<AppDispatch>();
    const seeds = useSelector((state: RootState) => state.warehouse.seeds);
    const seedsInfo = useSelector((state: RootState) => state.library.items);

    const [nameSortAsc, setNameSortAsc] = useState(true);
    const [catSortAsc, setCatSortAsc] = useState(true);
    const [timeSortAsc, setTimeSortAsc] = useState(true);
    const [priceSortAsc, setPriceSortAsc] = useState(true);
    const [countSortAsc, setCountSortAsc] = useState(true);
    const [descrSortAsc, setDescrSortAsc] = useState(true);

    const [seedsForTableSorted, setSeedsForTableSorted] = useState<PlantItem[]>(
      []
    );

    const seedsForTable = Object.entries(seeds).map((seed) => {
      const seedInfoFromLib = seedsInfo[seed[0]];
      const newSeed = { count: seed[1], ...seedInfoFromLib };
      return newSeed;
    });
    seedsForTable.sort((a, b) => a.item_name.localeCompare(b.item_name));

    useEffect(() => {
      const arr = Object.entries(seeds).map(([key, count]) => {
        const seedInfoFromLib = seedsInfo[key];
        return { count, ...seedInfoFromLib };
      });
      setSeedsForTableSorted(arr);
    }, [seeds, seedsInfo]);

    function sortTable(
      column_title: keyof PlantItem,
      data_type: "string" | "number",
      indicator: boolean,
      setIndicator: Dispatch<SetStateAction<boolean>>
    ) {
      setIndicator(!indicator);
      setSeedsForTableSorted((prev) => {
        const newArr = [...prev];
        newArr.sort((a, b) => {
          const valA = a[column_title];
          const valB = b[column_title];

          if (data_type === "string") {
            return indicator
              ? (valA as string).localeCompare(valB as string)
              : (valB as string).localeCompare(valA as string);
          } else {
            return indicator
              ? (valA as number) - (valB as number)
              : (valB as number) - (valA as number);
          }
        });
        return newArr;
      });
    }

    return (
      <div className="centralBlackInGlass grid grid-cols-6 auto-rows-min gap-x-4 gap-y-2 p-4 text-center">
        <div className="col-span-6 grid grid-cols-6">
          <div
            onClick={() =>
              sortTable("item_name", "string", nameSortAsc, setNameSortAsc)
            }
            className="infoTitleForTable"
          >
            Name
          </div>
          <div
            onClick={() =>
              sortTable("category", "string", catSortAsc, setCatSortAsc)
            }
            className="infoTitleForTable"
          >
            Category
          </div>
          <div
            onClick={() =>
              sortTable("growing_time", "number", timeSortAsc, setTimeSortAsc)
            }
            className="infoTitleForTable"
          >
            Growing time
          </div>
          <div
            onClick={() =>
              sortTable("seed_price", "number", priceSortAsc, setPriceSortAsc)
            }
            className="infoTitleForTable"
          >
            Seed packet price
          </div>
          <div
            onClick={() =>
              sortTable("descr", "string", descrSortAsc, setDescrSortAsc)
            }
            className="infoTitleForTable"
          >
            Description
          </div>
          <div
            onClick={() =>
              sortTable("count", "number", countSortAsc, setCountSortAsc)
            }
            className="infoTitleForTable"
          >
            Seed packets count
          </div>
        </div>

        {seedsForTableSorted.map((item: PlantItem) => (
          <WarehousePosition key={item.id} item={item} />
        ))}
      </div>
    );
  }

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
        {seedsOpen && <SeedsWindow />}
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
