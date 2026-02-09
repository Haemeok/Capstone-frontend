"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { MissingIngredient } from "@/entities/recipe/model/types";

type ExpandableIngredientsProps = {
  matchedIngredients: string[];
  missingIngredients: MissingIngredient[];
};

const VISIBLE_COUNT = 3;

const ExpandableIngredients = ({
  matchedIngredients,
  missingIngredients,
}: ExpandableIngredientsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const matchedHiddenCount = Math.max(
    0,
    matchedIngredients.length - VISIBLE_COUNT
  );
  const missingHiddenCount = Math.max(
    0,
    missingIngredients.length - VISIBLE_COUNT
  );

  const hasHiddenItems = matchedHiddenCount > 0 || missingHiddenCount > 0;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("Light");
    setIsExpanded(!isExpanded);
  };

  const visibleMatched = isExpanded
    ? matchedIngredients
    : matchedIngredients.slice(0, VISIBLE_COUNT);

  const missingNames = missingIngredients.map((i) => i.name);
  const visibleMissing = isExpanded
    ? missingNames
    : missingNames.slice(0, VISIBLE_COUNT);

  return (
    <div className="mt-1.5 flex flex-col gap-1">
      {/* 매치된 재료 */}
      {matchedIngredients.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleMatched.map((ingredient, index) => (
            <span
              key={index}
              className="rounded-full bg-olive-light/10 px-2.5 py-1 text-xs font-bold text-olive-light"
            >
              {ingredient}
            </span>
          ))}
          {!isExpanded && matchedHiddenCount > 0 && (
            <button
              onClick={handleExpandClick}
              className="flex h-6 min-w-[32px] items-center justify-center rounded-full bg-olive-light/20 px-2 text-xs font-bold text-olive-light transition-colors hover:bg-olive-light/30"
            >
              +{matchedHiddenCount}
            </button>
          )}
        </div>
      )}

      {/* 빠진 재료 */}
      {missingIngredients.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleMissing.map((name, index) => (
            <span
              key={index}
              className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500"
            >
              {name}
            </span>
          ))}
          {!isExpanded && missingHiddenCount > 0 && (
            <button
              onClick={handleExpandClick}
              className="flex h-6 min-w-[32px] items-center justify-center rounded-full bg-red-100 px-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-200"
            >
              +{missingHiddenCount}
            </button>
          )}
        </div>
      )}

      {/* 접기 버튼 (펼쳐진 상태에서만) */}
      {isExpanded && hasHiddenItems && (
        <button
          onClick={handleExpandClick}
          className={cn(
            "mt-1 flex h-7 w-fit items-center justify-center rounded-full px-3",
            "bg-gray-100 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200"
          )}
        >
          접기
        </button>
      )}
    </div>
  );
};

export default ExpandableIngredients;
