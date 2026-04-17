import type { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  getIngredientNamesByIds,
  NUTRITION_THEMES_FOR_SEO,
  SEO_DISH_TYPE_ENTRIES,
  SEO_TAG_ENTRIES,
} from "@/shared/config/seo/seoPages";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import {
  convertNutritionToQueryParams,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";

import { createSearchResultsJsonLd } from "@/entities/recipe/lib/metadata/schema";
import {
  buildSearchDescription,
  buildSearchTitle,
} from "@/entities/recipe/lib/metadata/searchMeta";
import { getRecipesOnServer } from "@/entities/recipe/model/api.server";
import type { RecipeItemsQueryParams } from "@/entities/recipe/model/types";

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

const buildEnhancedQuery = (
  params: SearchResultsSearchParams,
  q: string
): string => {
  if (q) return q;

  const parts: string[] = [];

  // tags → 한글명
  if (params.tags) {
    const tagCodes = typeof params.tags === "string" ? params.tags.split(",") : params.tags;
    for (const code of tagCodes) {
      const tag = SEO_TAG_ENTRIES.find((t) => t.code === code);
      if (tag) parts.push(tag.name);
    }
  }

  // ingredientIds → 재료명
  if (params.ingredientIds) {
    const ids = params.ingredientIds.split(",").filter(Boolean);
    const names = getIngredientNamesByIds(ids);
    parts.push(...names);
  }

  // dishType → 한글명
  if (params.dishType) {
    const dish = SEO_DISH_TYPE_ENTRIES.find((d) => d.code === params.dishType);
    if (dish) parts.push(dish.name);
  }

  // maxCost
  if (params.maxCost) {
    const cost = parseInt(params.maxCost, 10);
    if (cost > 0) {
      parts.push(cost >= 10000 ? `${cost / 10000}만원 이하` : `${cost}원 이하`);
    }
  }

  // nutrition params → 테마 SEO 라벨 매칭
  const matchedTheme = NUTRITION_THEMES_FOR_SEO.find((theme) =>
    Object.entries(theme.params).every(([key, value]) => {
      const paramValue = params[key as keyof SearchResultsSearchParams];
      return paramValue !== undefined && parseInt(String(paramValue), 10) === value;
    })
  );
  if (matchedTheme) {
    parts.push(matchedTheme.seoLabel);
  }

  return parts.length > 0 ? parts.join(" ") : "";
};

const CANONICAL_PARAM_ORDER = [
  "q", "ingredientIds", "dishType", "tags", "types",
  "minCost", "maxCost",
  "minCalories", "maxCalories",
  "minCarb", "maxCarb",
  "minProtein", "maxProtein",
  "minFat", "maxFat",
  "minSugar", "maxSugar",
  "minSodium", "maxSodium",
  "sort", "page",
] as const;

const buildCanonicalUrl = (params: SearchResultsSearchParams): string => {
  const canonicalParams = new URLSearchParams();
  for (const key of CANONICAL_PARAM_ORDER) {
    const value = params[key as keyof SearchResultsSearchParams];
    if (value !== undefined) {
      canonicalParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }
  }
  const search = canonicalParams.toString();
  return `${SEO_CONSTANTS.SITE_URL}/search/results${search ? `?${search}` : ""}`;
};

export async function generateMetadata({
  searchParams,
}: SearchResultsPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const { query: queryParams, page, q } = parseSearchQueryParams(awaitedSearchParams);

  const pageData = await getRecipesOnServer(queryParams);
  const totalElements = pageData.page.totalElements;
  const firstImage = pageData.content[0]?.imageUrl;

  // 구조화된 파라미터에서 향상된 검색어 생성
  const enhancedQ = buildEnhancedQuery(awaitedSearchParams, q);

  const title = buildSearchTitle(enhancedQ, totalElements, page);
  const description = buildSearchDescription(enhancedQ, totalElements);

  const ogImage = firstImage || SEO_CONSTANTS.DEFAULT_IMAGE;
  const canonicalUrl = buildCanonicalUrl(awaitedSearchParams);

  const MIN_RESULTS_FOR_INDEX = 8;

  return {
    title,
    description,
    robots: {
      index: totalElements >= MIN_RESULTS_FOR_INDEX,
      follow: true,
    },
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
      canonical: canonicalUrl,
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

  const pageData = await queryClient.fetchQuery({
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

  const totalPages = pageData.page.totalPages;
  const hasNextPage = page < totalPages - 1;

  const nextPageHref = hasNextPage
    ? buildNextPageUrl(awaitedSearchParams, page + 1)
    : undefined;

  const enhancedQ = buildEnhancedQuery(awaitedSearchParams, q);
  const title = buildSearchTitle(enhancedQ, pageData.page.totalElements, page);
  const canonicalUrl = buildCanonicalUrl(awaitedSearchParams);
  const jsonLd = createSearchResultsJsonLd(
    enhancedQ,
    pageData.content,
    pageData.page.totalElements,
    title,
    canonicalUrl
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
