import { Suspense } from "react";
import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import {
  getIngredientNamesByIds,
  NUTRITION_THEMES_FOR_SEO,
  SEO_DISH_TYPE_ENTRIES,
  SEO_TAG_ENTRIES,
} from "@/shared/config/seo/seoPages";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";
import { buildRecipeSearchBaseKey } from "@/shared/lib/search/recipeSearchQueryKey";

import { createSearchResultsJsonLd } from "@/entities/recipe/lib/metadata/schema";
import {
  buildSearchDescription,
  buildSearchTitle,
} from "@/entities/recipe/lib/metadata/searchMeta";
import { getRecipesOnServer } from "@/entities/recipe/model/api.server";
import type { DetailedRecipesApiResponse } from "@/entities/recipe/model/types";

import { SearchClientShell } from "@/widgets/SearchClient";
import { SearchResultsData } from "@/widgets/SearchClient/server/SearchResultsData";
import { SearchGridSkeleton } from "@/widgets/SearchClient/ui/SearchResultsSkeleton";

import {
  parseSearchQueryParams,
  type SearchResultsSearchParams,
} from "./parseSearchParams";

type SearchResultsPageProps = {
  searchParams: Promise<SearchResultsSearchParams>;
};

const buildEnhancedQuery = (
  params: SearchResultsSearchParams,
  q: string
): string => {
  if (q) return q;

  const parts: string[] = [];

  if (params.tags) {
    const tagCodes =
      typeof params.tags === "string" ? params.tags.split(",") : params.tags;
    for (const code of tagCodes) {
      const tag = SEO_TAG_ENTRIES.find((t) => t.code === code);
      if (tag) parts.push(tag.name);
    }
  }

  if (params.ingredientIds) {
    const ids = params.ingredientIds.split(",").filter(Boolean);
    const names = getIngredientNamesByIds(ids);
    parts.push(...names);
  }

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

  const matchedTheme = NUTRITION_THEMES_FOR_SEO.find((theme) =>
    Object.entries(theme.params).every(([key, value]) => {
      const paramValue = params[key as keyof SearchResultsSearchParams];
      return (
        paramValue !== undefined && parseInt(String(paramValue), 10) === value
      );
    })
  );
  if (matchedTheme) {
    parts.push(matchedTheme.seoLabel);
  }

  return parts.length > 0 ? parts.join(" ") : "";
};

const CANONICAL_PARAM_ORDER = [
  "q",
  "ingredientIds",
  "dishType",
  "tags",
  "types",
  "minCost",
  "maxCost",
  "minCalories",
  "maxCalories",
  "minCarb",
  "maxCarb",
  "minProtein",
  "maxProtein",
  "minFat",
  "maxFat",
  "minSugar",
  "maxSugar",
  "minSodium",
  "maxSodium",
  "sort",
  "page",
] as const;

const buildCanonicalUrl = (params: SearchResultsSearchParams): string => {
  const canonicalParams = new URLSearchParams();
  for (const key of CANONICAL_PARAM_ORDER) {
    const value = params[key as keyof SearchResultsSearchParams];
    if (value !== undefined) {
      canonicalParams.set(
        key,
        Array.isArray(value) ? value.join(",") : String(value)
      );
    }
  }
  const search = canonicalParams.toString();
  return absoluteUrl(`search/results${search ? `?${search}` : ""}`);
};

export async function generateMetadata({
  searchParams,
}: SearchResultsPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const {
    query: queryParams,
    page,
    q,
  } = parseSearchQueryParams(awaitedSearchParams);

  const pageData = await getRecipesOnServer(queryParams);
  const firstImage = pageData.content[0]?.imageUrl;

  const enhancedQ = buildEnhancedQuery(awaitedSearchParams, q);

  const title = buildSearchTitle(enhancedQ, page, "ko");
  const description = buildSearchDescription(enhancedQ, "ko");

  const ogImage = firstImage || SEO_CONSTANTS.DEFAULT_IMAGE;
  const canonicalUrl = buildCanonicalUrl(awaitedSearchParams);

  return {
    title,
    description,
    robots: {
      index: false,
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
    creatorCountryTags,
    nutritionQueryParams,
  } = parseSearchQueryParams(awaitedSearchParams);

  const queryKey = buildRecipeSearchBaseKey({
    dishTypeCode,
    sortCode,
    tagCodes: tags,
    q,
    nutritionQueryParams,
    types,
    ingredientIds,
    creatorCountryTags,
  });

  const enhancedQ = buildEnhancedQuery(awaitedSearchParams, q);
  const title = buildSearchTitle(enhancedQ, page, "ko");
  const canonicalUrl = buildCanonicalUrl(awaitedSearchParams);

  const buildNextHref = (firstPage: DetailedRecipesApiResponse) =>
    firstPage.slice.hasNext
      ? buildNextPageUrl(awaitedSearchParams, page + 1)
      : undefined;

  return (
    <SearchClientShell>
      <Suspense fallback={<SearchGridSkeleton />}>
        <SearchResultsData
          queryKey={queryKey}
          queryFn={() => getRecipesOnServer(queryParams)}
          page={page}
          locale="ko"
          buildNextHref={buildNextHref}
          buildJsonLd={(firstPage) =>
            createSearchResultsJsonLd(
              enhancedQ,
              firstPage.content,
              title,
              canonicalUrl
            )
          }
        />
      </Suspense>
    </SearchClientShell>
  );
}
