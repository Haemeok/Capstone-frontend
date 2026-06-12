"use client";

import type { Locale } from "@/shared/i18n";
import { DictionaryProvider, getDictionary, useT } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { useResetSearchFilters } from "./hooks/useResetSearchFilters";
import { useSearchResults } from "./hooks/useSearchResults";
import { SearchFilters } from "./ui/SearchFilters";

type SearchClientProps = {
  initialPage?: number;
  nextPageHref?: string;
  locale?: Locale;
};

type SearchClientInnerProps = {
  initialPage: number;
  nextPageHref?: string;
  locale: Locale;
};

const SearchClientInner = ({
  initialPage,
  nextPageHref,
  locale,
}: SearchClientInnerProps) => {
  const t = useT();
  const searchLocale = locale === "en" ? "ko" : locale;
  const {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
  } = useSearchResults(initialPage, searchLocale);
  const resetFilters = useResetSearchFilters();

  return (
    <Container padding={false}>
      <div className="flex flex-col bg-[#ffffff]">
        <SearchFilters />

        <ErrorBoundary
          fallback={<SectionErrorFallback message={t.errors.searchResults} />}
        >
          <RecipeGrid
            recipes={recipes}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            isPending={isPending}
            observerRef={ref}
            noResults={noResults}
            noResultsMessage={t.search.noResults}
            onResetFilters={resetFilters}
            lastPageMessage={t.search.lastPage}
            queryKeyString={queryKeyString}
            nextPageHref={nextPageHref}
            locale={searchLocale}
            showInFeedAds
          />
        </ErrorBoundary>
      </div>
    </Container>
  );
};

export const SearchClient = ({
  initialPage = 0,
  nextPageHref,
  locale = "ko",
}: SearchClientProps) => (
  <DictionaryProvider dict={getDictionary(locale)}>
    <SearchClientInner
      initialPage={initialPage}
      nextPageHref={nextPageHref}
      locale={locale}
    />
  </DictionaryProvider>
);
