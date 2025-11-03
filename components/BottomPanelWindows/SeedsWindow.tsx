"use client";

import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store/store";
import type { PlantItem } from "../../app/store/slices/librarySlice";

import OpenedFormWrapper from "../forms/OpenedFormWrapper";
import VerticalArrows from "../forms/VerticalArrows";

interface WarehousePositionProps {
  item: PlantItem;
  isPlantButton: boolean;
}

const WarehousePosition: React.FC<WarehousePositionProps> = ({
  item,
  isPlantButton,
}) => {
  return (
    <>
      <div className="text-start pl-3">{item.item_name}</div>
      <div>{item.category}</div>
      <div>{item.growing_time}</div>
      <div>{item.seed_price}</div>
      <div className="text-start pl-3">{item.descr}</div>
      <div>{item.count}</div>
      {isPlantButton && (
        <div>
          <button className="buttonMini">Plant!</button>
        </div>
      )}
    </>
  );
};

export function WarehouseMainBlock({
  isPlantButton,
}: {
  isPlantButton: boolean;
}) {
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
    const newSeed = { count: seed[1], ...seedInfoFromLib } as PlantItem;
    return newSeed;
  });
  seedsForTable.sort((a, b) => a.item_name.localeCompare(b.item_name));

  useEffect(() => {
    const arr = Object.entries(seeds).map(([key, count]) => {
      const seedInfoFromLib = seedsInfo[key];
      return { count, ...seedInfoFromLib } as PlantItem;
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
        const valA = a[column_title] as unknown as string | number;
        const valB = b[column_title] as unknown as string | number;

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
    <div
      className={`centralBlackInGlass grid auto-rows-min gap-x-4 gap-y-2 p-4 text-center ${
        isPlantButton ? "grid-cols-7" : "grid-cols-6"
      }

          `}
    >
      <div
        onClick={() =>
          sortTable("item_name", "string", nameSortAsc, setNameSortAsc)
        }
        className="infoTitleForTable"
      >
        <span style={{ whiteSpace: "nowrap" }}>
          Name <VerticalArrows />
        </span>
      </div>
      <div
        onClick={() =>
          sortTable("category", "string", catSortAsc, setCatSortAsc)
        }
        className="infoTitleForTable"
      >
        <span style={{ whiteSpace: "nowrap" }}>
          Category <VerticalArrows />
        </span>
      </div>
      <div
        onClick={() =>
          sortTable("growing_time", "number", timeSortAsc, setTimeSortAsc)
        }
        className="infoTitleForTable"
      >
        Growing{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          time <VerticalArrows />
        </span>
      </div>
      <div
        onClick={() =>
          sortTable("seed_price", "number", priceSortAsc, setPriceSortAsc)
        }
        className="infoTitleForTable"
      >
        Seed packet{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          price <VerticalArrows />
        </span>
      </div>
      <div
        onClick={() =>
          sortTable("descr", "string", descrSortAsc, setDescrSortAsc)
        }
        className="infoTitleForTable"
      >
        <span style={{ whiteSpace: "nowrap" }}>
          Description <VerticalArrows />
        </span>
      </div>
      <div
        onClick={() =>
          sortTable("count", "number", countSortAsc, setCountSortAsc)
        }
        className="infoTitleForTable"
      >
        Seed packets{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          count <VerticalArrows />
        </span>
      </div>
      {isPlantButton && <div></div>}
      {seedsForTableSorted.map((item: PlantItem) => (
        <WarehousePosition
          key={item.id}
          item={item}
          isPlantButton={isPlantButton}
        />
      ))}
    </div>
  );
}

/*
<div className="col-span-6 grid grid-cols-6 leading-none">
        <div
          onClick={() =>
            sortTable("item_name", "string", nameSortAsc, setNameSortAsc)
          }
          className="infoTitleForTable"
        >
          <span style={{ whiteSpace: "nowrap" }}>
            Name <VerticalArrows />
          </span>
        </div>
        <div
          onClick={() =>
            sortTable("category", "string", catSortAsc, setCatSortAsc)
          }
          className="infoTitleForTable"
        >
          <span style={{ whiteSpace: "nowrap" }}>
            Category <VerticalArrows />
          </span>
        </div>
        <div
          onClick={() =>
            sortTable("growing_time", "number", timeSortAsc, setTimeSortAsc)
          }
          className="infoTitleForTable"
        >
          Growing{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            time <VerticalArrows />
          </span>
        </div>
        <div
          onClick={() =>
            sortTable("seed_price", "number", priceSortAsc, setPriceSortAsc)
          }
          className="infoTitleForTable"
        >
          Seed packet{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            price <VerticalArrows />
          </span>
        </div>
        <div
          onClick={() =>
            sortTable("descr", "string", descrSortAsc, setDescrSortAsc)
          }
          className="infoTitleForTable"
        >
          <span style={{ whiteSpace: "nowrap" }}>
            Description <VerticalArrows />
          </span>
        </div>
        <div
          onClick={() =>
            sortTable("count", "number", countSortAsc, setCountSortAsc)
          }
          className="infoTitleForTable"
        >
          Seed packets{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            count <VerticalArrows />
          </span>
        </div>
      </div>
*/

export interface SeedsWindowProps {
  funcClose: (varClose: boolean) => void;
  varClose: boolean;
  isPlantButton?: boolean;
}

export default function SeedsWindow({
  funcClose,
  varClose,
  isPlantButton = false,
}: SeedsWindowProps) {
  return (
    <OpenedFormWrapper
      addFormStyle={{
        minWidth: "50%",
        width: "95%",
        height: "50%",
      }}
      onClose={() => funcClose(!varClose)}
      pawMini={true}
    >
      <WarehouseMainBlock isPlantButton={isPlantButton} />
    </OpenedFormWrapper>
  );
}
