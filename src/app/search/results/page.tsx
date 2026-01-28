import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  convertNutritionToQueryParams,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import { SearchClient } from "@/widgets/SearchClient";

type SearchResultsPageProps = {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    dishType?: string;
    tags?: string | string[];
    types?: string;
    minCost?: string;
    maxCost?: string;
    minCalories?: string;
    maxCalories?: string;
    minCarb?: string;
    maxCarb?: string;
    minProtein?: string;
    maxProtein?: string;
    minFat?: string;
    maxFat?: string;
    minSugar?: string;
    maxSugar?: string;
    minSodium?: string;
    maxSodium?: string;
    ingredientIds?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: SearchResultsPageProps) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || "";
  if (query) {
    return {
      title: `${query} 검색 결과 - 레시피오`,
      description: `"${query}"에 대한 레시피 검색 결과입니다.`,
    };
  }
  return {
    title: "레시피 검색 결과 - 레시피오",
    description: "필터를 적용한 레시피 검색 결과입니다.",
  };
}

export default async function SearchResultsPage({
  searchParams,
}: SearchResultsPageProps) {
  const awaitedSearchParams = await searchParams;

  const tags = awaitedSearchParams.tags
    ? typeof awaitedSearchParams.tags === "string"
      ? awaitedSearchParams.tags.split(",").filter(Boolean)
      : awaitedSearchParams.tags
    : [];

  const q = awaitedSearchParams.q || "";
  const sortCode =
    (awaitedSearchParams.sort || "DESC").toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";
  const dishTypeCode = awaitedSearchParams.dishType || null;
  const tagCodes = tags;

  const nutritionParams = parseNutritionParams(awaitedSearchParams);
  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const types = parseTypes(awaitedSearchParams);

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: [
      "recipes",
      dishTypeCode,
      sortCode,
      tagCodes.join(","),
      q,
      JSON.stringify(nutritionQueryParams),
      types.join(","),
    ],
    queryFn: () =>
      getRecipesOnServer({
        key: "search",
        q,
        sort: sortCode.toLowerCase() === "asc" ? "asc" : "desc",
        dishType: dishTypeCode || undefined,
        tags: tagCodes,
        types,
        ...nutritionQueryParams,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchClient />
    </HydrationBoundary>
  );
}
