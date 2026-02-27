import type { Metadata } from "next";

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
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import { SearchClient } from "@/widgets/SearchClient";

type SearchResultsSearchParams = {
  page?: string;
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
};

type SearchResultsPageProps = {
  searchParams: Promise<SearchResultsSearchParams>;
};

export async function generateMetadata({
  searchParams,
}: SearchResultsPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || "";
  const page = Math.max(
    0,
    parseInt(awaitedSearchParams.page || "0", 10) || 0
  );

  const pageLabel = page > 0 ? ` (${page + 1}페이지)` : "";

  const title = query
    ? `${query} 검색 결과${pageLabel} - 레시피오`
    : `레시피 검색 결과${pageLabel} - 레시피오`;

  const description = query
    ? `"${query}"에 대한 레시피 검색 결과입니다.`
    : "필터를 적용한 레시피 검색 결과입니다.";

  const canonicalParams = new URLSearchParams();
  for (const [key, value] of Object.entries(awaitedSearchParams)) {
    if (value !== undefined) {
      canonicalParams.set(key, Array.isArray(value) ? value.join(",") : value);
    }
  }

  const canonicalSearch = canonicalParams.toString();

  return {
    title,
    description,
    alternates: {
      canonical: `${SEO_CONSTANTS.SITE_URL}/search/results${canonicalSearch ? `?${canonicalSearch}` : ""}`,
    },
  };
}

export default async function SearchResultsPage({
  searchParams,
}: SearchResultsPageProps) {
  const awaitedSearchParams = await searchParams;

  const page = Math.max(
    0,
    parseInt(awaitedSearchParams.page || "0", 10) || 0
  );

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

  const ingredientIds = awaitedSearchParams.ingredientIds
    ? awaitedSearchParams.ingredientIds.split(",").filter(Boolean)
    : [];

  const queryClient = new QueryClient();

  // 기존 prefetchQuery 유지 (렌더링 동작 변경 없음)
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
        page,
        q,
        sort: sortCode.toLowerCase() === "asc" ? "asc" : "desc",
        dishType: dishTypeCode || undefined,
        tags: tagCodes,
        types,
        ingredientIds: ingredientIds.length > 0 ? ingredientIds : undefined,
        ...nutritionQueryParams,
      }),
  });

  // SEO용 totalPages 조회 (별도 fetch)
  const pageData = await getRecipesOnServer({
    key: "search",
    page,
    q,
    sort: sortCode.toLowerCase() === "asc" ? "asc" : "desc",
    dishType: dishTypeCode || undefined,
    tags: tagCodes,
    types,
    ingredientIds: ingredientIds.length > 0 ? ingredientIds : undefined,
    ...nutritionQueryParams,
  });

  const totalPages = pageData.page.totalPages;
  const hasNextPage = page < totalPages - 1;

  const nextPageHref = hasNextPage
    ? buildNextPageUrl(awaitedSearchParams, page + 1)
    : undefined;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchClient initialPage={page} nextPageHref={nextPageHref} />
    </HydrationBoundary>
  );
}
