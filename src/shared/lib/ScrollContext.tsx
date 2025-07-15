"use client";

import { createContext, useContext, type RefObject } from "react";

type ScrollContextType = {
  motionRef: RefObject<HTMLDivElement | null>;
};

export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error(
      "useScrollContext는 ScrollProvider 안에서 사용해야 합니다."
    );
  }
  return context;
};
