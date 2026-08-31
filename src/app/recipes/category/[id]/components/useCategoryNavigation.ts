"use client";

import { useRef, useState } from "react";

import { useReducedMotion } from "framer-motion";

import type { TagCode } from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";

type CategoryIndicatorTransition =
  | {
      type: "spring";
      stiffness: number;
      damping: number;
    }
  | {
      duration: 0;
    };

const SPRING_TRANSITION: CategoryIndicatorTransition = {
  type: "spring",
  stiffness: 700,
  damping: 40,
};
const IMMEDIATE_TRANSITION: CategoryIndicatorTransition = { duration: 0 };

export const useCategoryNavigation = (currentCode: TagCode) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeCode, setActiveCode] = useState(currentCode);
  const [syncedCode, setSyncedCode] = useState(currentCode);
  const reducedMotion = useReducedMotion();

  if (syncedCode !== currentCode) {
    setSyncedCode(currentCode);
    setActiveCode(currentCode);
  }

  const handleSelect = (code: TagCode) => {
    if (code === activeCode) return;
    triggerHaptic("Light");
    setActiveCode(code);
  };

  const handleScroll = () => undefined;

  return {
    activeCode,
    scrollerRef,
    hasHiddenItemsRight: false,
    handleScroll,
    handleSelect,
    indicatorTransition: reducedMotion
      ? IMMEDIATE_TRANSITION
      : SPRING_TRANSITION,
  };
};
