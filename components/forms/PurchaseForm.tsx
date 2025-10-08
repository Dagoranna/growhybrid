"use client";

import React from "react";
import { useState, useEffect } from "react";
import OpenedFormWrapper from "./OpenedFormWrapper";
import { getPrice, makePurchase } from "../../utils/generalUtils";
import type { RootState, AppDispatch } from "../../app/store/store";
import { useSelector, useDispatch } from "react-redux";

type MyProps = {
  itemName: string;
  itemCount?: number;
  addFormStyle?: Record<string, string>;
  onClose?: () => void;
};

type purchaseProps = {
  userId: number | null;
  itemName: string;
  count: number;
};

export default function PurchaseForm({
  itemName,
  itemCount = 1,
  addFormStyle = {},
  onClose,
}: MyProps) {
  const userId = useSelector((state: RootState) => state.main.userID);
  const [count, setCount] = useState(itemCount);
  const [price, setPrice] = useState(0);
  const [payment, setPayment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resultMessage, setResultMessage] = useState("");
  const [resultState, setResultState] = useState(false);

  async function purchase({ userId, itemName, count }: purchaseProps) {
    try {
      setLoading(true);
      const purchase = await makePurchase(userId, itemName, count);
      //purchase.message, purchase.success
      setResultMessage(purchase.message);
      setResultState(purchase.success);
    } catch {
      console.log("false!");
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
          onClick={async () => await purchase({ userId, itemName, count })}
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
