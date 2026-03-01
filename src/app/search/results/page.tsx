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
import {
  buildSearchTitle,
  buildSearchDescription,
} from "@/entities/recipe/lib/metadata/searchMeta";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";
import type { RecipeItemsQueryParams } from "@/entities/recipe/model/types";
import { createSearchResultsJsonLd } from "@/entities/recipe/lib/metadata/schema";

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

type ParsedSearchParams = {
  query: RecipeItemsQueryParams;
  page: number;
  q: string;
  dishTypeCode: string | null;
  sortCode: string;
  tags: string[];
  types: string[];
  ingredientIds: string[];
  nutritionQueryParams: Record<string, number>;
};

const parseSearchQueryParams = (
  params: SearchResultsSearchParams
): ParsedSearchParams => {
  const page = Math.max(0, parseInt(params.page || "0", 10) || 0);
  const q = params.q || "";

  const tags = params.tags
    ? typeof params.tags === "string"
      ? params.tags.split(",").filter(Boolean)
      : params.tags
    : [];

  const sortCode =
    (params.sort || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
  const dishTypeCode = params.dishType || null;

  const nutritionParams = parseNutritionParams(params);
  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const types = parseTypes(params);

  const ingredientIds = params.ingredientIds
    ? params.ingredientIds.split(",").filter(Boolean)
    : [];

  return {
    query: {
      key: "search",
      page,
      q,
      sort: sortCode.toLowerCase() === "asc" ? "asc" : "desc",
      dishType: dishTypeCode || undefined,
      tags,
      types,
      ingredientIds: ingredientIds.length > 0 ? ingredientIds : undefined,
      ...nutritionQueryParams,
    },
    page,
    q,
    dishTypeCode,
    sortCode,
    tags,
    types,
    ingredientIds,
    nutritionQueryParams,
  };
};

export async function generateMetadata({
  searchParams,
}: SearchResultsPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const { query: queryParams, page, q } = parseSearchQueryParams(awaitedSearchParams);

  const pageData = await getRecipesOnServer(queryParams);
  const totalElements = pageData.page.totalElements;
  const firstImage = pageData.content[0]?.imageUrl;

  const title = buildSearchTitle(q, totalElements, page);
  const description = buildSearchDescription(q, totalElements);

  const ogImage = firstImage || SEO_CONSTANTS.DEFAULT_IMAGE;

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
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      siteName: SEO_CONSTANTS.SITE_NAME,
      locale: SEO_CONSTANTS.LOCALE,
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SEO_CONSTANTS.SITE_URL}/search/results${canonicalSearch ? `?${canonicalSearch}` : ""}`,
    },
  };
}

export default async function SearchResultsPage({
  searchParams,
}: SearchResultsPageProps) {
  const awaitedSearchParams = await searchParams;
  const {
    query: queryParams,
    page,
    q,
    dishTypeCode,
    sortCode,
    tags,
    types,
    ingredientIds,
    nutritionQueryParams,
  } = parseSearchQueryParams(awaitedSearchParams);

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: [
      "recipes",
      dishTypeCode,
      sortCode,
      tags.join(","),
      q,
      JSON.stringify(nutritionQueryParams),
      types.join(","),
      ingredientIds.join(","),
    ],
    queryFn: () => getRecipesOnServer(queryParams),
  });

  const pageData = await getRecipesOnServer(queryParams);

  const totalPages = pageData.page.totalPages;
  const hasNextPage = page < totalPages - 1;

  const nextPageHref = hasNextPage
    ? buildNextPageUrl(awaitedSearchParams, page + 1)
    : undefined;

  const title = buildSearchTitle(q, pageData.page.totalElements, page);
  const jsonLd = createSearchResultsJsonLd(
    q,
    pageData.content,
    pageData.page.totalElements,
    title
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SearchClient initialPage={page} nextPageHref={nextPageHref} />
    </HydrationBoundary>
  );
}
