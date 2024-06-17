"use client";

import React from "react";
import { Provider } from "react-redux";
import  store  from "./store";
import {NextUIProvider} from "@nextui-org/react";

type Props = {
  children: React.ReactNode;
};

export default function AppProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
}
