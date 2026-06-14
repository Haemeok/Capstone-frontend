"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const RecipeDetailError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} context="recipe" />;
};

export default RecipeDetailError;
