"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useScrollContext } from "@/shared/lib/ScrollContext";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

type DailyRecordNavigation = {
  activeRecordId: string | null;
  registerRecordElement: (
    recordId: string,
    element: HTMLElement | null
  ) => void;
  selectRecord: (recordId: string) => void;
};

export const useDailyCookingRecordNavigation = (
  records: CookingRecordCalendarDateItem[]
): DailyRecordNavigation => {
  const { motionRef } = useScrollContext();
  const recordElements = useRef(new Map<string, HTMLElement>());
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
      if (recordId === activeRecordId) {
        return;
      }

      triggerHaptic("Light");
      setSelectedRecordId(recordId);
      recordElements.current.get(recordId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [activeRecordId]
  );

  useEffect(() => {
    const root = motionRef.current;
    if (!root || recordIds.length < 2) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const recordId = (visibleEntry?.target as HTMLElement | undefined)
          ?.dataset.recordId;

        if (recordId) {
          setSelectedRecordId(recordId);
        }
      },
      {
        root,
        rootMargin: "-10% 0px -65% 0px",
        threshold: [0, 0.5, 1],
      }
    );

    recordIds.forEach((recordId) => {
      const element = recordElements.current.get(recordId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [motionRef, recordIds]);

  return { activeRecordId, registerRecordElement, selectRecord };
};
