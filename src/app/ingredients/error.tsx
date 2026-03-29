"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const IngredientsError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} message="재료 목록을 불러올 수 없어요" />;
};

export default IngredientsError;
