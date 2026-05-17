"use client";

import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { Ingredient } from "../types";

type ChecklistModeProps = {
  ingredients: Ingredient[];
  checkedIndices: Set<number>;
  onToggle: (index: number) => void;
};

export const ChecklistMode = ({
  ingredients,
  checkedIndices,
  onToggle,
}: ChecklistModeProps) => {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
      <div className="space-y-1">
        {ingredients.map((ing) => {
          const isChecked = checkedIndices.has(ing.index);
          return (
            <button
              key={ing.index}
              type="button"
              onClick={() => onToggle(ing.index)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                  isChecked
                    ? "border-olive-light bg-olive-light"
                    : "border-gray-300"
                )}
              >
                {isChecked && <Check className="h-3 w-3 text-white" />}
              </div>
              <span
                className={cn(
                  "flex-1 text-sm transition-all",
                  isChecked
                    ? "text-gray-300 line-through"
                    : "font-medium text-gray-900"
                )}
              >
                {ing.name}
              </span>
              <span
                className={cn(
                  "text-sm transition-all",
                  isChecked ? "text-gray-300 line-through" : "text-gray-500"
                )}
              >
                {ing.amount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
