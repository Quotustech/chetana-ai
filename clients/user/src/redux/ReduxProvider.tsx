"use client";

import { Provider } from "react-redux";
import React from "react";
import { store } from "./store";
import ThemeContextWrapper from "@/contexts/ThemeContext";
import NavbarContextWrapper from "@/contexts/NavbarContext";
import SidebarContextWrapper from "@/contexts/SidebarContext";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <ThemeContextWrapper>
        <SidebarContextWrapper>
          <NavbarContextWrapper>{children}</NavbarContextWrapper>
        </SidebarContextWrapper>
      </ThemeContextWrapper>
    </Provider>
  );
}
