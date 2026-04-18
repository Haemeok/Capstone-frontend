"use client";

import { lazy, Suspense, useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useNutritionParams } from "../model";

const NutritionFilterContent = lazy(() =>
  import("./NutritionFilterContent").then((m) => ({
    default: m.NutritionFilterContent,
  }))
);

export const NutritionFilterChipButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { nutritionParams, types, isNutritionDirty, updateNutritionAndTypes } =
    useNutritionParams();

  const handleClick = () => {
    triggerHaptic("Light");
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-colors",
          isNutritionDirty
            ? "border-purple-600 bg-purple-50 text-purple-700"
            : "border-purple-500 bg-white text-purple-600 hover:bg-purple-50"
        )}
        aria-label="상세 필터"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
        <span>필터</span>
      </button>
      {isOpen && (
        <Suspense fallback={null}>
          <NutritionFilterContent
            open={isOpen}
            onOpenChange={setIsOpen}
            initialValues={nutritionParams}
            onApply={updateNutritionAndTypes}
            initialTypes={types}
          />
        </Suspense>
      )}
    </>
  );
};
