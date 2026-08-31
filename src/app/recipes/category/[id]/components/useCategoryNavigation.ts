"use client";

import { type MouseEvent, useCallback, useLayoutEffect, useState } from "react";

import { useReducedMotion } from "framer-motion";

import type { TagCode } from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";

import { useCategoryOverflow } from "./useCategoryOverflow";

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
const SCROLLER_HORIZONTAL_PADDING_PX = 12;
const RIGHT_FADE_WIDTH_PX = 48;
const ACTIVE_ITEM_LEFT_REVEAL_PADDING_PX = SCROLLER_HORIZONTAL_PADDING_PX;
const ACTIVE_ITEM_RIGHT_FADE_SAFE_PX =
  RIGHT_FADE_WIDTH_PX + SCROLLER_HORIZONTAL_PADDING_PX;

const revealActiveItem = (scroller: HTMLDivElement, code: TagCode) => {
  const item = scroller.querySelector<HTMLElement>(
    `[data-category-code="${code}"]`
  );
  if (!item) return;

  const itemLeft = item.offsetLeft;
  const itemRight = itemLeft + item.offsetWidth;
  const visibleLeft = scroller.scrollLeft + ACTIVE_ITEM_LEFT_REVEAL_PADDING_PX;
  const visibleRight =
    scroller.scrollLeft + scroller.clientWidth - ACTIVE_ITEM_RIGHT_FADE_SAFE_PX;
  if (itemLeft >= visibleLeft && itemRight <= visibleRight) return;

  const requestedScrollLeft =
    itemLeft < visibleLeft
      ? itemLeft - ACTIVE_ITEM_LEFT_REVEAL_PADDING_PX
      : itemRight - scroller.clientWidth + ACTIVE_ITEM_RIGHT_FADE_SAFE_PX;
  const maximumScrollLeft = Math.max(
    scroller.scrollWidth - scroller.clientWidth,
    0
  );
  scroller.scrollLeft = Math.min(
    Math.max(requestedScrollLeft, 0),
    maximumScrollLeft
  );
};

const isPlainPrimaryClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 &&
  !event.defaultPrevented &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey &&
  !event.altKey;

export const useCategoryNavigation = (currentCode: TagCode) => {
  const [activeCode, setActiveCode] = useState(currentCode);
  const [syncedCode, setSyncedCode] = useState(currentCode);
  const reducedMotion = useReducedMotion();
  const handleMeasure = useCallback(
    (scroller: HTMLDivElement) => revealActiveItem(scroller, currentCode),
    [currentCode]
  );
  const { scrollerRef, hasHiddenItemsRight, handleScroll } =
    useCategoryOverflow(handleMeasure);

  if (syncedCode !== currentCode) {
    setSyncedCode(currentCode);
    setActiveCode(currentCode);
  }

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    revealActiveItem(scroller, currentCode);
    handleScroll();
  }, [currentCode, handleScroll, scrollerRef]);

  const handleSelect = (
    code: TagCode,
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    if (!isPlainPrimaryClick(event)) return;
    if (code === activeCode) return;
    triggerHaptic("Light");
    setActiveCode(code);
  };

  return {
    activeCode,
    scrollerRef,
    hasHiddenItemsRight,
    handleScroll,
    handleSelect,
    indicatorTransition: reducedMotion
      ? IMMEDIATE_TRANSITION
      : SPRING_TRANSITION,
  };
};
