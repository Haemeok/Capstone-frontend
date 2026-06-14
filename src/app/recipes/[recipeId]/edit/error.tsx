"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const RecipeEditError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} context="edit" />;
};

export default RecipeEditError;
