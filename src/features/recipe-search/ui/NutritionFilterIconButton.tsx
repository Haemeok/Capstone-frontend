"use client";

import { useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useNutritionParams } from "../model";
import { NutritionFilterContent } from "./NutritionFilterContent";

export const NutritionFilterIconButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { nutritionParams, types, isNutritionDirty, updateNutritionAndTypes } =
    useNutritionParams();

  const handleClick = () => {
    triggerHaptic("Light");
    setIsOpen(true);
  };

  return (
    <NutritionFilterContent
      trigger={
        <button
          onClick={handleClick}
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
            isNutritionDirty
              ? "bg-dark-light text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          aria-label="상세 필터"
        >
          <SlidersHorizontal size={20} />
          {isNutritionDirty && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-olive-light" />
          )}
        </button>
      }
      initialValues={nutritionParams}
      onApply={updateNutritionAndTypes}
      initialTypes={types}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
};
