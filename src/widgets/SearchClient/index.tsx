"use client";

import { Container } from "@/shared/ui/Container";

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
        />
      </div>
    </Container>
  );
};
