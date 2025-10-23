"use client";

import React from "react";
import { useState, useEffect } from "react";
import OpenedFormWrapper from "./OpenedFormWrapper";
import {
  getPrice,
  getMoney,
  buyItem,
  buyConstruction,
  getSeedsFromLibrary,
} from "../../utils/generalUtils";
import type { RootState, AppDispatch } from "../../app/store/store";
import { useSelector, useDispatch } from "react-redux";
import * as baseActions from "../../app/store/slices/baseSlice";
import * as warehouseActions from "../../app/store/slices/warehouseSlice";

type ItemType = "seed" | "crop" | "construction";

type MyProps = {
  itemName: string;
  itemType: ItemType;
  itemCount?: number;
  addFormStyle?: Record<string, string>;
  onClose?: () => void;
};

type purchaseProps = {
  userId: number | null;
  itemType: ItemType;
  itemName: string;
  count: number;
};

export default function PurchaseForm({
  itemName,
  itemType,
  itemCount = 1,
  addFormStyle = {},
  onClose,
}: MyProps) {
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.main.userID);
  const money = useSelector((state: RootState) => state.warehouse.money);
  const sections = useSelector((state: RootState) => state.base.sections);
  const [count, setCount] = useState(itemCount);
  const [price, setPrice] = useState(0);
  const [payment, setPayment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resultMessage, setResultMessage] = useState("");
  const [resultState, setResultState] = useState(false);

  async function purchase({
    userId,
    itemName,
    itemType,
    count,
  }: purchaseProps) {
    if (money < payment) {
      setResultMessage("not enough money");
      setResultState(false);
      return;
    }

    if (itemName == "Section") {
      const sectionsCount = sections ? sections.length : 0;
      if (sectionsCount + count > 16) {
        setResultMessage("you can't have more than 16 sections");
        setResultState(false);
        return;
      }
    }

    try {
      setLoading(true);
      let purchase;
      itemType === "construction"
        ? (purchase = await buyConstruction(userId, itemName, count, payment))
        : (purchase = await buyItem(userId, itemName, count, payment));

      setResultMessage(purchase.message);
      setResultState(purchase.success);
      dispatch(baseActions.setSections(purchase.newArray));
      dispatch(warehouseActions.changeMoney(-payment));

      //name: string; count: number; descr: PlantItem
      if (itemType === "seed") {
        dispatch(
          warehouseActions.addSeed({
            name: itemName,
            count: count,
            descr: purchase.item,
          })
        );
      }
    } catch {
      setResultMessage("fail to purchase");
      setResultState(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function updatePrice() {
      const price = await getPrice(itemName);
      if (price !== null && !isNaN(Number(price))) {
        setPrice(price);
      }
    }
    updatePrice();
    setLoading(false);
  }, []);

  useEffect(() => {
    setPayment(count * price);
  }, [price, count]);

  return (
    <OpenedFormWrapper
      addFormStyle={addFormStyle}
      onClose={onClose}
      pawMini={true}
    >
      <div className="flex flex-col m-2">
        <div className="flex m-1">
          <div className="infoTitle">Item:</div>
          <div className="pInSectionName flex-grow text-center">{itemName}</div>
        </div>
        <div className="flex m-1">
          <div className="infoTitle">Count:</div>
          <input
            type="number"
            value={count}
            min={1}
            className="w-20 min-w-3 flex-shrink"
            onChange={(e) => setCount(Number(e.target.value))}
            onBlur={() => {
              if (count < 1) setCount(1);
            }}
          ></input>
        </div>
        <div className="flex m-1">
          <div className="infoTitle">Price:</div>
          <div className="pInSectionName flex-grow text-center">{payment}</div>
        </div>

        <button
          className={`buttonMini m-1 ${loading ? "invisible" : "visible"}`}
          onClick={async () =>
            await purchase({ userId, itemName, itemType, count })
          }
        >
          Buy
        </button>

        <div className="flex m-1">
          <div
            className={`infoTitle flex-grow text-center ${resultState ? "formReactionSuccess" : "formReactionFail"}`}
          >
            {resultMessage}
          </div>
        </div>
      </div>
    </OpenedFormWrapper>
  );
}
