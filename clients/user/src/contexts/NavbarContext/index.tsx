'use client'
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

interface NavbarContextType {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);


const NavbarContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <NavbarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </NavbarContext.Provider>
  );
};

export default NavbarContextWrapper;

export function useNavbarContext() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarContextWrapper');
  }
  return context;
}
