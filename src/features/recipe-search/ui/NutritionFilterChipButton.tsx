"use client";

import { lazy, Suspense, useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
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
  const { dict } = useTaxonomy();
  const {
    nutritionParams,
    types,
    countries,
    isNutritionDirty,
    updateNutritionAndTypes,
  } = useNutritionParams();

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
          "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
          isNutritionDirty
            ? "border-purple-400 text-purple-500"
            : "border-purple-300 bg-white text-purple-400 hover:bg-purple-50"
        )}
        aria-label={dict.filters.drawerTitle}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
        <span>{dict.filters.drawerTitle}</span>
      </button>
      {isOpen && (
        <Suspense fallback={null}>
          <NutritionFilterContent
            open={isOpen}
            onOpenChange={setIsOpen}
            initialValues={nutritionParams}
            onApply={updateNutritionAndTypes}
            initialTypes={types}
            initialCountries={countries}
          />
        </Suspense>
      )}
    </>
  );
};
