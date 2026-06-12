import type { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  type InfiniteData,
  QueryClient,
} from "@tanstack/react-query";

import { absoluteUrl } from "@/shared/config/constants/api";
import { sortCodec } from "@/shared/lib/filters";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import {
  convertNutritionToQueryParams,
  parseNutritionParams,
  parseTypes,
} from "@/shared/lib/nutrition/parseNutritionParams";
import { buildNextPageUrl } from "@/shared/lib/pagination/buildPaginationUrl";
import { getNextPageParam } from "@/shared/lib/utils";

import {
  buildSearchDescription,
  buildSearchTitle,
} from "@/entities/recipe/lib/metadata/searchMeta";
import { getRecipesOnServer } from "@/entities/recipe/model/api.server";
import type {
  DetailedRecipesApiResponse,
  RecipeItemsQueryParams,
} from "@/entities/recipe/model/types";

import { SearchClient } from "@/widgets/SearchClient";
import { buildSearchQueryKey } from "@/widgets/SearchClient/hooks/useSearchResults";

const JA_SEARCH_BASE_PATH = "/ja/search/results";

type JaSearchResultsSearchParams = {
  page?: string;
  q?: string;
  sort?: string;
};

type JaSearchResultsPageProps = {
  searchParams: Promise<JaSearchResultsSearchParams>;
};

type ParsedJaSearchParams = {
  query: RecipeItemsQueryParams;
  page: number;
  q: string;
  sortCode: string;
  types: string[];
  nutritionQueryParams: Record<string, number>;
};

const parseJaSearchParams = (
  params: JaSearchResultsSearchParams
): ParsedJaSearchParams => {
  const page = Math.max(0, parseInt(params.page || "0", 10) || 0);
  const q = params.q || "";

  const sortCode =
    sortCodec.encode(sortCodec.decode(params.sort ?? null)) ??
    sortCodec.encode("인기순") ??
    "popularityScore,DESC";

  const nutritionParams = parseNutritionParams(params);
  const nutritionQueryParams = convertNutritionToQueryParams(nutritionParams);
  const types = parseTypes(params);

  return {
    query: {
      key: "search",
      page,
      q,
      sort: sortCode,
      types,
      lang: "ja",
      ...nutritionQueryParams,
    },
    page,
    q,
    sortCode,
    types,
    nutritionQueryParams,
  };
};

export async function generateMetadata({
  searchParams,
}: JaSearchResultsPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const { query, page, q } = parseJaSearchParams(awaitedSearchParams);

  const pageData = await getRecipesOnServer(query);
  const totalElements = pageData.page.totalElements;
  const firstImage = pageData.content[0]?.imageUrl;

  const title = buildSearchTitle(q, totalElements, page);
  const description = buildSearchDescription(q, totalElements);

  const ogImage = firstImage || SEO_CONSTANTS.DEFAULT_IMAGE;

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
      locale: "ja_JP",
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: absoluteUrl("ja/search/results"),
    },
  };
}

export default async function JaSearchResultsPage({
  searchParams,
}: JaSearchResultsPageProps) {
  const awaitedSearchParams = await searchParams;
  const { query, page, q, sortCode, types, nutritionQueryParams } =
    parseJaSearchParams(awaitedSearchParams);

  const queryClient = new QueryClient();

  const base9 = [
    "recipes",
    null,
    sortCode,
    "",
    q,
    JSON.stringify(nutritionQueryParams),
    types.join(","),
    "",
    "",
  ] as const;

  const queryKey = buildSearchQueryKey(base9, "ja");

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: () => getRecipesOnServer(query),
    initialPageParam: page,
    getNextPageParam,
    pages: 1,
  });

  const cached =
    queryClient.getQueryData<InfiniteData<DetailedRecipesApiResponse, number>>(
      queryKey
    );
  const firstPage: DetailedRecipesApiResponse = cached?.pages[0] ?? {
    content: [],
    page: { size: 0, number: page, totalElements: 0, totalPages: 0 },
  };

  const totalPages = firstPage.page.totalPages;
  const hasNextPage = page < totalPages - 1;

  const nextPageHref = hasNextPage
    ? buildNextPageUrl(awaitedSearchParams, page + 1, JA_SEARCH_BASE_PATH)
    : undefined;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchClient
        initialPage={page}
        nextPageHref={nextPageHref}
        locale="ja"
      />
    </HydrationBoundary>
  );
}
