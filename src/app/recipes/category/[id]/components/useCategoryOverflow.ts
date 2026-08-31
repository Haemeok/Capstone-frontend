"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const OVERFLOW_EPSILON_PX = 1;

const getHasHiddenItemsRight = (element: HTMLDivElement) =>
  element.scrollLeft + element.clientWidth <
  element.scrollWidth - OVERFLOW_EPSILON_PX;

const subscribeToOverflowMeasurements = (
  element: HTMLDivElement,
  updateOverflowState: () => void
) => {
  const animationFrameId = requestAnimationFrame(updateOverflowState);
  if (typeof ResizeObserver === "undefined") {
    return () => cancelAnimationFrame(animationFrameId);
  }

  const resizeObserver = new ResizeObserver(updateOverflowState);
  resizeObserver.observe(element);
  return () => {
    cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
  };
};

export const useCategoryOverflow = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hasHiddenItemsRight, setHasHiddenItemsRight] = useState(false);
  const updateOverflowState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const nextHasHiddenItemsRight = getHasHiddenItemsRight(scroller);
    setHasHiddenItemsRight((currentHasHiddenItemsRight) =>
      currentHasHiddenItemsRight === nextHasHiddenItemsRight
        ? currentHasHiddenItemsRight
        : nextHasHiddenItemsRight
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    return subscribeToOverflowMeasurements(scroller, updateOverflowState);
  }, [updateOverflowState]);

  return {
    scrollerRef,
    hasHiddenItemsRight,
    handleScroll: updateOverflowState,
  };
};
