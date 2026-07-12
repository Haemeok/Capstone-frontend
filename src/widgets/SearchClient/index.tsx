"use client";

import type { ReactNode } from "react";

import type { Locale } from "@/shared/i18n";
import { errorsMessages, searchMessages } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { useResetSearchFilters } from "./hooks/useResetSearchFilters";
import { useSearchResults } from "./hooks/useSearchResults";
import { SearchFilters } from "./ui/SearchFilters";

type SearchClientShellProps = {
  children: ReactNode;
};

export const SearchClientShell = ({ children }: SearchClientShellProps) => (
  <Container padding={false}>
    <div className="flex flex-col bg-[#ffffff]">
      <SearchFilters />
      {children}
    </div>
  </Container>
);

type SearchResultsGridProps = {
  initialPage?: number;
  nextPageHref?: string;
  locale?: Locale;
};

export const SearchResultsGrid = ({
  initialPage = 0,
  nextPageHref,
  locale = "ko",
}: SearchResultsGridProps) => {
  const search = searchMessages[locale];
  const {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
  } = useSearchResults(initialPage, locale);
  const resetFilters = useResetSearchFilters();

  return (
    <ErrorBoundary
      fallback={
        <SectionErrorFallback message={errorsMessages[locale].searchResults} />
      }
    >
      <RecipeGrid
        recipes={recipes}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        isPending={isPending}
        observerRef={ref}
        noResults={noResults}
        noResultsMessage={search.noResults}
        onResetFilters={resetFilters}
        lastPageMessage={search.lastPage}
        queryKeyString={queryKeyString}
        nextPageHref={nextPageHref}
        locale={locale}
        showInFeedAds
      />
    </ErrorBoundary>
  );
};

type SearchClientProps = {
  initialPage?: number;
  nextPageHref?: string;
  locale?: Locale;
};

export const SearchClient = ({
  initialPage = 0,
  nextPageHref,
  locale = "ko",
}: SearchClientProps) => (
  <SearchClientShell>
    <SearchResultsGrid
      initialPage={initialPage}
      nextPageHref={nextPageHref}
      locale={locale}
    />
  </SearchClientShell>
);
