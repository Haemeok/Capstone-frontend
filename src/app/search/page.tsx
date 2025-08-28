import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import { SearchClient } from "@/widgets/SearchClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    dishType?: string;
    tagNames?: string | string[];
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || "";
  if (query) {
    return {
      title: `${query} 검색 결과 - 해먹`,
      description: `"${query}"에 대한 레시피 검색 결과입니다.`,
    };
  }
  return {
    title: "레시피 검색 - 해먹",
    description: "원하는 레시피를 검색하고 찾아보세요.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const awaitedSearchParams = await searchParams;
  const tagNames = Array.isArray(awaitedSearchParams.tagNames)
    ? awaitedSearchParams.tagNames
    : awaitedSearchParams.tagNames
      ? [awaitedSearchParams.tagNames]
      : [];

  const q = awaitedSearchParams.q || "";
  const sortCode =
    (awaitedSearchParams.sort || "DESC").toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";
  const dishTypeCode = awaitedSearchParams.dishType || null;
  const tagCodes = tagNames;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["recipes", dishTypeCode, sortCode, tagCodes.join(","), q],
    queryFn: () =>
      getRecipesOnServer({
        key: "search",
        q,
        sort: sortCode.toLowerCase() === "asc" ? "asc" : "desc",
        dishType: dishTypeCode || undefined,
        tagNames: tagCodes,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchClient />
    </HydrationBoundary>
  );
}
