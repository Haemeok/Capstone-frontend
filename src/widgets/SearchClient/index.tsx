"use client";

import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

import { useSearchResults } from "./hooks/useSearchResults";
import { SearchFilters } from "./ui/SearchFilters";

type SearchClientProps = {
  initialPage?: number;
  nextPageHref?: string;
};

export const SearchClient = ({
  initialPage = 0,
  nextPageHref,
}: SearchClientProps) => {
  const {
    recipes,
    hasNextPage,
    isFetching,
    isPending,
    ref,
    queryKeyString,
    noResults,
    resetFilters,
  } = useSearchResults(initialPage);

  return (
    <Container padding={false}>
      <div className="flex flex-col bg-[#ffffff]">
        <SearchFilters />

        <ErrorBoundary
          fallback={<SectionErrorFallback message="검색 결과를 표시할 수 없어요" />}
        >
          <RecipeGrid
            recipes={recipes}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            isPending={isPending}
            observerRef={ref}
            noResults={noResults}
            onResetFilters={resetFilters}
            lastPageMessage={"모든 레시피를 불러왔습니다."}
            queryKeyString={queryKeyString}
            nextPageHref={nextPageHref}
            showInFeedAds
          />
        </ErrorBoundary>
      </div>
    </Container>
  );
};
