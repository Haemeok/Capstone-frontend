"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const RecipeEditError = ({ reset }: ErrorProps) => {
  return (
    <ErrorFallback reset={reset} message="레시피 수정 페이지를 불러올 수 없어요" />
  );
};

export default RecipeEditError;
