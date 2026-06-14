"use client";

import type { NextErrorProps } from "@/shared/types";
import ErrorFallback from "@/shared/ui/ErrorFallback";

const SearchResultsError = ({ reset }: NextErrorProps) => {
  return <ErrorFallback reset={reset} context="search" />;
};

export default SearchResultsError;
