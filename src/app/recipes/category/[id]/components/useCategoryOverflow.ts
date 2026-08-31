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

type CategoryMeasureHandler = (scroller: HTMLDivElement) => void;

export const useCategoryOverflow = (onMeasure?: CategoryMeasureHandler) => {
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
  const measureOverflow = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    onMeasure?.(scroller);
    updateOverflowState();
  }, [onMeasure, updateOverflowState]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    return subscribeToOverflowMeasurements(scroller, measureOverflow);
  }, [measureOverflow]);

  return {
    scrollerRef,
    hasHiddenItemsRight,
    handleScroll: updateOverflowState,
  };
};
