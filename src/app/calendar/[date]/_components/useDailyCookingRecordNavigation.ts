"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useScrollContext } from "@/shared/lib/ScrollContext";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

const CHIP_SCROLL_DURATION_MS = 450;
const STICKY_CONTROLS_HEIGHT_PX = 152;
const SCROLL_END_TOLERANCE_PX = 1;

type DailyRecordNavigation = {
  activeRecordId: string | null;
  registerRecordElement: (
    recordId: string,
    element: HTMLElement | null
  ) => void;
  selectRecord: (recordId: string) => void;
};

const easeInOutCubic = (progress: number): number =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

const getTargetScrollTop = (root: HTMLElement, target: HTMLElement): number => {
  const rootTop = root.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  const desiredTop =
    root.scrollTop + targetTop - rootTop - STICKY_CONTROLS_HEIGHT_PX;
  const maximumTop = Math.max(0, root.scrollHeight - root.clientHeight);

  return Math.min(Math.max(desiredTop, 0), maximumTop);
};

const animateScrollTop = (
  root: HTMLElement,
  targetTop: number,
  onComplete: () => void
): (() => void) => {
  const startTop = root.scrollTop;
  const distance = targetTop - startTop;
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (prefersReducedMotion || Math.abs(distance) < 1) {
    root.scrollTop = targetTop;
    onComplete();
    return () => undefined;
  }

  let animationFrameId = 0;
  let startedAt: number | null = null;
  let cancelled = false;

  const step = (timestamp: number) => {
    if (cancelled) return;

    startedAt ??= timestamp;
    const progress = Math.min(
      (timestamp - startedAt) / CHIP_SCROLL_DURATION_MS,
      1
    );
    root.scrollTop = startTop + distance * easeInOutCubic(progress);

    if (progress < 1) {
      animationFrameId = window.requestAnimationFrame(step);
      return;
    }

    root.scrollTop = targetTop;
    onComplete();
  };

  animationFrameId = window.requestAnimationFrame(step);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(animationFrameId);
  };
};

export const useDailyCookingRecordNavigation = (
  records: CookingRecordCalendarDateItem[]
): DailyRecordNavigation => {
  const { motionRef } = useScrollContext();
  const recordElements = useRef(new Map<string, HTMLElement>());
  const isChipScrollActiveRef = useRef(false);
  const cancelChipScrollRef = useRef<(() => void) | null>(null);
  const trackingFrameRef = useRef<number | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const recordIds = useMemo(
    () => records.map((record) => record.recordId),
    [records]
  );
  const activeRecordId =
    selectedRecordId && recordIds.includes(selectedRecordId)
      ? selectedRecordId
      : (recordIds[0] ?? null);

  const registerRecordElement = useCallback(
    (recordId: string, element: HTMLElement | null) => {
      if (element) {
        recordElements.current.set(recordId, element);
        return;
      }
      recordElements.current.delete(recordId);
    },
    []
  );

  const selectRecord = useCallback(
    (recordId: string) => {
      if (recordId === activeRecordId) return;

      const root = motionRef.current;
      const target = recordElements.current.get(recordId);
      if (!root || !target) return;

      triggerHaptic("Light");
      cancelChipScrollRef.current?.();
      isChipScrollActiveRef.current = true;
      setSelectedRecordId(recordId);

      const targetTop = getTargetScrollTop(root, target);
      const cancelAnimation = animateScrollTop(root, targetTop, () => {
        isChipScrollActiveRef.current = false;
        cancelChipScrollRef.current = null;
      });

      if (isChipScrollActiveRef.current) {
        cancelChipScrollRef.current = cancelAnimation;
      }
    },
    [activeRecordId, motionRef]
  );

  useEffect(() => {
    const root = motionRef.current;
    if (!root || recordIds.length < 2) return;

    const updateActiveRecord = () => {
      if (isChipScrollActiveRef.current) return;

      const rootTop = root.getBoundingClientRect().top;
      const activationLine = rootTop + STICKY_CONTROLS_HEIGHT_PX;
      const reachedBottom =
        root.scrollTop + root.clientHeight >=
        root.scrollHeight - SCROLL_END_TOLERANCE_PX;
      let nextRecordId = reachedBottom
        ? recordIds[recordIds.length - 1]
        : recordIds[0];

      if (!reachedBottom) {
        for (const recordId of recordIds) {
          const element = recordElements.current.get(recordId);
          if (
            !element ||
            element.getBoundingClientRect().top > activationLine
          ) {
            break;
          }
          nextRecordId = recordId;
        }
      }

      if (nextRecordId) {
        setSelectedRecordId((current) =>
          current === nextRecordId ? current : nextRecordId
        );
      }
    };

    const scheduleActiveRecordUpdate = () => {
      if (isChipScrollActiveRef.current || trackingFrameRef.current !== null) {
        return;
      }

      trackingFrameRef.current = window.requestAnimationFrame(() => {
        trackingFrameRef.current = null;
        updateActiveRecord();
      });
    };

    const cancelProgrammaticScroll = () => {
      if (!isChipScrollActiveRef.current) return;

      cancelChipScrollRef.current?.();
      cancelChipScrollRef.current = null;
      isChipScrollActiveRef.current = false;
      scheduleActiveRecordUpdate();
    };

    root.addEventListener("scroll", scheduleActiveRecordUpdate, {
      passive: true,
    });
    root.addEventListener("wheel", cancelProgrammaticScroll, {
      passive: true,
    });
    root.addEventListener("touchstart", cancelProgrammaticScroll, {
      passive: true,
    });
    root.addEventListener("pointerdown", cancelProgrammaticScroll, {
      passive: true,
    });

    return () => {
      root.removeEventListener("scroll", scheduleActiveRecordUpdate);
      root.removeEventListener("wheel", cancelProgrammaticScroll);
      root.removeEventListener("touchstart", cancelProgrammaticScroll);
      root.removeEventListener("pointerdown", cancelProgrammaticScroll);
      cancelChipScrollRef.current?.();
      cancelChipScrollRef.current = null;
      isChipScrollActiveRef.current = false;
      if (trackingFrameRef.current !== null) {
        window.cancelAnimationFrame(trackingFrameRef.current);
        trackingFrameRef.current = null;
      }
    };
  }, [motionRef, recordIds]);

  return { activeRecordId, registerRecordElement, selectRecord };
};
