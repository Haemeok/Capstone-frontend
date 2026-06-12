"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type ServingsStepperProps = {
  currentServings: number;
  minServings: number;
  maxServings: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const ServingsStepper = ({
  currentServings,
  minServings,
  maxServings,
  onIncrement,
  onDecrement,
}: ServingsStepperProps) => {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onDecrement}
        disabled={currentServings <= minServings}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          currentServings > minServings
            ? "text-ink-sub cursor-pointer bg-gray-100 hover:bg-gray-200"
            : "cursor-not-allowed bg-gray-50 text-gray-300"
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="text-ink w-12 text-center text-sm font-bold">
        {currentServings}인분
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={currentServings >= maxServings}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          currentServings < maxServings
            ? "text-ink-sub cursor-pointer bg-gray-100 hover:bg-gray-200"
            : "cursor-not-allowed bg-gray-50 text-gray-300"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
