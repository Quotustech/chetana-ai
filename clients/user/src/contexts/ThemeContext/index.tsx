'use client'
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

interface ThemeContextType {
    colorMode: 'dark' | 'light';
    setColorMode: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


const ThemeContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const storedColorMode = typeof localStorage !== 'undefined'&& localStorage.getItem('color-theme') || 'light';
  const [colorMode, setColorMode] = useState<'dark' | 'light'>(storedColorMode  as 'dark' | 'light');

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    if (colorMode === "dark") {
      bodyClass.add(className);
    } else {
      bodyClass.remove(className);
    }
    localStorage.setItem('color-theme',colorMode);
  }, [colorMode])
  

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextWrapper;

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarContextWrapper');
  }
  return context;
}
