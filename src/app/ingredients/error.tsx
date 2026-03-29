"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const IngredientsError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="재료 목록을 불러올 수 없어요" />;
};

export default IngredientsError;
