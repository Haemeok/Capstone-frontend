"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

type DailyCookingRecordChipsProps = {
  records: CookingRecordCalendarDateItem[];
  activeRecordId: string | null;
  groupLabel: string;
  onSelect: (recordId: string) => void;
};

export const DailyCookingRecordChips = ({
  records,
  activeRecordId,
  groupLabel,
  onSelect,
}: DailyCookingRecordChipsProps) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!activeRecordId) return;

    const group = groupRef.current;
    const activeChip = chipRefs.current.get(activeRecordId);
    if (!group || !activeChip) return;

    const chipLeft = activeChip.offsetLeft;
    const chipRight = chipLeft + activeChip.offsetWidth;
    const visibleLeft = group.scrollLeft;
    const visibleRight = visibleLeft + group.clientWidth;
    if (chipLeft >= visibleLeft && chipRight <= visibleRight) return;

    group.scrollTo({
      left: Math.max(
        0,
        chipLeft - (group.clientWidth - activeChip.offsetWidth) / 2
      ),
      behavior: "smooth",
    });
  }, [activeRecordId]);

  if (records.length < 2) {
    return null;
  }

  return (
    <div className="py-2">
      <div
        ref={groupRef}
        role="group"
        aria-label={groupLabel}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-[18px]"
      >
        {records.map((record) => {
          const selected = record.recordId === activeRecordId;

          return (
            <button
              ref={(element) => {
                if (element) {
                  chipRefs.current.set(record.recordId, element);
                  return;
                }
                chipRefs.current.delete(record.recordId);
              }}
              key={record.recordId}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(record.recordId)}
              className={cn(
                "focus-visible:ring-olive-light min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                selected ? "bg-ink text-white" : "text-ink-sub bg-gray-100"
              )}
            >
              {record.displayTitle}
            </button>
          );
        })}
      </div>
    </div>
  );
};
