"use client";
import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");
  const [selected, setSelected] = useState('light');

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    if (colorMode === "dark") {
      bodyClass.add(className);
      setSelected('dark');
    } else {
      bodyClass.remove(className);
      setSelected('light');
    }
  }, [colorMode]);

  return [colorMode, selected, setColorMode];
};

export default useColorMode;
