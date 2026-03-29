"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const RecipeDetailError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="레시피를 불러올 수 없어요" />;
};

export default RecipeDetailError;
