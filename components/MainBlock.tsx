"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../app/store/slices/mainSlice";
import type { RootState, AppDispatch } from "../app/store/store";

import Orbit from "./Orbit";
import Base from "./Base";
import BottomPanel from "./BottomPanel";

export default function MainBlock() {
  const dispatch: AppDispatch = useDispatch();

  const loginState = useSelector((state: RootState) => state.main.loginState);
  const userEmail = useSelector((state: RootState) => state.main.userEmail);
  const userName = useSelector((state: RootState) => state.main.userName);
  const screen = useSelector((state: RootState) => state.main.screen);

  return (
    <div className="mainBlock">
      {screen === "home" && (
        <div className="centerPaper glass self-end">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
          ea voluptate velit esse quam nihil molestiae consequatur, vel illum
          qui dolorem eum fugiat quo voluptas nulla pariatur?"
        </div>
      )}
      {screen === "orbit" && <Orbit />}
      {screen === "base" && (
        <>
          <Base />
          <BottomPanel />
        </>
      )}
    </div>
  );
}
