"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const MIN = 1;

const ServingsCounter = () => {
  const { control } = useFormContext<AIRecipeFormValues>();

  const { field } = useController<AIRecipeFormValues, "servings">({
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
      tabIndex={0}
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= MIN}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300 disabled:opacity-50"
      >
        -
      </button>
      <span className="w-20 text-center font-medium text-gray-800">
        {value}인분
      </span>
      <button
        type="button"
        onClick={inc}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default ServingsCounter;
