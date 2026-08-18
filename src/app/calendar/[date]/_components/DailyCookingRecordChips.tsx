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
  if (records.length < 2) {
    return null;
  }

  return (
    <div className="py-2">
      <div
        role="group"
        aria-label={groupLabel}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-[18px]"
      >
        {records.map((record) => {
          const selected = record.recordId === activeRecordId;

          return (
            <button
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
