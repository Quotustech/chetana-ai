'use client'
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

interface SidebarContextType {
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  isSmall: boolean;
  sidebarRef: React.RefObject<HTMLDivElement>;
  sidebarBtnRef: React.RefObject<HTMLDivElement>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);


const SidebarContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarBtnRef = useRef<HTMLDivElement>(null);
  const [isSmall, setIsSmall] = useState(true);
  const [collapse, setCollapse] = useState(true);

  useLayoutEffect(() => {
    // Set initial states based on window width
    if (window.innerWidth <= 1024) {
      setIsSmall(true);
      setCollapse(true);
    } else {
      setIsSmall(false);
      setCollapse(false);
    }
  }, []); 
  

  

  return (
    <SidebarContext.Provider value={{ collapse, setCollapse , isSmall , sidebarRef , sidebarBtnRef}}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextWrapper;

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarContextWrapper');
  }
  return context;
}
