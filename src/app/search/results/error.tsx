"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const SearchResultsError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} message="검색 결과를 불러올 수 없어요" />;
};

export default SearchResultsError;
