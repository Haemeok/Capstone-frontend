"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const RecipeEditError = ({ reset }: NextErrorProps) => {
  return (
    <ErrorFallback reset={reset} message="레시피 수정 페이지를 불러올 수 없어요" />
  );
};

export default RecipeEditError;
