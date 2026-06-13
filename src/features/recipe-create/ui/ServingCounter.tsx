"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { format, useRecipeFormDict } from "@/shared/i18n";

import type { RecipeFormValues } from "@/features/recipe-create/model/config";

import { cn } from "@/lib/utils";

const MIN = 1;

const ServingCounter = () => {
  const { control } = useFormContext<RecipeFormValues>();
  const { ui } = useRecipeFormDict();

  const { field } = useController<RecipeFormValues, "servings">({
    name: "servings",
    control,
    defaultValue: 1,
  });

  const value = Number(field.value ?? MIN);
  const inc = () => field.onChange(value + 1);
  const dec = () => field.onChange(Math.max(MIN, value - 1));

  return (
    <div
      role="spinbutton"
      aria-valuemin={MIN}
      aria-valuenow={value}
      aria-label={ui.servingsLabel}
      tabIndex={0}
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= MIN}
        aria-label={ui.servingsDecrease}
        className={cn(
          "flex h-8 w-8 items-center",
          "text-ink-sub justify-center rounded-full bg-gray-200 text-lg transition-colors disabled:opacity-50",
          value <= MIN ? "opacity-50" : "cursor-pointer hover:bg-gray-300"
        )}
      >
        -
      </button>
      <span
        className="text-ink w-20 text-center font-medium"
        aria-live="polite"
      >
        {format(ui.servingsUnitSuffix, { n: value })}
      </span>
      <button
        type="button"
        onClick={inc}
        aria-label={ui.servingsIncrease}
        className="text-ink-sub flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-lg transition-colors hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default ServingCounter;
