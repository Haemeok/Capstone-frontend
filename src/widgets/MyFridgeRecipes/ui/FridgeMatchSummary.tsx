"use client";

import { useState } from "react";

import { Check, Triangle } from "lucide-react";

import { format, plural, useFridgeDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { MissingIngredient } from "@/entities/recipe/model/types";

type FridgeMatchSummaryProps = {
  missingIngredients: MissingIngredient[];
};

const VISIBLE_COUNT = 3;

const FridgeMatchSummary = ({
  missingIngredients,
}: FridgeMatchSummaryProps) => {
  const dict = useFridgeDict();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("Light");
    setIsExpanded((prev) => !prev);
  };

  if (missingIngredients.length === 0) {
    return (
      <div className="text-olive-light flex items-center gap-1">
        <Check size={14} strokeWidth={2.5} aria-hidden />
        <span className="text-xs font-bold">{dict.matchReady}</span>
      </div>
    );
  }

  const missingNames = missingIngredients.map((item) => item.name);
  const hiddenCount = Math.max(0, missingNames.length - VISIBLE_COUNT);
  const visibleMissing = isExpanded
    ? missingNames
    : missingNames.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1 text-amber-500">
        <Triangle
          size={12}
          strokeWidth={2.5}
          className="fill-amber-500"
          aria-hidden
        />
        <span className="text-xs font-bold">
          {format(plural(missingNames.length, dict.matchMissing), {
            count: missingNames.length,
          })}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {visibleMissing.map((name, index) => (
          <span
            key={index}
            className="text-ink-sub rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium"
          >
            {name}
          </span>
        ))}
        {!isExpanded && hiddenCount > 0 && (
          <button
            onClick={handleExpandClick}
            className="text-ink-sub flex h-6 min-w-[32px] items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-bold transition-colors hover:bg-gray-200"
          >
            +{hiddenCount}
          </button>
        )}
      </div>

      {isExpanded && hiddenCount > 0 && (
        <button
          onClick={handleExpandClick}
          className={cn(
            "flex h-7 w-fit items-center justify-center rounded-full px-3",
            "text-ink-muted bg-gray-100 text-xs font-medium transition-colors hover:bg-gray-200"
          )}
        >
          {dict.collapse}
        </button>
      )}
    </div>
  );
};

export default FridgeMatchSummary;
