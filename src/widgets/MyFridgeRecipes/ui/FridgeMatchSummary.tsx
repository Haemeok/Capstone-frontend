"use client";

import { useState } from "react";

import { Check } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { MissingIngredient } from "@/entities/recipe/model/types";

type FridgeMatchSummaryProps = {
  matchedIngredients: string[];
  missingIngredients: MissingIngredient[];
};

const VISIBLE_COUNT = 3;

const FridgeMatchSummary = ({
  matchedIngredients,
  missingIngredients,
}: FridgeMatchSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("Light");
    setIsExpanded((prev) => !prev);
  };

  if (missingIngredients.length === 0) {
    return (
      <div className="text-olive-light mt-2 flex items-center gap-1">
        <Check size={14} strokeWidth={2.5} aria-hidden />
        <span className="text-xs font-bold">냉장고 재료로 바로 완성</span>
      </div>
    );
  }

  const missingNames = missingIngredients.map((item) => item.name);
  const hiddenCount = Math.max(0, missingNames.length - VISIBLE_COUNT);
  const visibleMissing = isExpanded
    ? missingNames
    : missingNames.slice(0, VISIBLE_COUNT);

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {matchedIngredients.length > 0 && (
        <div className="text-olive-light flex items-center gap-1">
          <Check size={14} strokeWidth={2.5} aria-hidden />
          <span className="text-xs font-bold">
            내 재료 {matchedIngredients.length}개로 가능
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500">
          {missingNames.length}개만 더
        </span>
        {visibleMissing.map((name, index) => (
          <span
            key={index}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
          >
            {name}
          </span>
        ))}
        {!isExpanded && hiddenCount > 0 && (
          <button
            onClick={handleExpandClick}
            className="flex h-6 min-w-[32px] items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
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
            "bg-gray-100 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200"
          )}
        >
          접기
        </button>
      )}
    </div>
  );
};

export default FridgeMatchSummary;
