"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const IngredientsError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} context="ingredients" />;
};

export default IngredientsError;
