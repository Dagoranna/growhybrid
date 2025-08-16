"use client";

import "./globals.css";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MainAppWrapper from "../components/MainAppWrapper";

type MyProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: MyProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="icon.png" type="image/x-icon"></link>
      </head>
      <body>
        <Provider store={store}>
          <MainAppWrapper>{children}</MainAppWrapper>
        </Provider>
      </body>
    </html>
  );
}
