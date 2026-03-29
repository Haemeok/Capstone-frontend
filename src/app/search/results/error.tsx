"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const SearchResultsError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="검색 결과를 불러올 수 없어요" />;
};

export default SearchResultsError;
