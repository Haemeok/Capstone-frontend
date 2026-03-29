"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const RecipeDetailError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} message="레시피를 불러올 수 없어요" />;
};

export default RecipeDetailError;
