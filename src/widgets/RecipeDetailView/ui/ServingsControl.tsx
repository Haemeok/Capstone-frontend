"use client";

import { useT } from "@/shared/i18n";

type ServingsControlProps = {
  currentServings: number;
  minServings: number;
  maxServings: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const ServingsControl = ({
  currentServings,
  minServings,
  maxServings,
  onIncrement,
  onDecrement,
}: ServingsControlProps) => {
  const t = useT();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-ink-sub text-sm">
          {t.recipeDetail.servingsLabel}
        </span>
        <div className="flex items-center gap-1">
          {currentServings > minServings && (
            <button
              type="button"
              onClick={onDecrement}
              aria-label={t.recipeDetail.servingsDecrease}
              className="text-ink-sub flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm transition-colors hover:bg-gray-300"
            >
              -
            </button>
          )}
          <span className="text-ink w-10 text-center text-sm font-medium">
            {currentServings}
          </span>
          {currentServings < maxServings && (
            <button
              type="button"
              onClick={onIncrement}
              aria-label={t.recipeDetail.servingsIncrease}
              className="text-ink-sub flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm transition-colors hover:bg-gray-300"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
