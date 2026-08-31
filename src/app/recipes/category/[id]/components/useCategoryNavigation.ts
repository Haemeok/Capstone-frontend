"use client";

import { useRef, useState } from "react";

import type { TagCode } from "@/shared/config/constants/recipe";

type CategoryIndicatorTransition = {
  type: "spring";
  stiffness: number;
  damping: number;
};

const indicatorTransition: CategoryIndicatorTransition = {
  type: "spring",
  stiffness: 700,
  damping: 40,
};

export const useCategoryNavigation = (currentCode: TagCode) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeCode, setActiveCode] = useState(currentCode);
  const [syncedCode, setSyncedCode] = useState(currentCode);

  if (syncedCode !== currentCode) {
    setSyncedCode(currentCode);
    setActiveCode(currentCode);
  }

  const handleSelect = (code: TagCode) => {
    if (code === activeCode) return;
    setActiveCode(code);
  };

  const handleScroll = () => undefined;

  return {
    activeCode,
    scrollerRef,
    hasHiddenItemsRight: false,
    handleScroll,
    handleSelect,
    indicatorTransition,
  };
};
